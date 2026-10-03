import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "@/lib/api";
import type { Booking, BookingInput, Room } from "@/types/booking";
import type { ToastItem } from "@/components/toast-stack";

type InitialDashboardData = {
  date: string;
  rooms: Room[];
  bookings: Booking[];
  roomsError?: string;
  bookingsError?: string;
};

export function useBookingDashboard(initialData: InitialDashboardData) {
  const [date, setDate] = useState(initialData.date);
  const [roomFilter, setRoomFilter] = useState("");
  const [rooms, setRooms] = useState(initialData.rooms);
  const [bookings, setBookings] = useState(initialData.bookings);
  const [roomsError, setRoomsError] = useState(initialData.roomsError || "");
  const [bookingsError, setBookingsError] = useState(initialData.bookingsError || "");
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [roomsReloadKey, setRoomsReloadKey] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRoom, setDialogRoom] = useState<number>();
  const [dialogStart, setDialogStart] = useState<string>();
  const [dialogEnd, setDialogEnd] = useState<string>();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [duration, setDuration] = useState("45");
  const [findingSlot, setFindingSlot] = useState(false);
  const initialBookingsQuery = `${initialData.date}||0`;
  const lastBookingsQuery = useRef(initialBookingsQuery);

  const notify = useCallback(
    (message: string, kind: ToastItem["kind"] = "info") => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-3), { id, message, kind }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4800);
    },
    [],
  );

  useEffect(() => {
    if (initialData.roomsError) notify(initialData.roomsError, "error");
    if (initialData.bookingsError) notify(initialData.bookingsError, "error");
  }, [initialData.roomsError, initialData.bookingsError, notify]);

  useEffect(() => {
    if (roomsReloadKey === 0) return;
    let active = true;
    api.getRooms()
      .then(({ data }) => {
        if (active) {
          setRooms(data);
          setRoomsError("");
        }
      })
      .catch((error: Error) => {
        if (active) {
          setRoomsError(error.message);
          notify(error.message, "error");
        }
      })
      .finally(() => {
        if (active) setRoomsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [notify, roomsReloadKey]);

  useEffect(() => {
    if (!date) return;
    const queryKey = `${date}|${roomFilter}|${reloadKey}`;
    if (queryKey === lastBookingsQuery.current) return;
    lastBookingsQuery.current = queryKey;
    let active = true;
    api.getBookings(date, roomFilter ? Number(roomFilter) : undefined)
      .then(({ data }) => {
        if (active) {
          setBookings(data);
          setBookingsError("");
        }
      })
      .catch((error: Error) => {
        if (active) {
          setBookings([]);
          setBookingsError(error.message);
          notify(error.message, "error");
        }
      })
      .finally(() => {
        if (active) setBookingsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [date, roomFilter, reloadKey, notify]);

  const visibleRooms = roomFilter
    ? rooms.filter((room) => String(room.id) === roomFilter)
    : rooms;

  function openBooking(room?: Room, slot?: { startTime: string; endTime: string }) {
    setDialogRoom(room?.id);
    setDialogStart(slot?.startTime);
    setDialogEnd(slot?.endTime);
    setDialogOpen(true);
  }

  async function createBooking(input: BookingInput) {
    try {
      const response = await api.createBooking(input);
      notify(response.message || "Booking created successfully", "success");
      setBookingsLoading(true);
      setReloadKey((key) => key + 1);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not create booking", "error");
      return false;
    }
  }

  async function cancelBooking(booking: Booking) {
    const roomName = rooms.find((room) => room.id === booking.roomId)?.name ?? "this room";
    if (!window.confirm(`Cancel “${booking.title}” in ${roomName}?`)) return;
    try {
      const response = await api.cancelBooking(booking.id);
      notify(response.message || "Booking cancelled successfully", "success");
      setBookingsLoading(true);
      setReloadKey((key) => key + 1);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not cancel booking", "error");
    }
  }

  async function findSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requestedDuration = Number(duration);
    if (!roomFilter || !date || !Number.isInteger(requestedDuration) || requestedDuration < 1 || requestedDuration > 540) {
      notify("Choose a room, date, and a duration between 1 and 540 minutes.", "error");
      return;
    }

    setFindingSlot(true);
    try {
      const response = await api.getNextAvailable(Number(roomFilter), date, requestedDuration);
      if (!response.data) {
        notify("No available slot found for that duration.", "info");
        return;
      }
      notify(`Found an opening from ${response.data.startTime} to ${response.data.endTime}.`, "success");
      openBooking(rooms.find((room) => room.id === Number(roomFilter)), response.data);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not find an available slot", "error");
    } finally {
      setFindingSlot(false);
    }
  }

  function selectDate(nextDate: string) {
    if (nextDate === date) return;
    setBookingsLoading(true);
    setDate(nextDate);
  }

  function selectRoomFilter(roomId: string) {
    setBookingsLoading(true);
    setRoomFilter(roomId);
  }

  function changeDate(days: number) {
    const nextDate = new Date(`${date}T00:00:00Z`);
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    selectDate(nextDate.toISOString().slice(0, 10));
  }

  function retryRooms() {
    setRoomsLoading(true);
    setRoomsReloadKey((key) => key + 1);
  }

  function retryBookings() {
    setBookingsLoading(true);
    setReloadKey((key) => key + 1);
  }

  function dismissToast(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return {
    date,
    roomFilter,
    rooms,
    visibleRooms,
    bookings,
    roomsError,
    bookingsError,
    roomsLoading,
    bookingsLoading,
    dialogOpen,
    dialogRoom,
    dialogStart,
    dialogEnd,
    toasts,
    duration,
    findingSlot,
    setDialogOpen,
    setDuration,
    selectRoomFilter,
    openBooking,
    createBooking,
    cancelBooking,
    findSlot,
    selectDate,
    changeDate,
    retryRooms,
    retryBookings,
    dismissToast,
  };
}
