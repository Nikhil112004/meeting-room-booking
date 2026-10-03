import { motion } from "framer-motion";
import { Armchair, CircleHelp, RefreshCw } from "lucide-react";
import type { Booking, Room } from "@/types/booking";
import { RoomCard } from "@/components/room-card";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  roomsLoading: boolean;
  bookingsLoading: boolean;
  roomsError: string;
  bookingsError: string;
  onRetryRooms: () => void;
  onRetryBookings: () => void;
  onBook: (room: Room) => void;
  onCancel: (booking: Booking) => void;
};

function RetryState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <motion.div className="empty-state error-state" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty-icon"><CircleHelp size={22} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      <button type="button" className="button button-quiet retry-button" onClick={onRetry}>
        <RefreshCw size={14} /> Try again
      </button>
    </motion.div>
  );
}

export function RoomGrid({
  rooms,
  bookings,
  roomsLoading,
  bookingsLoading,
  roomsError,
  bookingsError,
  onRetryRooms,
  onRetryBookings,
  onBook,
  onCancel,
}: Props) {
  return (
    <div className="room-grid" aria-busy={roomsLoading || bookingsLoading}>
      {roomsLoading ? (
        Array.from({ length: 3 }, (_, index) => (
          <div className="room-skeleton" key={index}><span /><span /><span /></div>
        ))
      ) : roomsError ? (
        <RetryState title="Couldn’t load meeting rooms" message={roomsError} onRetry={onRetryRooms} />
      ) : bookingsError ? (
        <RetryState title="Couldn’t load this day’s bookings" message={bookingsError} onRetry={onRetryBookings} />
      ) : rooms.length ? (
        rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            bookings={bookings.filter((booking) => booking.roomId === room.id)}
            index={index}
            onBook={onBook}
            onCancel={onCancel}
          />
        ))
      ) : (
        <motion.div className="empty-state" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span className="empty-icon"><Armchair size={22} /></span>
          <h3>No rooms found</h3>
          <p>There are no meeting rooms to show right now.</p>
        </motion.div>
      )}
    </div>
  );
}
