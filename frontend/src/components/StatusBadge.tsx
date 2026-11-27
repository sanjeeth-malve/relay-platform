export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "waiting_input"
  | "waiting_approval"
  | "verifying"
  | "completed"
  | "failed"
  | "cancelled";

export type BadgeTone = "neutral" | "cyan" | "emerald" | "amber" | "danger";

export interface StatusBadgeProps {
  status?: TaskStatus;
  label?: string;
  tone?: BadgeTone;
  showDot?: boolean;
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; tone: BadgeTone }> = {
  queued: { label: "queued", tone: "neutral" },
  planning: { label: "planning", tone: "cyan" },
  running: { label: "running", tone: "cyan" },
  waiting_input: { label: "waiting_input", tone: "amber" },
  waiting_approval: { label: "waiting_approval", tone: "amber" },
  verifying: { label: "verifying", tone: "cyan" },
  completed: { label: "completed", tone: "emerald" },
  failed: { label: "failed", tone: "danger" },
  cancelled: { label: "cancelled", tone: "neutral" },
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-text-secondary border-border-default",
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  emerald: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
  danger: "bg-accent-danger/10 text-accent-danger border-accent-danger/30",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-text-metadata",
  cyan: "bg-accent-cyan",
  emerald: "bg-accent-emerald",
  amber: "bg-accent-amber",
  danger: "bg-accent-danger",
};

export function StatusBadge({
  status,
  label,
  tone,
  showDot = true,
  className = "",
}: StatusBadgeProps) {
  const resolved = status ? statusConfig[status] : undefined;
  const finalTone = tone ?? resolved?.tone ?? "neutral";
  const finalLabel = label ?? resolved?.label ?? "unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 font-mono text-[11px] leading-4 whitespace-nowrap ${toneClasses[finalTone]} ${className}`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClasses[finalTone]}`}
        />
      )}
      <span>{finalLabel}</span>
    </span>
  );
}
