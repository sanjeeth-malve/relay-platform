import { StatusBadge, type BadgeTone } from "./StatusBadge";
import type {
  ApprovalDecisionStatus,
  ApprovalRecord,
  ApprovalRiskLevel,
} from "../types/approvals";

export interface ApprovalQueueItemProps {
  item: ApprovalRecord;
  selected: boolean;
  onSelect: (id: string) => void;
}

const RISK_CLASSES: Record<ApprovalRiskLevel, string> = {
  high: "border-accent-danger/35 bg-accent-danger/10 text-accent-danger",
  medium: "border-accent-amber/35 bg-accent-amber/10 text-accent-amber",
  low: "border-border-interactive bg-surface-2 text-text-secondary",
};

const STATUS_BADGE_MAP: Record<
  ApprovalDecisionStatus,
  { tone: BadgeTone; label: string }
> = {
  pending: { tone: "amber", label: "Pending" },
  approved: { tone: "emerald", label: "Approved" },
  rejected: { tone: "danger", label: "Rejected" },
};

export function ApprovalQueueItem({
  item,
  selected,
  onSelect,
}: ApprovalQueueItemProps) {
  const statusMeta = STATUS_BADGE_MAP[item.status];

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={selected}
      data-testid={`approval-queue-item-${item.id}`}
      className={`w-full border-l-2 p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-cyan ${
        selected
          ? "border-accent-cyan bg-surface-2"
          : "border-transparent bg-canvas hover:bg-surface-1"
      }`}
    >
      {/* Top Meta Row: Approval ID, Task ID, Category, Timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="font-semibold text-accent-cyan">{item.id}</span>
          <span className="text-text-metadata">·</span>
          <span className="text-text-secondary">{item.taskId}</span>
          <span
            className={`rounded-[4px] border px-1.5 py-0 uppercase tracking-wider ${RISK_CLASSES[item.riskLevel]}`}
          >
            {item.categoryLabel}
          </span>
        </div>

        <time className="font-mono text-[10px] text-text-metadata tabular-nums whitespace-nowrap">
          {item.submittedAtLabel}
        </time>
      </div>

      {/* Requested Action Title */}
      <h2 className="mt-1.5 text-[14px] font-semibold leading-snug text-text-primary">
        {item.requestedAction}
      </h2>

      {/* Task Title & Worker */}
      <p className="mt-1 truncate text-xs text-text-secondary">
        {item.taskTitle} · {item.requestingWorker}
      </p>

      {/* Bottom Risk & Status Row */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
        <span className="text-text-metadata">{item.riskSummary}</span>
        <StatusBadge
          tone={statusMeta.tone}
          label={statusMeta.label}
          showDot
          className="px-1.5 py-0 text-[10px]"
        />
      </div>
    </button>
  );
}
