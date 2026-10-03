import { AnimatePresence, motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import type { Booking, Room } from "@/types/booking";

const hours = [9, 11, 13, 15, 17];
const slots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

function minutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function BookingTimeline({
  date,
  rooms,
  bookings,
  onCancel,
}: {
  date: string;
  rooms: Room[];
  bookings: Booking[];
  onCancel: (booking: Booking) => void;
}) {
  const roomNames = new Map(rooms.map((room) => [room.id, room.name]));

  return (
    <div className="day-timeline">
      <div className="timeline-heading">
        <span className="timeline-icon"><Clock3 size={15} /></span>
        <div><strong>Your day, at a glance</strong><small>Working hours · 9:00 AM — 6:00 PM</small></div>
        <span className="timeline-date">
          {date && new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))}
        </span>
      </div>
      <div className="timeline-track">
        <div className="timeline-hours">
          {hours.map((hour) => <span key={hour}>{hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</span>)}
        </div>
        <div className="timeline-grid">
          {slots.map((hour) => <span key={hour} />)}
          <AnimatePresence>
            {bookings.map((booking) => {
              const roomIndex = rooms.findIndex((room) => room.id === booking.roomId);
              const start = minutes(booking.startTime);
              const end = minutes(booking.endTime);
              const left = Math.max(0, ((start - 540) / 540) * 100);
              const width = Math.min(100 - left, ((end - start) / 540) * 100);

              return (
                <motion.button
                  key={booking.id}
                  type="button"
                  title={`${booking.title} · ${booking.startTime}–${booking.endTime}`}
                  className={`timeline-booking timeline-color-${Math.max(roomIndex, 0) % 5}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  initial={{ opacity: 0, scaleX: 0.85 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onCancel(booking)}
                >
                  <b>{booking.title}</b>
                  <small>{roomNames.get(booking.roomId)} · {booking.startTime}–{booking.endTime}</small>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
