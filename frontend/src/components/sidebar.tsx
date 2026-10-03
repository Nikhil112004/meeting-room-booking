import { ArrowDown, CalendarDays, CircleHelp, ChevronDown, LayoutGrid } from "lucide-react";

export function Sidebar({
  collapsed,
  mobileOpen,
  closeMobileMenu,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  closeMobileMenu: () => void;
}) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <a className="brand" href="#top" aria-label="Gather home">
        <span className="brand-mark"><span /><span /><span /><span /></span>
        <span>gather<span className="brand-period">.</span></span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        <a className="side-link" href="#rooms" onClick={closeMobileMenu}>
          <LayoutGrid size={18} /><span>Overview</span>
        </a>
        <a className="side-link active" href="#rooms" onClick={closeMobileMenu}>
          <CalendarDays size={18} /><span>Room bookings</span><span className="nav-indicator" />
        </a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon"><CircleHelp size={18} /></span>
          <strong>Need a hand?</strong>
          <p>Make space for better meetings.</p>
          <a href="#how-it-works">How it works <ArrowDown size={13} /></a>
        </div>
        <div className="profile-row">
          <span className="avatar">NG</span>
          <span className="profile-name">Nikhil Gupta<small>Workspace member</small></span>
          <ChevronDown size={16} />
        </div>
      </div>
    </aside>
  );
}
