import type { RefObject } from "react";
import { NavLink } from "react-router";
import { SIDEBAR_GROUPS, type NavIconName } from "../utils/navigation";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
}

function NavIcon({ name }: { name: NavIconName }) {
  const common = "h-4 w-4 shrink-0";
  switch (name) {
    case "overview":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
      );
    case "workspace":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M12.2 3.8l-1.4 1.4M5.2 10.8l-1.4 1.4" />
          <circle cx="8" cy="8" r="2.2" />
        </svg>
      );
    case "tasks":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 8.2l1.7 1.7 3.3-3.5" />
        </svg>
      );
    case "reports":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 13V7M8 13V3M13 13V9" />
        </svg>
      );
    case "approvals":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
          <path d="M5.5 8l1.8 1.8L10.8 6" />
        </svg>
      );
    case "team":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="6" cy="5.5" r="2.2" />
          <path d="M2.5 13c.4-2 1.8-3 3.5-3s3.1 1 3.5 3" />
          <circle cx="11.5" cy="6" r="1.7" />
          <path d="M10.5 10.3c1.4.2 2.5 1.1 2.9 2.7" />
        </svg>
      );
    case "profile":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="8" cy="5.5" r="2.5" />
          <path d="M3 13.5c.6-2.4 2.5-3.5 5-3.5s4.4 1.1 5 3.5" />
        </svg>
      );
    case "settings":
      return (
        <svg className={common} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="8" cy="8" r="2.2" />
          <path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1" />
        </svg>
      );
  }
}

export function Sidebar({ isOpen, onClose, closeButtonRef }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-canvas/75 lg:hidden"
        />
      )}

      <aside
        id="relay-sidebar"
        aria-label="Primary Navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[232px] shrink-0 flex-col border-r border-border-default bg-surface-1 transition-transform duration-150 motion-reduce:transition-none lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-default px-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-4 w-4 grid-cols-2 gap-0.5"
            >
              <span className="rounded-[1px] bg-accent-cyan" />
              <span className="rounded-[1px] bg-border-interactive" />
              <span className="rounded-[1px] bg-border-interactive" />
              <span className="rounded-[1px] bg-accent-cyan/70" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-text-primary">
              RELAY
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary hover:bg-surface-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan lg:hidden"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.name}>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
                {group.name}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-[6px] border px-2.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                          isActive
                            ? "border-border-interactive bg-surface-2 text-accent-cyan"
                            : "border-transparent text-text-secondary hover:bg-surface-2/60 hover:text-text-primary"
                        }`
                      }
                    >
                      <NavIcon name={item.icon} />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <footer className="shrink-0 border-t border-border-default px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-interactive bg-surface-2 font-mono text-[11px] text-text-secondary">
              --
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text-primary">
                Session Pending
              </p>
              <p className="truncate font-mono text-[11px] text-text-metadata">
                Auth not connected
              </p>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}
