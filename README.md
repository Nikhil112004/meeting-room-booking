# Gather — Meeting Room Booking

A meeting room booking app with date and room filters, cancellation, conflict detection, and an earliest available slot lookup.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide
- Backend: Node.js, Express, Prisma, and PostgreSQL

The supplied assignment names FastAPI and Pydantic as mandatory. This implementation uses the Node/Express stack instead, as agreed for this project. It provides equivalent request validation and an OpenAPI/Swagger UI at `/docs`; it does not use Pydantic.

## Run locally

### Backend

1. Create a PostgreSQL database.
2. In `backend`, copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Run:

   ```sh
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   npm run dev
   ```

The API listens on port `5000` by default. Set `PORT` to override it. Seed can be run more than once; it creates only missing predefined rooms.

### Frontend

1. In `frontend`, copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to the backend base URL (locally, `http://localhost:5000`).
3. Run:

   ```sh
   npm install
   npm run dev
   ```

Open `http://localhost:3000`.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `PORT` | Backend | HTTP port; defaults to `5000` |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend base URL used by server and browser requests |

## API

- `GET /api/rooms`
- `GET /api/bookings?date=YYYY-MM-DD&roomId=optional`
- `POST /api/bookings`
- `DELETE /api/bookings/:id`
- `GET /api/rooms/:roomId/next-available?date=YYYY-MM-DD&duration=45`
- `GET /docs` — Swagger UI; `/openapi.json` serves its specification.

## Booking logic

Bookings use half-open time ranges: `[start, end)`. The overlap query therefore rejects partial, contained, and identical overlaps while allowing a booking to start exactly when another ends. A PostgreSQL transaction lock serializes creates for the same room and date, so two simultaneous requests cannot both pass the conflict check.

Past dates and start times that have already passed in India time are rejected with HTTP 400 and a clear message. The form performs the same check before sending a request. Next-slot lookup rejects past dates and, for today, starts searching from the next available minute so it never suggests a slot that has already passed.

For next-slot lookup, bookings are read in start-time order. A cursor moves from 09:00 across each booking and checks each gap, then checks the remaining time through 18:00. For today, the cursor starts at the current time (rounded up to the next minute when needed). The first gap large enough for the requested duration is returned; no fit returns `null`.

## Deployment

- PostgreSQL: provision a Render, Neon, or Supabase database and set `DATABASE_URL` on the backend service.
- Backend on Render: use `backend` as the root directory, `npm install && npx prisma generate` as the build command, and `npm start` as the start command. Apply migrations and seed rooms as a release/deploy step with `npx prisma migrate deploy && npm run seed`.
- Frontend on Vercel: use `frontend` as the root directory and set `NEXT_PUBLIC_API_URL` to the deployed backend URL.

Live URLs are not included yet; deployment and live-link checks are still pending.

## Current verification

Backend JavaScript syntax checks pass. The frontend TypeScript check was attempted but ran out of available Node.js memory before it could finish. Database-backed integration checks and deployed-link checks remain to be done.
