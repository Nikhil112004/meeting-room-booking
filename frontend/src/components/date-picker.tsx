"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { formatShortDate, getIndiaDateTime } from "@/lib/date";
import { useDismiss } from "@/hooks/useDismiss";

const keyFor = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
};
const fromKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
const firstOfMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    firstOfMonth(value ? fromKey(value) : new Date()),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const todayKey = getIndiaDateTime().date;
  const selectedDate = value ? fromKey(value) : null;
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(visibleMonth);

  useDismiss(rootRef, open, setOpen);

  function shiftMonth(amount: number) {
    setVisibleMonth(
      (month) =>
        new Date(
          Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + amount, 1),
        ),
    );
  }

  function chooseDate(nextDate: Date) {
    onChange(keyFor(nextDate));
    setOpen(false);
  }

  const monthStart = firstOfMonth(visibleMonth);
  const mondayOffset = (monthStart.getUTCDay() + 6) % 7;
  const gridStart = new Date(
    Date.UTC(
      monthStart.getUTCFullYear(),
      monthStart.getUTCMonth(),
      1 - mondayOffset,
    ),
  );
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setUTCDate(gridStart.getUTCDate() + index);
    return day;
  });

  return (
    <div className="date-picker-wrap" ref={rootRef}>
      <button
        type="button"
        className={`date-picker-trigger ${open ? "is-open" : ""}`}
        aria-label="Choose booking date"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="booking-date-calendar"
        onClick={() => {
          if (!open && value) setVisibleMonth(firstOfMonth(fromKey(value)));
          setOpen((current) => !current);
        }}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <span>{formatShortDate(value)}</span>
        <ChevronDown
          size={14}
          className="date-picker-chevron"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="booking-date-calendar"
            className="calendar-popover"
            role="dialog"
            aria-label="Choose a booking date"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="calendar-header">
              <div>
                <span className="calendar-overline">BOOK A ROOM</span>
                <strong>{monthLabel}</strong>
              </div>
              <div className="calendar-month-nav">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => shiftMonth(-1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => shiftMonth(1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="calendar-weekdays" aria-hidden="true">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-days">
              {days.map((day) => {
                const dayKey = keyFor(day);
                const inMonth =
                  day.getUTCMonth() === visibleMonth.getUTCMonth();
                const selected = dayKey === value;
                const isToday = dayKey === todayKey;
                return (
                  <button
                    key={dayKey}
                    type="button"
                    className={`calendar-day ${inMonth ? "" : "outside-month"} ${selected ? "selected" : ""} ${isToday ? "today" : ""}`}
                    aria-label={new Intl.DateTimeFormat("en", {
                      dateStyle: "full",
                      timeZone: "UTC",
                    }).format(day)}
                    aria-pressed={selected}
                    onClick={() => chooseDate(day)}
                  >
                    {day.getUTCDate()}
                  </button>
                );
              })}
            </div>
            <div className="calendar-footer">
              <span>
                {selectedDate
                  ? `Selected · ${formatShortDate(value)}`
                  : "Select a day"}
              </span>
              <button
                type="button"
                onClick={() => chooseDate(fromKey(todayKey))}
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
