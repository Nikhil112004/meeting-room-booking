import { BookingDashboard } from "@/components/booking-dashboard";

import type { Booking, Room } from "@/types/booking";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
type ApiPayload<T> = { data?: T; message?: string };

async function fetchInitialData<T>(route: string) {
  try {
    const response = await fetch(`${API_URL}${route}`, { cache: "no-store" });
    const payload = (await response.json()) as ApiPayload<T>;
    if (!response.ok) {
      return { data: null, error: payload.message || `Request failed (${response.status})` };
    }
    return { data: payload.data ?? null, error: "" };
  } catch {
    return { data: null, error: "Could not connect to the booking server" };
  }
}

function getToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export default async function Home() {
  const date = getToday();
  const [roomsResult, bookingsResult] = await Promise.all([
    fetchInitialData<Room[]>("/api/rooms"),
    fetchInitialData<Booking[]>(`/api/bookings?date=${date}`),
  ]);

  return (
    <BookingDashboard
      initialDate={date}
      initialRooms={roomsResult.data || []}
      initialBookings={bookingsResult.data || []}
      initialRoomsError={roomsResult.error}
      initialBookingsError={bookingsResult.error}
    />
  );
}
