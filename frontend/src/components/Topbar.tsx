import type { RefObject } from "react";
import { useLocation } from "react-router";
import { getBreadcrumbs } from "../utils/navigation";

export interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  toggleButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function Topbar({
  isSidebarOpen,
  onToggleSidebar,
  toggleButtonRef,
}: TopbarProps) {
  const { pathname } = useLocation();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border-default bg-surface-1 px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          aria-controls="relay-sidebar"
          aria-expanded={isSidebarOpen}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border-default bg-surface-2 text-text-secondary hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan lg:hidden"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
          </svg>
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={`${crumb}-${idx}`} className="flex min-w-0 items-center gap-1.5">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-text-metadata">
                    /
                  </span>
                )}
                <span
                  className={`truncate ${
                    isLast ? "font-medium text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {crumb}
                </span>
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Search tasks and reports"
          className="hidden h-7 items-center gap-2 rounded-[6px] border border-border-default bg-surface-2 px-2.5 text-xs text-text-metadata whitespace-nowrap hover:border-border-interactive hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-accent-cyan sm:inline-flex"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <span>Search tasks, reports...</span>
          <kbd className="rounded-[4px] border border-border-default bg-surface-1 px-1 font-mono text-[10px] text-text-metadata">
            Ctrl+K
          </kbd>
        </button>

        <div
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-border-default bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-secondary whitespace-nowrap"
          title="Backend telemetry connection not yet wired"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-metadata"
          />
          <span>Standby</span>
        </div>
      </div>
    </header>
  );
}
