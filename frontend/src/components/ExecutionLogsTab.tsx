import type {
  ExecutionLogEntry,
  ExecutionNodeItem,
} from "../types/execution";
import { LOG_LEVEL_VISUALS } from "../utils/executionStatus";

export interface ExecutionLogsTabProps {
  logs: readonly ExecutionLogEntry[];
  totalCount: number;
  selectedNode: ExecutionNodeItem;
  filterByNode: boolean;
  onToggleFilter: (filterByNode: boolean) => void;
}

export function ExecutionLogsTab({
  logs,
  totalCount,
  selectedNode,
  filterByNode,
  onToggleFilter,
}: ExecutionLogsTabProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Scope Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default bg-canvas/60 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
          Event Log Snapshot
        </span>
        <div
          role="group"
          aria-label="Filter logs scope"
          className="inline-flex rounded-[4px] border border-border-default bg-surface-1 p-0.5 font-mono text-[10px]"
        >
          <button
            type="button"
            onClick={() => onToggleFilter(true)}
            className={`rounded-[3px] px-2 py-0.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              filterByNode
                ? "bg-surface-2 text-accent-cyan"
                : "text-text-metadata hover:text-text-primary"
            }`}
          >
            Selected ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => onToggleFilter(false)}
            className={`rounded-[3px] px-2 py-0.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              !filterByNode
                ? "bg-surface-2 text-accent-cyan"
                : "text-text-metadata hover:text-text-primary"
            }`}
          >
            All ({totalCount})
          </button>
        </div>
      </div>

      {/* Log Stream List */}
      <div className="relay-subtle-scroll flex-1 overflow-y-auto bg-canvas p-4 font-mono text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="rounded-[6px] border border-border-default bg-surface-1 p-4 font-sans text-xs leading-relaxed text-text-secondary">
            No execution events recorded yet for{" "}
            <span className="font-medium text-text-primary">
              {selectedNode.name}
            </span>
            . This stage is currently{" "}
            <span className="font-mono text-text-primary">
              {selectedNode.status}
            </span>
            .
          </div>
        ) : (
          <ul className="space-y-2.5">
            {logs.map((entry) => {
              const levelStyle = LOG_LEVEL_VISUALS[entry.level];
              return (
                <li
                  key={entry.id}
                  className={`flex flex-col gap-1 ${levelStyle.rowClass}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tabular-nums text-text-metadata">
                      {entry.timestamp}
                    </span>
                    <span
                      className={`rounded-[4px] border px-1.5 py-0 text-[10px] font-medium ${levelStyle.badgeClass}`}
                    >
                      {levelStyle.badgeLabel}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {entry.workerTag}
                    </span>
                  </div>
                  <p className={`break-words ${levelStyle.messageClass}`}>
                    {entry.message}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
