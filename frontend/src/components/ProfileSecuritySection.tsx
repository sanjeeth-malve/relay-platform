import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import type { ProfileAuthStatusRow } from "../types/profile";

export interface ProfileSecuritySectionProps {
  authStatusRows: readonly ProfileAuthStatusRow[];
}

export function ProfileSecuritySection({
  authStatusRows,
}: ProfileSecuritySectionProps) {
  return (
    <>
      {/* Section 2: Authentication & Security (Honest Prototype State) */}
      <section
        aria-label="Authentication and security"
        className="border-b border-border-default py-6"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
            Authentication &amp; Security
          </span>
          <Link
            to="/login"
            className="font-mono text-[11px] text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
          >
            View Sign-In Screen ↗
          </Link>
        </div>

        <div className="divide-y divide-border-default rounded-[6px] border border-border-default bg-surface-1">
          {authStatusRows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col justify-between gap-2.5 p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="text-[13px] font-medium text-text-primary">
                  {row.title}
                </p>
                <p className="text-xs text-text-secondary">{row.description}</p>
              </div>
              <StatusBadge
                tone={row.tone}
                label={row.statusLabel}
                showDot={row.tone === "amber"}
                className="self-start sm:self-auto"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Active Sessions (Transparent Client Preview) */}
      <section
        aria-label="Session overview"
        className="border-b border-border-default py-6"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
            Session Overview
          </span>
          <span className="font-mono text-[10px] text-text-metadata">
            Multi-session management requires Supabase Auth
          </span>
        </div>

        <div className="rounded-[6px] border border-border-default bg-surface-1 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[13px] font-medium text-text-primary">
                  Local UI Prototype Preview
                </p>
                <p className="font-mono text-[11px] text-text-metadata">
                  Browser preview · No authenticated backend token or IP metadata
                  collected
                </p>
              </div>
            </div>

            <StatusBadge
              tone="neutral"
              label="Session Pending"
              showDot={false}
              className="self-start sm:self-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
