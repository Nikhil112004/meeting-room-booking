import { Clock3, ChevronLeft, ChevronRight, LoaderCircle, Search } from "lucide-react";
import type { Booking, Room } from "@/types/booking";
import { DatePicker } from "@/components/date-picker";
import { RoomFilter } from "@/components/room-filter";

type Props = {
  date: string;
  today: string;
  roomFilter: string;
  rooms: Room[];
  duration: string;
  findingSlot: boolean;
  onDateChange: (date: string) => void;
  onDateStep: (days: number) => void;
  onRoomChange: (roomId: string) => void;
  onDurationChange: (duration: string) => void;
  onFindSlot: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function BookingFilters({
  date,
  today,
  roomFilter,
  rooms,
  duration,
  findingSlot,
  onDateChange,
  onDateStep,
  onRoomChange,
  onDurationChange,
  onFindSlot,
}: Props) {
  return (
    <>
      <div className="filter-bar">
        <div className="date-navigation">
          <button type="button" className="date-today" onClick={() => onDateChange(today)}>Today</button>
          <button type="button" className="icon-button nav-date" aria-label="Previous day" onClick={() => onDateStep(-1)}><ChevronLeft size={17} /></button>
          <button type="button" className="icon-button nav-date" aria-label="Next day" onClick={() => onDateStep(1)}><ChevronRight size={17} /></button>
          <DatePicker value={date} onChange={onDateChange} />
        </div>
        <RoomFilter rooms={rooms} value={roomFilter} onChange={onRoomChange} />
      </div>

      <div className="slot-finder">
        <div className="slot-finder-label">
          <span className="slot-finder-icon"><Clock3 size={17} /></span>
          <span><strong>Need a specific window?</strong><small>Find the earliest time that fits your meeting.</small></span>
        </div>
        <form onSubmit={onFindSlot} className="slot-finder-form">
          <label>
            <span className="sr-only">Meeting length in minutes</span>
            <input type="number" min="1" max="540" step="1" value={duration} onChange={(event) => onDurationChange(event.target.value)} />
            <span>min</span>
          </label>
          <button className="slot-search-button" type="submit" disabled={findingSlot || !roomFilter}>
            {findingSlot ? <LoaderCircle size={16} className="spin" /> : <Search size={16} />}
            Find a time
          </button>
        </form>
      </div>
    </>
  );
}
