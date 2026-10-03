import { Armchair, CalendarDays, DoorOpen } from "lucide-react";

export function SummaryCards({
  rooms,
  bookings,
  availableRooms,
  roomsLoading,
  bookingsLoading,
}: {
  rooms: number;
  bookings: number;
  availableRooms: number;
  roomsLoading: boolean;
  bookingsLoading: boolean;
}) {
  return (
    <section className="stats-row" aria-label="Booking summary">
      <div className="stat-block">
        <span className="stat-symbol stat-blue"><DoorOpen size={17} /></span>
        <span><strong>{roomsLoading ? "—" : rooms}</strong><small>ROOMS TO EXPLORE</small></span>
      </div>
      <span className="stat-divider" />
      <div className="stat-block">
        <span className="stat-symbol stat-orange"><CalendarDays size={17} /></span>
        <span><strong>{bookingsLoading ? "—" : bookings}</strong><small>BOOKINGS THIS DAY</small></span>
      </div>
      <span className="stat-divider" />
      <div className="stat-block">
        <span className="stat-symbol stat-green"><Armchair size={17} /></span>
        <span><strong>{roomsLoading || bookingsLoading ? "—" : availableRooms}</strong><small>ROOMS WITH NO BOOKINGS</small></span>
      </div>
      <div className="stats-message"><span className="message-dot" /> A little breathing room makes for better ideas.</div>
    </section>
  );
}
