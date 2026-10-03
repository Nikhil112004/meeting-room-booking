# Gather - Meeting Room Booking

Gather is a small meeting room booking app. You can browse rooms, check bookings for a date, reserve a time, cancel a booking, and look for the next available slot.

## What I built it with

- Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons
- Node.js, Express, Prisma, and PostgreSQL

The assignment suggested FastAPI and Pydantic. I used the Node.js stack already in my project instead. The API has request validation and a Swagger page at `/docs`, but it does not use Pydantic.

## How I approached it

I spent most of my project time on the backend rules and validation. A booking must have a valid date and time, stay within 9:00 AM to 6:00 PM, and start in the future. The frontend checks the form before sending it, and the backend repeats the important checks so that invalid requests cannot bypass the UI.

For conflicts, I treat a booking as the half-open interval `[start, end)`. The database query catches partial overlaps, bookings inside another booking, and identical ranges. It allows back-to-back meetings because an end time can equal the next start time. 

The create operation runs in a transaction and takes a PostgreSQL advisory lock for that room and date before checking and inserting. This serializes competing requests for the same room and date, so they cannot both pass the conflict check at once. A shared error handler returns clear client messages, maps database connection failures to a service-unavailable response, and avoids sending raw server errors to the browser.

The next-available lookup sorts a room's bookings and walks through the gaps from opening time to closing time. It returns the first gap that fits the requested duration, including an exact fit, or `null` if there is no slot. For today's date it starts at the current minute (rounded forward when needed), so it does not suggest a slot that has already passed.

For the interface, I looked at room-booking and workspace dashboard examples on Pinterest for layout ideas, then made a responsive dashboard with room cards, date and room filters, booking actions, and feedback for loading, empty, and error states.

I also used AI coding assistance during implementation and cleanup, especially on the frontend, and reviewed and adjusted the resulting code. The assignment asked candidates not to use AI, so I want to be clear about that. I am prepared to explain the booking rules and the choices in this code.

## Run it locally

You need Node.js and a PostgreSQL database.

### Backend

1. Open `backend` and copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your PostgreSQL connection string. `PORT` is optional and defaults to `5000`.
3. Install and start the API:

   ```sh
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   npm run dev
   ```

The seed command can be run more than once; it only creates predefined rooms that are missing.

### Frontend

1. Open `frontend` and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to the backend base URL. For local development, use `http://localhost:5000`.
3. Install and start Next.js:

   ```sh
   npm install
   npm run dev
   ```

Open `http://localhost:3000`.

## Environment variables

| Variable              | Where    | Purpose                      |
| --------------------- | -------- | ---------------------------- |
| `DATABASE_URL`        | Backend  | PostgreSQL connection string |
| `PORT`                | Backend  | API port; defaults to `5000` |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend base URL             |

## API routes

- `GET /api/rooms`
- `GET /api/bookings?date=YYYY-MM-DD&roomId=optional`
- `POST /api/bookings`
- `DELETE /api/bookings/:id`
- `GET /api/rooms/:roomId/next-available?date=YYYY-MM-DD&duration=45`
- `GET /docs` for Swagger UI; `GET /openapi.json` for its specification

## Deployment and remaining work

The app is prepared for a PostgreSQL host, Render backend, and Vercel frontend, but live deployment and link checks are not complete yet. Database-backed integration checks also remain to be done. A frontend TypeScript check was attempted but ran out of available Node.js memory before it finished.
