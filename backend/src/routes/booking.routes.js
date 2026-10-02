const express = require("express");
const { createBooking, getBookings,deleteBooking} = require("../controllers/booking.controller");
const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.delete("/:id", deleteBooking);

module.exports = bookingRouter;