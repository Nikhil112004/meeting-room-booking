"use client";

import { useState } from "react";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { useBookingDashboard } from "@/hooks/use-booking-dashboard";
import { BookingDialog } from "@/components/booking-dialog";
import { BookingFilters } from "@/components/booking-filters";
import { BookingTimeline } from "@/components/booking-timeline";
import { HeroBanner } from "@/components/hero-banner";
import { RoomGrid } from "@/components/room-grid";
import { Sidebar } from "@/components/sidebar";
import { SummaryCards } from "@/components/summary-cards";
import { ToastStack } from "@/components/toast-stack";
import { TopNav } from "@/components/top-nav";
import { formatDateLabel } from "@/lib/date";
import type { Booking, Room } from "@/types/booking";

type Props = {
  initialDate: string;
  initialRooms: Room[];
  initialBookings: Booking[];
  initialRoomsError: string;
  initialBookingsError: string;
};

export function BookingDashboard({
  initialDate,
  initialRooms,
  initialBookings,
  initialRoomsError,
  initialBookingsError,
}: Props) {
  const {
    date, roomFilter, rooms, visibleRooms, bookings, roomsError, bookingsError,
    roomsLoading, bookingsLoading, dialogOpen, dialogRoom, dialogStart, dialogEnd,
    toasts, duration, findingSlot, setDialogOpen, setDuration, selectRoomFilter,
    openBooking, createBooking, cancelBooking, findSlot, selectDate, changeDate,
    retryRooms, retryBookings, dismissToast,
  } = useBookingDashboard({
    date: initialDate,
    rooms: initialRooms,
    bookings: initialBookings,
    roomsError: initialRoomsError,
    bookingsError: initialBookingsError,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const today = initialDate;
  const availableRooms = Math.max(
    rooms.length - new Set(bookings.map((booking) => booking.roomId)).size,
    0,
  );

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setMobileMenuOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  }

  return (
    <main className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
      <section className="main-column" id="top">
        <TopNav
          collapsed={sidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onToggle={toggleSidebar}
        />
        <div className="page-content">
          <section className="welcome-row">
            <div>
              <span className="eyebrow">
                <Sparkles size={14} /> A LITTLE ROOM FOR BIG IDEAS
              </span>
              <h1>
                Make room for <span>great work.</span>
              </h1>
              <p>Find your focus, bring your team together, and make today count.</p>
            </div>
            <div className="welcome-date">
              <span className="welcome-date-icon">
                <CalendarDays size={17} />
              </span>
              <span>
                <small>PLANNING FOR</small>
                <strong>{formatDateLabel(date)}</strong>
              </span>
            </div>
          </section>

          <HeroBanner onBook={() => openBooking()} />
          <SummaryCards
            rooms={rooms.length}
            bookings={bookings.length}
            availableRooms={availableRooms}
            roomsLoading={roomsLoading}
            bookingsLoading={bookingsLoading}
          />

          <section className="booking-section" id="rooms">
            <div className="section-heading">
              <div>
                <span className="eyebrow section-eyebrow">FIND YOUR SPACE</span>
                <h2>
                  Rooms for {date === today ? "today" : formatDateLabel(date)}{" "}
                  <span className="room-count">
                    {roomsLoading ? "" : rooms.length}
                  </span>
                </h2>
                <p>Thoughtful spaces for thoughtful work.</p>
              </div>
              <button
                type="button"
                className="button button-primary new-booking"
                onClick={() => openBooking()}
              >
                <Plus size={17} /> New booking
              </button>
            </div>

            <BookingFilters
              date={date}
              today={today}
              roomFilter={roomFilter}
              rooms={rooms}
              duration={duration}
              findingSlot={findingSlot}
              onDateChange={selectDate}
              onDateStep={changeDate}
              onRoomChange={selectRoomFilter}
              onDurationChange={setDuration}
              onFindSlot={findSlot}
            />
            {bookingsLoading && (
              <div className="loading-line">
                <span className="spinner" /> Updating availability...
              </div>
            )}
            <RoomGrid
              rooms={visibleRooms}
              bookings={bookings}
              roomsLoading={roomsLoading}
              bookingsLoading={bookingsLoading}
              roomsError={roomsError}
              bookingsError={bookingsError}
              onRetryRooms={retryRooms}
              onRetryBookings={retryBookings}
              onBook={openBooking}
              onCancel={cancelBooking}
            />
            <BookingTimeline
              date={date}
              rooms={rooms}
              bookings={bookings}
              onCancel={cancelBooking}
            />
          </section>

          <footer className="page-footer">
            <span>
              MADE FOR BETTER MEETINGS{" "}
              <span className="footer-flower">✳</span>
            </span>
            <a id="how-it-works" href="#top">
              Gather · Workspace booking
            </a>
          </footer>
        </div>
      </section>
      <BookingDialog
        open={dialogOpen}
        rooms={rooms}
        date={date}
        initialRoomId={dialogRoom}
        initialStartTime={dialogStart}
        initialEndTime={dialogEnd}
        onClose={() => setDialogOpen(false)}
        onSubmit={createBooking}
      />
      <ToastStack items={toasts} dismiss={dismissToast} />
    </main>
  );
}
