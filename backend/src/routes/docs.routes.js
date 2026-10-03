const express = require("express");

const docsRouter = express.Router();

const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Gather Meeting Room Booking API",
    version: "1.0.0",
    description: "Book rooms during working hours (09:00–18:00).",
  },
  paths: {
    "/api/rooms": {
      get: {
        summary: "List meeting rooms",
        responses: { 200: { description: "Room list" } },
      },
    },
    "/api/rooms/{roomId}/next-available": {
      get: {
        summary: "Find the earliest available slot",
        parameters: [
          { name: "roomId", in: "path", required: true, schema: { type: "integer" } },
          { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } },
          { name: "duration", in: "query", required: true, schema: { type: "integer", minimum: 1, maximum: 540 } },
        ],
        responses: {
          200: { description: "Earliest slot, or null when no slot fits" },
          400: { description: "Invalid date or duration" },
          404: { description: "Room not found" },
        },
      },
    },
    "/api/bookings": {
      get: {
        summary: "List bookings for a date, optionally filtered by room",
        parameters: [
          { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } },
          { name: "roomId", in: "query", required: false, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Booking list" }, 400: { description: "Invalid query" } },
      },
      post: {
        summary: "Create a booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roomId", "title", "date", "startTime", "endTime"],
                properties: {
                  roomId: { type: "integer" },
                  title: { type: "string", minLength: 1 },
                  date: { type: "string", format: "date" },
                  startTime: { type: "string", example: "10:00" },
                  endTime: { type: "string", example: "11:00" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Booking created" },
          400: { description: "Invalid booking details" },
          404: { description: "Room not found" },
          409: { description: "Room/time conflict; response includes the conflicting booking" },
        },
      },
    },
    "/api/bookings/{id}": {
      delete: {
        summary: "Cancel a booking",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Booking cancelled" }, 404: { description: "Booking not found" } },
      },
    },
  },
};

docsRouter.get("/openapi.json", (req, res) => res.json(openApiDocument));

docsRouter.get("/docs", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gather API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>SwaggerUIBundle({ url: "/openapi.json", dom_id: "#swagger-ui" });</script>
  </body>
</html>`);
});

module.exports = docsRouter;
