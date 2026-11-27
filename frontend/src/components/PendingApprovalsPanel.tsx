import { useNavigate } from "react-router";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";
import type { PendingApprovalItem } from "../types/dashboard";

export interface PendingApprovalsPanelProps {
  countLabel: string;
  items: PendingApprovalItem[];
}

export function PendingApprovalsPanel({
  countLabel,
  items,
}: PendingApprovalsPanelProps) {
  const navigate = useNavigate();

  return (
    <SurfaceCard
      title="Pending Approvals"
      action={<StatusBadge tone="amber" label={countLabel} showDot={false} />}
    >
      <div className="divide-y divide-border-default/80">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={idx === 0 ? "pb-3.5" : "pt-3.5"}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
              <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                <span className="font-mono text-[11px] text-text-secondary whitespace-nowrap">
                  {item.taskId}
                </span>
                <span className="text-xs font-medium text-text-primary">
                  {item.title}
                </span>
              </div>
              <span className="font-mono text-[11px] text-text-metadata whitespace-nowrap">
                {item.requestedAt}
              </span>
            </div>

            <p className="mt-1.5 mb-3 text-xs leading-relaxed text-text-secondary">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(item.reviewPath)}
                title="Open Approvals queue to review and approve"
                className="h-7 border-accent-cyan/40 bg-transparent px-2.5 text-xs text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(item.reviewPath)}
                className="h-7 px-2.5 text-xs"
              >
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
