import { useMemo, useState, type KeyboardEvent } from "react";
import { ExecutionEvidenceTab } from "./ExecutionEvidenceTab";
import { ExecutionLogsTab } from "./ExecutionLogsTab";
import { ExecutionOutputTab } from "./ExecutionOutputTab";
import { StatusBadge } from "./StatusBadge";
import type {
  ExecutionEvidenceItem,
  ExecutionInspectorTab,
  ExecutionLogEntry,
  ExecutionNodeItem,
} from "../types/execution";
import { NODE_STATUS_VISUALS } from "../utils/executionStatus";

export interface ExecutionInspectorProps {
  selectedNode: ExecutionNodeItem;
  logs: readonly ExecutionLogEntry[];
  evidence: readonly ExecutionEvidenceItem[];
  nodeOutput: unknown;
  taskOutputJson: Record<string, unknown>;
}

const TABS: readonly { id: ExecutionInspectorTab; label: string }[] = [
  { id: "logs", label: "Live Logs" },
  { id: "evidence", label: "Evidence & Sources" },
  { id: "output", label: "Output JSON" },
];

export function ExecutionInspector({
  selectedNode,
  logs,
  evidence,
  nodeOutput,
  taskOutputJson,
}: ExecutionInspectorProps) {
  const [activeTab, setActiveTab] = useState<ExecutionInspectorTab>("logs");
  const [filterLogsByNode, setFilterLogsByNode] = useState(true);
  const [filterEvidenceByNode, setFilterEvidenceByNode] = useState(true);

  const visual = NODE_STATUS_VISUALS[selectedNode.status];

  const scopedLogs = useMemo(
    () =>
      filterLogsByNode
        ? logs.filter((entry) => entry.workerId === selectedNode.id)
        : logs,
    [logs, filterLogsByNode, selectedNode.id],
  );

  const scopedEvidence = useMemo(
    () =>
      filterEvidenceByNode
        ? evidence.filter((item) => item.workerId === selectedNode.id)
        : evidence,
    [evidence, filterEvidenceByNode, selectedNode.id],
  );

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIndex].id);
  };

  return (
    <aside
      aria-label="Execution Inspector"
      className="flex h-full min-w-0 flex-col bg-surface-1"
    >
      {/* Selected Node Context Header */}
      <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-3">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
          <span>
            {selectedNode.role === "supervisor"
              ? "Selected Orchestrator"
              : "Selected Worker"}
          </span>
          <span className="tabular-nums">{selectedNode.elapsedLabel}</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-[14px] font-semibold text-text-primary">
            {selectedNode.role === "worker"
              ? `${selectedNode.stepBadge} · ${selectedNode.name}`
              : selectedNode.name}
          </h2>
          <StatusBadge
            tone={visual.tone}
            label={visual.label}
            showDot
            className="shrink-0 text-[10px]"
          />
        </div>

        {/* Least-privilege tool allowlist display */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-text-metadata">
          <span>Tools:</span>
          {selectedNode.allowedTools.length > 0 ? (
            selectedNode.allowedTools.map((tool) => (
              <span
                key={tool}
                className="rounded-[4px] border border-border-default bg-surface-2 px-1.5 py-0.5 text-text-secondary"
              >
                {tool}
              </span>
            ))
          ) : (
            <span className="text-text-metadata">
              {selectedNode.role === "supervisor"
                ? "Governance / routing only"
                : "Analysis / synthesis only (no external tools)"}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div
        role="tablist"
        aria-label="Execution Inspector Tabs"
        className="flex h-10 shrink-0 items-center gap-4 overflow-x-auto border-b border-border-default bg-surface-1 px-4"
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const countLabel =
            tab.id === "evidence"
              ? ` (${evidence.length})`
              : tab.id === "logs"
                ? ` (${logs.length})`
                : "";

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`inline-flex h-full shrink-0 items-center border-b-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-cyan ${
                isActive
                  ? "border-accent-cyan text-text-primary"
                  : "border-transparent text-text-metadata hover:text-text-secondary"
              }`}
            >
              {tab.label}
              {countLabel}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="min-h-0 flex-1 overflow-hidden"
      >
        {activeTab === "logs" && (
          <ExecutionLogsTab
            logs={scopedLogs}
            totalCount={logs.length}
            selectedNode={selectedNode}
            filterByNode={filterLogsByNode}
            onToggleFilter={setFilterLogsByNode}
          />
        )}

        {activeTab === "evidence" && (
          <ExecutionEvidenceTab
            evidence={scopedEvidence}
            totalCount={evidence.length}
            selectedNode={selectedNode}
            filterByNode={filterEvidenceByNode}
            onToggleFilter={setFilterEvidenceByNode}
          />
        )}

        {activeTab === "output" && (
          <ExecutionOutputTab
            selectedNode={selectedNode}
            nodeOutput={nodeOutput}
            taskOutputJson={taskOutputJson}
          />
        )}
      </div>

      {/* Honest Telemetry Footer */}
      <footer className="flex min-h-9 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border-default bg-surface-1 px-4 py-1.5 font-mono text-[10px]">
        <div className="flex items-center gap-2 whitespace-nowrap text-text-secondary">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber"
          />
          <span className="font-semibold tracking-wider text-text-secondary">
            MOCK SNAPSHOT · SSE PENDING
          </span>
        </div>
        <span className="truncate text-text-metadata">
          SSE stream awaiting backend
        </span>
      </footer>
    </aside>
  );
}
