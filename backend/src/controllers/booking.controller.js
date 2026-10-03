const bookingService = require("../services/booking.service");
const { isValidDate, isInteger, isPositiveInteger, isValidTime } = require("../utils/validation");


const createBooking = async (req, res, next) => {
  try {
    const { roomId, title, date, startTime, endTime } = req.body || {};

    if (!roomId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }
    if (!isInteger(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Valid roomId is required",
      });
    }
    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Booking title must be a string",
      });
    }
    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking title cannot be empty",
      });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD format",
      });
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Time must be in HH:mm format",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    if (startTime < "09:00" || endTime > "18:00") {
      return res.status(400).json({
        success: false,
        message: "Booking must be within working hours (9:00 - 18:00)",
      });
    }

    const booking = await bookingService.createBooking({ roomId, title, date, startTime, endTime });
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    if (error.statusCode === 409 || error.statusCode === 404) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        conflict: error.conflict,
      });
    }

    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const { date, roomId } = req.query;
    if (roomId && !isInteger(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Valid roomId is required",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD format",
      });
    }

    const bookings = await bookingService.getBookings(date, roomId);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid booking id is required",
      });
    }

    const deleted = await bookingService.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getNextAvailable = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { date, duration } = req.query;

    if (!isInteger(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Valid roomId is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD format",
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration is required",
      });
    }

    if (!isPositiveInteger(duration)) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive integer",
      });
    }
    if (Number(duration) > 540) {
      return res.status(400).json({
        success: false,
        message: "Duration cannot exceed working hours (540 minutes)",
      });
    }

    const slot = await bookingService.getNextAvailableSlot(
      Number(roomId),
      date,
      Number(duration),
    );

    return res.status(200).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    if (error.message === "Room not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Invalid date") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking,
  getNextAvailable,
};
