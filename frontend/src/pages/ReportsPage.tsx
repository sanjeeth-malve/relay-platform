import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import { SurfaceCard } from "../components/SurfaceCard";
import { REPORTS_LIST_MOCK } from "../data/reportsMock";
import type { ReportPublishStatus } from "../types/reports";

type ReportStatusFilter = "all" | ReportPublishStatus;

const FILTER_OPTIONS: readonly { id: ReportStatusFilter; label: string }[] = [
  { id: "all", label: "All Reports" },
  { id: "verified", label: "Verified" },
  { id: "verified_with_gaps", label: "Verified w/ Gaps" },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("all");

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return REPORTS_LIST_MOCK.filter((item) => {
      if (statusFilter !== "all" && item.publishStatus !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.workflowName.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-5">
      {/* Page Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[22px]">
            Reports
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Verified deliverables separating observed evidence from AI
            assessments and open information gaps.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/workspace")}
          className="h-9 shrink-0 px-3.5 text-xs font-semibold"
        >
          + Delegate Research
        </Button>
      </header>

      {/* Filter & Prototype Context Bar */}
      <SurfaceCard bodyClassName="p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <label htmlFor="reports-search-input" className="sr-only">
              Search reports
            </label>
            <input
              id="reports-search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Filter by report ID, title, or workflow..."
              className="h-9 w-full min-w-0 rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none sm:max-w-xs"
            />

            <div
              role="group"
              aria-label="Filter reports by verification status"
              className="inline-flex flex-wrap items-center gap-1 rounded-[6px] border border-border-default bg-canvas p-1"
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = statusFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setStatusFilter(option.id)}
                    className={`rounded-[4px] px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                      isActive
                        ? "bg-surface-2 text-accent-cyan"
                        : "text-text-metadata hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-text-metadata">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber"
            />
            <span>Mock Registry · GET /api/v1/reports pending</span>
          </div>
        </div>
      </SurfaceCard>

      {/* Reports Registry Table / Mobile Cards */}
      <SurfaceCard
        title="Generated Deliverables"
        titleAddon={
          <StatusBadge
            tone="neutral"
            label={`${filteredReports.length} reports`}
            showDot={false}
          />
        }
        bodyClassName="p-0"
        className="overflow-hidden"
      >
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-start gap-3 p-6 text-xs text-text-secondary">
            <p>
              No seeded reports match{" "}
              <span className="font-mono text-text-primary">
                "{searchQuery || statusFilter}"
              </span>
              .
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-default bg-canvas/50 font-mono text-[11px] uppercase tracking-wider text-text-metadata">
                    <th scope="col" className="w-24 px-4 py-2.5 font-normal">
                      Report ID
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-normal">
                      Deliverable
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-normal">
                      Scope
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-normal">
                      Audit Status
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-normal">
                      Confidence
                    </th>
                    <th
                      scope="col"
                      className="w-44 px-4 py-2.5 text-right font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/80 text-xs">
                  {filteredReports.map((report) => {
                    const isClean = report.publishStatus === "verified";
                    return (
                      <tr
                        key={report.id}
                        className="transition-colors hover:bg-surface-2/60"
                      >
                        <td className="px-4 py-3 font-mono text-accent-cyan whitespace-nowrap">
                          <Link
                            to={`/reports/${report.id}`}
                            className="hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
                          >
                            {report.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/reports/${report.id}`}
                            className="font-medium text-text-primary hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                          >
                            {report.title}
                          </Link>
                          <div className="mt-0.5 font-mono text-[10px] text-text-metadata">
                            {report.workflowName} · {report.completedLabel}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-text-secondary whitespace-nowrap tabular-nums">
                          {report.entitiesCount} entities ·{" "}
                          {report.sourcesCheckedCount} sources
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge
                            tone={isClean ? "emerald" : "amber"}
                            label={isClean ? "Verified ✓" : "Verified w/ Gaps"}
                            showDot={false}
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-accent-emerald whitespace-nowrap tabular-nums">
                          {report.confidenceScoreLabel}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {report.hasLinkedTaskExecution && (
                              <Link
                                to={`/tasks/${report.taskId}`}
                                className="rounded-[4px] border border-border-default bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
                              >
                                Task
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate(`/reports/${report.id}`)}
                              className="h-7 px-2.5 text-[11px]"
                            >
                              Open Report
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards */}
            <ul className="divide-y divide-border-default md:hidden">
              {filteredReports.map((report) => {
                const isClean = report.publishStatus === "verified";
                return (
                  <li key={report.id} className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-accent-cyan">
                        {report.id}
                      </span>
                      <StatusBadge
                        tone={isClean ? "emerald" : "amber"}
                        label={isClean ? "Verified ✓" : "Verified w/ Gaps"}
                        showDot={false}
                      />
                    </div>
                    <h2 className="text-sm font-semibold text-text-primary">
                      {report.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-text-metadata">
                      <span>{report.entitiesCount} entities</span>
                      <span>{report.sourcesCheckedCount} sources</span>
                      <span className="text-accent-emerald">
                        {report.confidenceScoreLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/reports/${report.id}`)}
                        className="h-8 text-xs"
                      >
                        Open Report
                      </Button>
                      {report.hasLinkedTaskExecution && (
                        <Link
                          to={`/tasks/${report.taskId}`}
                          className="inline-flex h-8 items-center rounded-[6px] border border-border-default bg-surface-2 px-2.5 font-mono text-[11px] text-text-secondary hover:border-border-interactive hover:text-text-primary"
                        >
                          Inspect Task
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </SurfaceCard>
    </div>
  );
}
