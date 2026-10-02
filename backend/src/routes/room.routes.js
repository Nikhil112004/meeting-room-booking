const express = require("express");
const { getRooms } = require("../controllers/room.controller");
const { getNextAvailable } = require("../controllers/booking.controller");

const roomRouter = express.Router();

roomRouter.get("/", getRooms);
roomRouter.get("/:roomId/next-available", getNextAvailable);

module.exports = roomRouter;
