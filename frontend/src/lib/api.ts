import type { Booking, BookingInput, Room } from "@/types/booking";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type ApiResponse<T> = { message?: string; data: T };

async function callApi<T>(route: string, method = "GET", body?: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${route}`, {
    method,
    cache: "no-store",
    ...(body !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

export const api = {
  getRooms: () => callApi<Room[]>("/api/rooms"),

  getBookings: (date: string, roomId?: number) => {
    const params = new URLSearchParams({ date });
    if (roomId !== undefined) {
      params.set("roomId", String(roomId));
    }
    return callApi<Booking[]>(`/api/bookings?${params.toString()}`);
  },

  createBooking: (booking: BookingInput) => callApi<Booking>("/api/bookings", "POST", booking),

  cancelBooking: (id: number) => callApi<null>(`/api/bookings/${id}`, "DELETE"),

  getNextAvailable: (roomId: number, date: string, duration: number) => {
    const params = new URLSearchParams({ date, duration: String(duration) });
    return callApi<{ startTime: string; endTime: string } | null>(`/api/rooms/${roomId}/next-available?${params.toString()}`);
  },
};
