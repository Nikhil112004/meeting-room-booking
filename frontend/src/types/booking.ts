export interface Room {
  id: number;
  name: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  roomId: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export type BookingInput = Pick<
  Booking,
  "roomId" | "title" | "date" | "startTime" | "endTime"
>;
