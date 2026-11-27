import { useMemo, useState } from "react";
import { ApprovalDetailPanel } from "../components/ApprovalDetailPanel";
import { ApprovalQueueItem } from "../components/ApprovalQueueItem";
import { SelectDropdown } from "../components/SelectDropdown";
import { StatusBadge } from "../components/StatusBadge";
import { APPROVALS_INITIAL_MOCK } from "../data/approvalsMock";
import type {
  ApprovalActionFeedback,
  ApprovalFilterTab,
  ApprovalRecord,
  ApprovalRiskLevel,
  ApprovalSortOrder,
} from "../types/approvals";

const RISK_RANK: Record<ApprovalRiskLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const SORT_OPTIONS: readonly ApprovalSortOrder[] = [
  "Latest",
  "Risk (High-Low)",
];

export function ApprovalsPage() {
  const [records, setRecords] = useState<readonly ApprovalRecord[]>(
    APPROVALS_INITIAL_MOCK,
  );
  const [activeTab, setActiveTab] = useState<ApprovalFilterTab>("pending");
  const [sortOrder, setSortOrder] = useState<ApprovalSortOrder>("Latest");
  const [selectedId, setSelectedId] = useState<string>(
    APPROVALS_INITIAL_MOCK[0]?.id ?? "",
  );
  const [feedback, setFeedback] = useState<ApprovalActionFeedback | null>(null);

  const counts = useMemo(
    () => ({
      all: records.length,
      pending: records.filter((item) => item.status === "pending").length,
      approved: records.filter((item) => item.status === "approved").length,
      rejected: records.filter((item) => item.status === "rejected").length,
    }),
    [records],
  );

  const filterTabs: readonly {
    id: ApprovalFilterTab;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const visibleRecords = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? records
        : records.filter((item) => item.status === activeTab);

    if (sortOrder === "Risk (High-Low)") {
      return [...filtered].sort(
        (a, b) => RISK_RANK[b.riskLevel] - RISK_RANK[a.riskLevel],
      );
    }
    return filtered;
  }, [records, activeTab, sortOrder]);

  const selectedRecord = useMemo(
    () =>
      visibleRecords.find((item) => item.id === selectedId) ??
      visibleRecords[0] ??
      null,
    [visibleRecords, selectedId],
  );

  const handleTabChange = (tab: ApprovalFilterTab) => {
    setActiveTab(tab);
    const nextList =
      tab === "all"
        ? records
        : records.filter((item) => item.status === tab);
    if (!nextList.some((item) => item.id === selectedId)) {
      setSelectedId(nextList[0]?.id ?? "");
    }
  };

  const applyDecision = (
    id: string,
    decision: "approved" | "rejected",
    note: string,
  ) => {
    const existing = records.find((item) => item.id === id);
    // Guard against duplicate decision submissions on non-pending records
    if (!existing || existing.status !== "pending") {
      return;
    }

    const updated = records.map((item) =>
      item.id === id
        ? {
            ...item,
            status: decision,
            decisionNote:
              note ||
              (decision === "approved"
                ? "Approved in local review session."
                : undefined),
            resolvedAtLabel: "Mock · Just now",
          }
        : item,
    );

    setRecords(updated);

    const remainingInTab =
      activeTab === "all"
        ? updated
        : updated.filter((item) => item.status === activeTab);

    if (activeTab === "pending") {
      setSelectedId(remainingInTab[0]?.id ?? "");
    }

    const actionWord = decision === "approved" ? "Approved" : "Rejected";
    const endpointAction = decision === "approved" ? "approve" : "reject";
    setFeedback({
      id,
      decision,
      message: `${actionWord} ${id} locally in UI prototype state. Endpoint POST /api/v1/approvals/${id.toLowerCase()}/${endpointAction} is not connected.`,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] min-w-0 flex-col gap-3.5 lg:h-full lg:min-h-0 lg:overflow-hidden">
      {/* Compact Page Header Strip (stable dimensions across filter switches) */}
      <header className="shrink-0 rounded-[6px] border border-border-default bg-surface-1 px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-semibold leading-tight tracking-tight text-text-primary sm:text-[20px]">
                Approvals
              </h1>
              <StatusBadge
                tone={counts.pending > 0 ? "amber" : "emerald"}
                label={`${counts.pending} Pending`}
                showDot
              />
            </div>
            <p className="truncate font-mono text-[10px] text-text-metadata">
              Mock Governance Queue · POST /api/v1/approvals/{"{id}"}/... pending
            </p>
          </div>

          {/* Segmented Status Filter Tabs */}
          <div
            role="group"
            aria-label="Filter approvals by status"
            className="flex w-full shrink-0 flex-nowrap items-center justify-between gap-1 rounded-[6px] border border-border-default bg-canvas p-1 md:w-auto md:justify-start"
          >
            {filterTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[4px] border px-1.5 font-mono text-[10px] leading-none transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-cyan sm:gap-1.5 sm:px-2.5 sm:text-[11px] ${
                    isSelected
                      ? "border-border-interactive bg-surface-2 text-accent-cyan"
                      : "border-transparent text-text-metadata hover:text-text-primary"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-[3px] px-1 text-[10px] leading-none tabular-nums ${
                      tab.id === "pending" && tab.count > 0
                        ? "bg-accent-amber/15 text-accent-amber"
                        : "bg-surface-1 text-text-secondary"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Decision Feedback Banner (outside header so header position never shifts) */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-2 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={feedback.decision === "approved" ? "emerald" : "danger"}
              label={
                feedback.decision === "approved"
                  ? "Local Decision · Approved"
                  : "Local Decision · Rejected"
              }
              showDot={false}
            />
            <span className="text-text-secondary">{feedback.message}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => handleTabChange(feedback.decision)}
              className="text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
            >
              View {feedback.decision === "approved" ? "Approved" : "Rejected"}
            </button>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-text-metadata hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Split Inbox & Detail Review Workspace */}
      <div className="grid min-w-0 grid-cols-12 overflow-hidden rounded-[6px] border border-border-default bg-canvas lg:min-h-0 lg:flex-1 lg:grid-rows-[minmax(0,1fr)]">
        {/* Left Pane: Approval Queue */}
        <aside
          aria-label="Approval Queue"
          className="col-span-12 flex min-h-0 flex-col overflow-hidden border-b border-border-default bg-canvas lg:col-span-5 lg:h-full lg:border-r lg:border-b-0 xl:col-span-4"
        >
          <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border-default bg-surface-1 px-4 py-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-text-metadata">Active Queue</span>
              <span className="text-border-interactive">/</span>
              <span className="text-text-secondary">
                {visibleRecords.length} shown
              </span>
            </div>

            <SelectDropdown<ApprovalSortOrder>
              id="approvals-sort-order"
              label="Sort approvals"
              inlineLabel="Sort"
              value={sortOrder}
              options={SORT_OPTIONS}
              onChange={setSortOrder}
              menuClassName="right-0 left-auto"
            />
          </div>

          {visibleRecords.length === 0 ? (
            <div
              data-testid="approval-queue-scroll"
              className="relay-subtle-scroll flex min-h-0 flex-1 flex-col items-start justify-center gap-3 overflow-y-auto p-6 text-xs text-text-secondary"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
                Queue Clear
              </p>
              <p>
                No approvals currently match the{" "}
                <span className="font-mono text-text-primary">{activeTab}</span>{" "}
                filter.
              </p>
              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className="rounded-[4px] border border-border-interactive bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-accent-cyan hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
              >
                View all approvals ({counts.all})
              </button>
            </div>
          ) : (
            <div
              data-testid="approval-queue-scroll"
              className="relay-subtle-scroll max-h-[360px] min-h-0 flex-1 divide-y divide-border-default overflow-y-auto lg:max-h-none"
            >
              {visibleRecords.map((item) => (
                <ApprovalQueueItem
                  key={item.id}
                  item={item}
                  selected={selectedRecord?.id === item.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          )}

          {/* Governance Queue Footer Strip */}
          <div className="shrink-0 border-t border-border-default bg-surface-1 p-4 font-mono text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <span className="uppercase tracking-wider text-text-metadata">
                Approval Queue Coverage
              </span>
              <span className="text-accent-cyan tabular-nums">
                {counts.pending} pending · {counts.approved + counts.rejected}{" "}
                decided
              </span>
            </div>
            <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-[2px] bg-surface-2">
              <div
                className="h-full bg-accent-emerald"
                style={{
                  width: `${counts.all ? (counts.approved / counts.all) * 100 : 0}%`,
                }}
              />
              <div
                className="h-full bg-accent-amber"
                style={{
                  width: `${counts.all ? (counts.pending / counts.all) * 100 : 0}%`,
                }}
              />
              <div
                className="h-full bg-accent-danger"
                style={{
                  width: `${counts.all ? (counts.rejected / counts.all) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </aside>

        {/* Right Pane: Selected Checkpoint Review Detail */}
        <div className="col-span-12 flex min-h-0 min-w-0 flex-col overflow-hidden lg:col-span-7 lg:h-full xl:col-span-8">
          <ApprovalDetailPanel
            item={selectedRecord}
            onApprove={(id, note) => applyDecision(id, "approved", note)}
            onReject={(id, reason) => applyDecision(id, "rejected", reason)}
          />
        </div>
      </div>
    </div>
  );
}
