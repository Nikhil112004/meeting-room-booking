import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function TopNav({
  collapsed,
  mobileOpen,
  onToggle,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button
          type="button"
          className="sidebar-toggle icon-button"
          aria-label={mobileOpen ? "Close navigation menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
        >
          {collapsed && !mobileOpen ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
        <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>Bookings</strong></div>
      </div>
      <div className="topbar-right">
        <span className="live-indicator"><i /> Live availability</span>
        <button type="button" className="avatar avatar-small" title="Nikhil Gupta">NG</button>
      </div>
    </header>
  );
}
