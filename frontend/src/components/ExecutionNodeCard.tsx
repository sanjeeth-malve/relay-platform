import { StatusBadge } from "./StatusBadge";
import type { ExecutionNodeItem } from "../types/execution";
import { NODE_STATUS_VISUALS } from "../utils/executionStatus";

export interface ExecutionNodeCardProps {
  node: ExecutionNodeItem;
  selected: boolean;
}

/**
 * Shared visual layout for Supervisor and Worker DAG nodes in React Flow.
 */
export function ExecutionNodeCard({ node, selected }: ExecutionNodeCardProps) {
  const visual = NODE_STATUS_VISUALS[node.status];
  const isSupervisor = node.role === "supervisor";
  const kicker = isSupervisor ? "SUPERVISOR" : `STAGE ${node.stepBadge}`;
  const footerMeta = isSupervisor
    ? "Orchestrator"
    : node.allowedTools.length > 0
      ? `${node.allowedTools.length} ${node.allowedTools.length === 1 ? "tool" : "tools"}`
      : "No external tools";

  return (
    <div
      data-testid={`execution-node-${node.id}`}
      className={`w-[240px] rounded-[6px] border p-2.5 text-left transition-colors ${
        selected
          ? `${visual.selectedCardClass} ring-1 ring-accent-cyan/40`
          : visual.cardClass
      }`}
    >
      {/* Top kicker + status pill */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-metadata">
          {kicker}
        </span>
        <StatusBadge
          tone={visual.tone}
          label={visual.label}
          showDot
          className="px-1.5 py-0 text-[10px]"
        />
      </div>

      {/* Node title & subtitle */}
      <div className="mt-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {visual.pulseDot && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan animate-pulse motion-reduce:animate-none"
            />
          )}
          <h3 className="truncate text-[13px] font-semibold leading-snug text-text-primary">
            {node.name}
          </h3>
        </div>
        <p className="truncate font-mono text-[10px] text-text-metadata">
          {node.workerSubtitle}
        </p>
      </div>

      {/* Concise activity description */}
      <p className="mt-1.5 line-clamp-2 min-h-[30px] text-[11px] leading-[15px] text-text-secondary">
        {node.activitySummary}
      </p>

      {/* Progress bar & execution telemetry */}
      <div className="mt-2 border-t border-border-default pt-1.5">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-text-metadata">
          <span className="truncate">{footerMeta}</span>
          <span className="shrink-0 tabular-nums">
            {node.progress}% · {node.elapsedLabel}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`${node.name} progress`}
          aria-valuenow={node.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-1 h-1 w-full overflow-hidden rounded-[2px] bg-canvas"
        >
          <div
            className={`h-full transition-[width] duration-150 motion-reduce:transition-none ${visual.progressBarClass}`}
            style={{ width: `${node.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
