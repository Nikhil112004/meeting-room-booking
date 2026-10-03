import { Check, ChevronRight, Plus, Sparkles } from "lucide-react";

export function HeroBanner({ onBook }: { onBook: () => void }) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="hero-kicker">YOUR TEAM, IN SYNC</span>
        <h2>Good things happen<br />when we <em>get together.</em></h2>
        <p>Pick a room. Find a time. We&apos;ll take care of the rest.</p>
        <button type="button" className="hero-button" onClick={onBook}>
          <Plus size={17} /> Book a room <ChevronRight size={16} />
        </button>
        <div className="hero-meta">
          <span><Check size={14} /> Easy scheduling</span>
          <span><Check size={14} /> No double bookings</span>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-sun" />
        <div className="hero-window"><span /><span /><span /><span /></div>
        <div className="hero-plant plant-left"><i /><i /><i /><b /></div>
        <div className="hero-plant plant-right"><i /><i /><i /><b /></div>
        <div className="hero-table"><i /><i /></div>
        <div className="hero-chair chair-a" />
        <div className="hero-chair chair-b" />
        <div className="hero-chair chair-c" />
        <span className="hero-note">A better day<br />starts here <Sparkles size={14} /></span>
      </div>
    </section>
  );
}
