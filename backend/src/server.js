const express = require("express");
const cors = require("cors");
require("dotenv").config();
const roomRouter = require("./routes/room.routes");
const bookingRouter = require("./routes/booking.routes");
const docsRouter = require("./routes/docs.routes");
const errorHandler = require("./middleware/error.middleware");
const app = express();



app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Meeting Room Booking API is running",
    });
});

app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use(docsRouter);

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
