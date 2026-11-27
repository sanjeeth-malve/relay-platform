import type { BadgeTone } from "../components/StatusBadge";
import type {
  ExecutionLogLevel,
  ExecutionNodeStatus,
} from "../types/execution";

export interface NodeStatusVisual {
  label: string;
  tone: BadgeTone;
  cardClass: string;
  selectedCardClass: string;
  progressBarClass: string;
  dotClass: string;
  pulseDot: boolean;
}

export const NODE_STATUS_VISUALS: Record<
  ExecutionNodeStatus,
  NodeStatusVisual
> = {
  queued: {
    label: "Queued",
    tone: "neutral",
    cardClass: "border-border-default bg-surface-1 hover:border-border-interactive",
    selectedCardClass: "border-accent-cyan bg-surface-2",
    progressBarClass: "bg-text-metadata",
    dotClass: "bg-text-metadata",
    pulseDot: false,
  },
  running: {
    label: "Running",
    tone: "cyan",
    cardClass: "border-accent-cyan/55 bg-surface-1 hover:border-accent-cyan",
    selectedCardClass: "border-accent-cyan bg-surface-2",
    progressBarClass: "bg-accent-cyan",
    dotClass: "bg-accent-cyan",
    pulseDot: true,
  },
  completed: {
    label: "Completed",
    tone: "emerald",
    cardClass:
      "border-accent-emerald/45 bg-surface-1 hover:border-accent-emerald",
    selectedCardClass: "border-accent-cyan bg-surface-2",
    progressBarClass: "bg-accent-emerald",
    dotClass: "bg-accent-emerald",
    pulseDot: false,
  },
  waiting_approval: {
    label: "Waiting Approval",
    tone: "amber",
    cardClass: "border-accent-amber/55 bg-surface-1 hover:border-accent-amber",
    selectedCardClass: "border-accent-cyan bg-surface-2",
    progressBarClass: "bg-accent-amber",
    dotClass: "bg-accent-amber",
    pulseDot: false,
  },
  failed: {
    label: "Failed",
    tone: "danger",
    cardClass: "border-accent-danger/60 bg-surface-1 hover:border-accent-danger",
    selectedCardClass: "border-accent-cyan bg-surface-2",
    progressBarClass: "bg-accent-danger",
    dotClass: "bg-accent-danger",
    pulseDot: false,
  },
};

export interface LogLevelVisual {
  badgeLabel: string;
  rowClass: string;
  badgeClass: string;
  messageClass: string;
}

export const LOG_LEVEL_VISUALS: Record<ExecutionLogLevel, LogLevelVisual> = {
  info: {
    badgeLabel: "INFO",
    rowClass: "border-l-2 border-transparent pl-2.5",
    badgeClass: "text-accent-cyan border-border-default bg-surface-2",
    messageClass: "text-text-secondary",
  },
  warning: {
    badgeLabel: "WARN",
    rowClass: "border-l-2 border-accent-amber bg-accent-amber/5 py-1.5 pl-2.5 pr-2 rounded-r-[4px]",
    badgeClass: "text-accent-amber border-accent-amber/40 bg-accent-amber/10",
    messageClass: "text-text-primary",
  },
  error: {
    badgeLabel: "ERROR",
    rowClass: "border-l-2 border-accent-danger bg-accent-danger/5 py-1.5 pl-2.5 pr-2 rounded-r-[4px]",
    badgeClass: "text-accent-danger border-accent-danger/40 bg-accent-danger/10",
    messageClass: "text-text-primary",
  },
};

/**
 * Validates external URLs strictly before rendering clickable links.
 */
export function toSafeExternalUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
