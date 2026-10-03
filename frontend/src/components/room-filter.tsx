"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";
import type { Room } from "@/types/booking";
import { useDismiss } from "@/hooks/useDismiss";

export function RoomFilter({
  rooms,
  value,
  onChange,
}: {
  rooms: Room[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedRoom = rooms.find((room) => String(room.id) === value);

  useDismiss(rootRef, open, setOpen);

  function chooseRoom(nextValue: string) {
    if (nextValue !== value) onChange(nextValue);
    setOpen(false);
  }

  return (
    <div className="room-filter-wrap" ref={rootRef}>
      <button
        type="button"
        className={`room-filter-trigger ${open ? "is-open" : ""}`}
        aria-label="Filter by room"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="room-filter-options"
        onClick={() => setOpen((current) => !current)}
      >
        <Search size={16} aria-hidden="true" />
        <span>{selectedRoom?.name ?? "All meeting rooms"}</span>
        <ChevronDown
          size={15}
          className="room-filter-chevron"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="room-filter-options"
            className="room-filter-menu"
            role="listbox"
            aria-label="Meeting rooms"
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={`room-filter-option ${!value ? "selected" : ""}`}
              onClick={() => chooseRoom("")}
            >
              <span>All meeting rooms</span>
              {!value && <Check size={15} />}
            </button>
            {rooms.map((room) => {
              const roomValue = String(room.id);
              const selected = value === roomValue;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`room-filter-option ${selected ? "selected" : ""}`}
                  key={room.id}
                  onClick={() => chooseRoom(roomValue)}
                >
                  <span>{room.name}</span>
                  {selected && <Check size={15} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
