const prisma = require("../lib/prisma");
const { toUtcDate, getIndiaDateTime, isPastDateTime } = require("../utils/validation");

const createBooking = async ({ roomId, title, date, startTime, endTime }) => {
  const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  const parsedDate = toUtcDate(date);
  return prisma.$transaction(async (tx) => {
    // Serialize creates for this room and date so concurrent requests cannot both pass the overlap check.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`${roomId}:${date}`}))::text`;

    if (isPastDateTime(date, startTime)) {
      const error = new Error("Bookings must be for a future date and time.");
      error.statusCode = 400;
      throw error;
    }

    // Half-open ranges allow a new meeting to begin exactly when another one ends.
    const conflictingBooking = await tx.booking.findFirst({
      where: {
        roomId: Number(roomId), date: parsedDate,
        startTime: { lt: endTime }, endTime: { gt: startTime },
      },
    });

    if (conflictingBooking) {
      const error = new Error(
        `Booking "${conflictingBooking.title}" (#${conflictingBooking.id}) already uses this room from ${conflictingBooking.startTime} to ${conflictingBooking.endTime}`,
      );
      error.statusCode = 409;
      error.conflict = conflictingBooking;
      throw error;
    }

    return tx.booking.create({
      data: { roomId: Number(roomId), title: title.trim(), date: parsedDate, startTime, endTime },
    });
  });
};

const getBookings = (date, roomId) => prisma.booking.findMany({
  where: { date: toUtcDate(date), ...(roomId && { roomId: Number(roomId) }) },
  orderBy: [{ roomId: "asc" }, { startTime: "asc" }],
});

const deleteBooking = async (id) => {
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  if (!booking) return false;
  await prisma.booking.delete({ where: { id: Number(id) } });
  return true;
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const getNextAvailableSlot = async (roomId, date, duration) => {
  const parsedDate = toUtcDate(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
    throw new Error("Duration must be a positive integer");
  }

   const room = await prisma.room.findUnique({
    where: {
      id: Number(roomId),
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      roomId: Number(roomId),
      date: parsedDate,
    },
    orderBy: {
      startTime: "asc",
    },
  });

 

  const bookingSlots = bookings.map((booking) => ({
    start: timeToMinutes(booking.startTime),
    end: timeToMinutes(booking.endTime),
  }));

  const WORK_START = 9 * 60;
  const WORK_END = 18 * 60;
  const requestedDuration = Number(duration);
  const now = getIndiaDateTime();
  const currentMinute = timeToMinutes(now.time) + (now.second > 0 ? 1 : 0);
  const workStart = date === now.date ? Math.max(WORK_START, currentMinute) : WORK_START;

  if (workStart >= WORK_END) return null;

  if (bookingSlots.length === 0) {
    if (workStart + requestedDuration <= WORK_END) {
      return {
        startTime: minutesToTime(workStart),
        endTime: minutesToTime(workStart + requestedDuration),
      };
    }

    return null;
  }

  let currentTime = workStart;

  // Sorted bookings let us advance one cursor through gaps from opening time to closing time.
  for (const booking of bookingSlots) {
    const gap = booking.start - currentTime;

    if (gap >= requestedDuration) {
      return {
        startTime: minutesToTime(currentTime),
        endTime: minutesToTime(currentTime + requestedDuration),
      };
    }

    currentTime = Math.max(currentTime, booking.end);
  }
  if (WORK_END - currentTime >= requestedDuration) {
    return {
      startTime: minutesToTime(currentTime),
      endTime: minutesToTime(currentTime + requestedDuration),
    };
  }
  return null;
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking,
  getNextAvailableSlot,
};
