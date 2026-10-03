# Gather - Meeting Room Booking

Gather is a small meeting room booking app. You can browse rooms, check bookings for a date, reserve a time, cancel a booking, and look for the next available slot.

## What I built it with

- Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons
- Node.js, Express, Prisma, and PostgreSQL

The assignment suggested FastAPI and Pydantic. I used the Node.js stack already in my project instead. The API has request validation and a Swagger page at `/docs`, but it does not use Pydantic.

## How I approached it

I spent most of my time on the backend rules and validation. A booking must have a valid date and time, stay within the 9:00 AM to 6:00 PM working hours, and start in the future. The frontend validates the form before sending the request, while the backend repeats the important checks so invalid requests cannot bypass the UI.

For booking conflicts, I treat each booking as a half-open interval [start, end). This handles partial overlaps, bookings completely inside another booking, and identical time ranges. It also allows back-to-back meetings, where one booking ends exactly when another starts.

The booking creation process runs inside a database transaction and uses a PostgreSQL advisory lock for the specific room and date. This ensures that simultaneous requests for the same room and date are handled one at a time, preventing both requests from passing the conflict check.

I also added centralized error handling to return clear messages to the client and prevent raw server errors from being exposed.

For the next available slot, the system sorts the room's bookings and checks the gaps between them from opening time to closing time. It returns the first gap that can fit the requested duration, including exact fits, or null when no suitable slot is available. For today's date, it starts checking from the current time so it does not suggest a slot that has already passed.

For the frontend, I looked at room-booking and workspace dashboard designs on Pinterest for layout inspiration. I then built a responsive dashboard with room cards, date and room filters, booking actions, and loading, empty, and error states.

I also used AI coding assistance during implementation and cleanup, mainly for the frontend, and reviewed and adjusted the generated code. The assignment requested candidates not to use AI, so I want to be transparent about this. I am comfortable explaining the booking logic, validation, and technical decisions made in the project.

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
