import { StatusBadge } from "./StatusBadge";
import type {
  ExecutionEvidenceItem,
  ExecutionNodeItem,
} from "../types/execution";
import { toSafeExternalUrl } from "../utils/executionStatus";

export interface ExecutionEvidenceTabProps {
  evidence: readonly ExecutionEvidenceItem[];
  totalCount: number;
  selectedNode: ExecutionNodeItem;
  filterByNode: boolean;
  onToggleFilter: (filterByNode: boolean) => void;
}

export function ExecutionEvidenceTab({
  evidence,
  totalCount,
  selectedNode,
  filterByNode,
  onToggleFilter,
}: ExecutionEvidenceTabProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Scope Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default bg-canvas/60 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
          Collected Citations
        </span>
        <div
          role="group"
          aria-label="Filter evidence scope"
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
            Selected ({evidence.length})
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

      <div className="relay-subtle-scroll flex-1 overflow-y-auto bg-canvas p-4">
        {evidence.length === 0 ? (
          <div className="rounded-[6px] border border-border-default bg-surface-1 p-4 text-xs leading-relaxed text-text-secondary">
            {selectedNode.allowedTools.length === 0 &&
            selectedNode.role === "worker" ? (
              <>
                <span className="font-medium text-text-primary">
                  {selectedNode.name}
                </span>{" "}
                operates on upstream worker outputs with no direct external
                API or web scraping tools. Switch to{" "}
                <span className="font-mono text-accent-cyan">
                  All ({totalCount})
                </span>{" "}
                to review task-wide collected sources.
              </>
            ) : (
              <>
                No external evidence items are attached to{" "}
                <span className="font-medium text-text-primary">
                  {selectedNode.name}
                </span>{" "}
                yet.
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {evidence.map((item) => {
              const isVerified = item.verificationStatus === "verified";
              const safeUrl = toSafeExternalUrl(item.url);

              return (
                <li
                  key={item.id}
                  className="rounded-[6px] border border-border-default bg-surface-1 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold leading-snug text-text-primary">
                        {item.sourceName}
                      </h3>
                      <p className="mt-0.5 font-mono text-[10px] text-text-metadata">
                        {item.workerName} · {item.collectedAt}
                      </p>
                    </div>
                    <StatusBadge
                      tone={isVerified ? "emerald" : "amber"}
                      label={isVerified ? "Verified" : "Unverified"}
                      showDot
                      className="shrink-0 text-[10px]"
                    />
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {item.summary}
                  </p>

                  <div className="mt-2.5 border-t border-border-default pt-2 font-mono text-[11px]">
                    {safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
                        aria-label={`Open source ${item.sourceName} in a new tab`}
                      >
                        <span className="truncate">{safeUrl}</span>
                        <svg
                          aria-hidden="true"
                          className="h-3 w-3 shrink-0"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M6 3.5h6.5V10M12.5 3.5L6 10M10.5 12.5h-7v-7" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-text-metadata">
                        External URL unavailable or disallowed
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
