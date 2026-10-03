"use client";

import { motion } from "framer-motion";
import { Armchair, ArrowUpRight, Clock3, Plus } from "lucide-react";
import type { Booking, Room } from "@/types/booking";

const accents = [
  "accent-apricot",
  "accent-sage",
  "accent-lilac",
  "accent-blue",
  "accent-rose",
  "accent-gold",
];

export function RoomCard({
  room,
  bookings,
  index,
  onBook,
  onCancel,
}: {
  room: Room;
  bookings: Booking[];
  index: number;
  onBook: (room: Room) => void;
  onCancel: (booking: Booking) => void;
}) {
  const upcoming = bookings
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const next = upcoming[0];
  return (
    <motion.article
      className="room-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.045, 0.2) }}
    >
      <div className={`room-art ${accents[index % accents.length]}`}>
        <div className="room-art-top">
          <span className="room-number">
            ROOM {String(index + 1).padStart(2, "0")}
          </span>
          <span className="capacity-pill">
            <Armchair size={13} /> Team space
          </span>
        </div>
        <div className="room-illustration">
          <span className="window-shape" />
          <span className="table-shape" />
          <span className="chair-shape chair-one" />
          <span className="chair-shape chair-two" />
          <span className="chair-shape chair-three" />
        </div>
        <span className="art-spark">✳</span>
      </div>
      <div className="room-card-body">
        <div className="room-title-row">
          <div>
            <h3>{room.name}</h3>
            <p>
              <span className={`availability-dot ${next ? "dot-busy" : ""}`} />
              {next
                ? `${upcoming.length} ${upcoming.length === 1 ? "booking" : "bookings"} today`
                : "Available all day"}
            </p>
          </div>
          <button
            type="button"
            className="round-arrow"
            aria-label={`Book ${room.name}`}
            onClick={() => onBook(room)}
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
        {next ? (
          <div className="next-booking">
            <span className="next-icon">
              <Clock3 size={15} />
            </span>
            <div>
              <span className="next-label">UP NEXT</span>
              <strong>{next.title}</strong>
              <small>
                {next.startTime} – {next.endTime}
              </small>
            </div>
            <button
              type="button"
              className="cancel-link"
              onClick={() => onCancel(next)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="open-slot">
            <span>First slot is yours</span>
            <button type="button" onClick={() => onBook(room)}>
              <Plus size={15} /> Reserve
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
