"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3, DoorOpen, X } from "lucide-react";
import { useState } from "react";
import type { BookingInput, Room } from "@/types/booking";

function BookingForm({
  rooms,
  date,
  initialRoomId,
  initialStartTime,
  initialEndTime,
  onClose,
  onSubmit,
}: {
  rooms: Room[];
  date: string;
  initialRoomId?: number;
  initialStartTime?: string;
  initialEndTime?: string;
  onClose: () => void;
  onSubmit: (booking: BookingInput) => Promise<boolean>;
}) {
  const [roomId, setRoomId] = useState(
    String(initialRoomId ?? rooms[0]?.id ?? ""),
  );
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(initialStartTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialEndTime ?? "10:00");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !roomId ||
      !title.trim() ||
      !date ||
      startTime >= endTime ||
      startTime < "09:00" ||
      endTime > "18:00"
    )
      return;
    setSaving(true);
    try {
      const saved = await onSubmit({
        roomId: Number(roomId),
        title: title.trim(),
        date,
        startTime,
        endTime,
      });
      if (saved) onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label className="field-label">
        Meeting title
        <input
          autoFocus
          required
          maxLength={80}
          placeholder="e.g. Product weekly sync"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label className="field-label">
        Room
        <span className="input-with-icon">
          <DoorOpen size={17} />
          <select
            required
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
          >
            {rooms.map((room) => (
              <option value={room.id} key={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label className="field-label">
        Date
        <span className="input-with-icon">
          <CalendarDays size={17} />
          <input required type="date" value={date} readOnly />
        </span>
      </label>
      <div className="time-fields">
        <label className="field-label">
          Starts
          <input
            required
            type="time"
            min="09:00"
            max="17:59"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </label>
        <span className="time-arrow">
          <ArrowRight size={16} />
        </span>
        <label className="field-label">
          Ends
          <input
            required
            type="time"
            min="09:01"
            max="18:00"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </label>
      </div>
      <p className="form-hint">
        <Clock3 size={14} /> Bookings are available between 9:00 AM and 6:00 PM.
      </p>
      <div className="dialog-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="button button-primary"
          disabled={saving || !rooms.length}
        >
          {saving ? <span className="spinner" /> : "Confirm booking"}
        </button>
      </div>
    </form>
  );
}

export function BookingDialog({
  open,
  rooms,
  date,
  initialRoomId,
  initialStartTime,
  initialEndTime,
  onClose,
  onSubmit,
}: {
  open: boolean;
  rooms: Room[];
  date: string;
  initialRoomId?: number;
  initialStartTime?: string;
  initialEndTime?: string;
  onClose: () => void;
  onSubmit: (booking: BookingInput) => Promise<boolean>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) =>
            event.target === event.currentTarget && onClose()
          }
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="booking-dialog"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dialog-heading">
              <div>
                <span className="eyebrow">MAKE IT A GOOD MEETING</span>
                <h2 id="booking-title">Book a room</h2>
                <p>Your team&apos;s next great idea needs a place.</p>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
              >
                <X size={19} />
              </button>
            </div>
            {open && (
              <BookingForm
                key={`${initialRoomId ?? "all"}-${initialStartTime ?? "default"}-${initialEndTime ?? "default"}-${date}`}
                rooms={rooms}
                date={date}
                initialRoomId={initialRoomId}
                initialStartTime={initialStartTime}
                initialEndTime={initialEndTime}
                onClose={onClose}
                onSubmit={onSubmit}
              />
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
