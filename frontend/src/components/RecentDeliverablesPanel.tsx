import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";
import type { RecentDeliverableItem } from "../types/dashboard";

export interface RecentDeliverablesPanelProps {
  items: RecentDeliverableItem[];
}

export function RecentDeliverablesPanel({ items }: RecentDeliverablesPanelProps) {
  return (
    <SurfaceCard
      title="Recent Deliverables"
      action={
        <Link
          to="/reports"
          className="inline-flex items-center gap-1 rounded-[4px] text-xs text-text-metadata transition-colors hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan whitespace-nowrap"
        >
          <span>All reports</span>
          <span aria-hidden="true">→</span>
        </Link>
      }
    >
      <ul className="divide-y divide-border-default/70">
        {items.map((item) => (
          <li key={item.id} className="py-2 first:pt-0 last:pb-0">
            <Link
              to={item.reportPath}
              className="flex items-center justify-between gap-3 rounded-[4px] px-1.5 py-1.5 transition-colors hover:bg-surface-2/50 focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium text-text-primary">
                  {item.title}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-text-metadata">
                  {item.taskId}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge
                  tone="emerald"
                  label={item.verifiedLabel}
                  showDot={false}
                  className="px-1.5 py-0.5 text-[10px]"
                />
                <span className="font-mono text-[11px] tabular-nums text-text-metadata whitespace-nowrap">
                  {item.timestamp}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
