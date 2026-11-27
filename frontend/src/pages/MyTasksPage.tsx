import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { SelectDropdown } from "../components/SelectDropdown";
import { StatusBadge, type TaskStatus } from "../components/StatusBadge";
import { SurfaceCard } from "../components/SurfaceCard";
import { MY_TASKS_LIST } from "../data/tasksList";
import type { TaskSortOrder, TaskStatusFilterId } from "../types/tasks";

const WORKFLOW_FILTER_OPTIONS = [
  "All Workflows",
  "Sales Prospect Research",
  "Pricing Matrix (Demo)",
  "Due Diligence (Demo)",
  "Compliance Audit (Demo)",
] as const;

const SORT_OPTIONS: readonly TaskSortOrder[] = [
  "Recent",
  "Progress (High-Low)",
  "ID (Asc)",
];

const PROGRESS_BAR_CLASSES: Record<TaskStatus, string> = {
  queued: "bg-text-metadata",
  planning: "bg-accent-cyan",
  running: "bg-accent-cyan",
  waiting_input: "bg-accent-amber",
  waiting_approval: "bg-accent-amber",
  verifying: "bg-accent-cyan",
  completed: "bg-accent-emerald",
  failed: "bg-accent-danger",
  cancelled: "bg-text-metadata",
};

function matchesStatusFilter(
  status: TaskStatus,
  filter: TaskStatusFilterId,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "active":
      return (
        status === "running" ||
        status === "verifying" ||
        status === "planning" ||
        status === "queued"
      );
    case "waiting_approval":
      return status === "waiting_approval" || status === "waiting_input";
    case "completed":
      return status === "completed";
    case "failed":
      return status === "failed" || status === "cancelled";
  }
}

export function MyTasksPage() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<TaskStatusFilterId>("all");
  const [workflowFilter, setWorkflowFilter] =
    useState<(typeof WORKFLOW_FILTER_OPTIONS)[number]>("All Workflows");
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>("Recent");
  const [searchQuery, setSearchQuery] = useState("");

  const statusCounts = useMemo(
    () => ({
      all: MY_TASKS_LIST.length,
      active: MY_TASKS_LIST.filter((t) =>
        matchesStatusFilter(t.status, "active"),
      ).length,
      waiting_approval: MY_TASKS_LIST.filter((t) =>
        matchesStatusFilter(t.status, "waiting_approval"),
      ).length,
      completed: MY_TASKS_LIST.filter((t) =>
        matchesStatusFilter(t.status, "completed"),
      ).length,
      failed: MY_TASKS_LIST.filter((t) =>
        matchesStatusFilter(t.status, "failed"),
      ).length,
    }),
    [],
  );

  const filterTabs: readonly {
    id: TaskStatusFilterId;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "active", label: "Running", count: statusCounts.active },
    {
      id: "waiting_approval",
      label: "Needs Approval",
      count: statusCounts.waiting_approval,
    },
    { id: "completed", label: "Completed", count: statusCounts.completed },
    { id: "failed", label: "Failed", count: statusCounts.failed },
  ];

  const hasActiveFilters =
    statusFilter !== "all" ||
    workflowFilter !== "All Workflows" ||
    searchQuery.trim().length > 0;

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = MY_TASKS_LIST.filter((task) => {
      if (!matchesStatusFilter(task.status, statusFilter)) return false;
      if (
        workflowFilter !== "All Workflows" &&
        task.workflowName !== workflowFilter
      ) {
        return false;
      }
      if (!query) return true;
      return (
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.workflowName.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered];
    if (sortOrder === "Progress (High-Low)") {
      sorted.sort((a, b) => b.progress - a.progress);
    } else if (sortOrder === "ID (Asc)") {
      sorted.sort((a, b) => a.id.localeCompare(b.id));
    }
    return sorted;
  }, [statusFilter, workflowFilter, searchQuery, sortOrder]);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setWorkflowFilter("All Workflows");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-5">
      {/* Page Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[22px]">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Monitor active executions, pending checkpoints, and completed
            deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/workspace")}
          className="h-9 shrink-0 px-3.5 text-xs font-semibold"
        >
          + Delegate Task
        </Button>
      </header>

      {/* Filter & Search Bar */}
      <SurfaceCard bodyClassName="p-3.5" className="overflow-visible">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Segmented Status Tabs */}
          <div
            role="group"
            aria-label="Filter tasks by status"
            className="flex flex-wrap items-center gap-1 rounded-[6px] border border-border-default bg-canvas p-1"
          >
            {filterTabs.map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-[4px] px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                    isSelected
                      ? "bg-surface-2 text-accent-cyan"
                      : "text-text-metadata hover:text-text-primary"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          {/* Search, Workflow & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="my-tasks-search-input" className="sr-only">
              Search tasks by ID or title
            </label>
            <input
              id="my-tasks-search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Filter by task ID or name..."
              className="h-8 w-full min-w-0 rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none sm:w-52"
            />

            <SelectDropdown<(typeof WORKFLOW_FILTER_OPTIONS)[number]>
              id="tasks-workflow-filter"
              label="Workflow filter"
              inlineLabel="Workflow"
              value={workflowFilter}
              options={WORKFLOW_FILTER_OPTIONS}
              onChange={setWorkflowFilter}
            />

            <SelectDropdown<TaskSortOrder>
              id="tasks-sort-order"
              label="Sort tasks"
              inlineLabel="Sort"
              value={sortOrder}
              options={SORT_OPTIONS}
              onChange={setSortOrder}
            />
          </div>
        </div>

        {/* Active Filter Indicator & Prototype Notice */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-2.5 font-mono text-[10px]">
          <div className="flex flex-wrap items-center gap-2 text-text-secondary">
            {hasActiveFilters ? (
              <>
                <span className="text-accent-cyan">
                  Active filter: {statusFilter}
                  {workflowFilter !== "All Workflows"
                    ? ` · ${workflowFilter}`
                    : ""}
                  {searchQuery.trim() ? ` · "${searchQuery.trim()}"` : ""}
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-[4px] border border-border-interactive bg-surface-2 px-1.5 py-0.5 text-text-primary hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                >
                  Clear all
                </button>
              </>
            ) : (
              <span className="text-text-metadata">
                Filter mode: All statuses
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-text-metadata">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber"
            />
            <span>Mock Snapshot Data · GET /api/v1/tasks pending</span>
          </div>
        </div>
      </SurfaceCard>

      {/* Task Queue Table / Responsive Mobile Cards */}
      <SurfaceCard
        title="Task Executions"
        titleAddon={
          <StatusBadge
            tone="neutral"
            label={`${filteredTasks.length} of ${MY_TASKS_LIST.length}`}
            showDot={false}
          />
        }
        bodyClassName="p-0"
        className="overflow-hidden"
      >
        {MY_TASKS_LIST.length === 0 ? (
          <div className="flex flex-col items-start gap-3 p-6 text-xs text-text-secondary">
            <p>No delegated tasks exist yet in this workspace.</p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate("/workspace")}
            >
              + Delegate Task
            </Button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-start gap-3 p-6 text-xs text-text-secondary">
            <p>
              No tasks match the current search or status filters (
              <span className="font-mono text-text-primary">
                {searchQuery.trim() || statusFilter}
              </span>
              ).
            </p>
            <Button size="sm" variant="secondary" onClick={handleResetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-default bg-canvas/50 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                    <th scope="col" className="w-20 px-3 py-2.5 font-normal">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-normal">
                      Task &amp; Workflow
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-normal">
                      Status &amp; Stage
                    </th>
                    <th scope="col" className="w-24 px-3 py-2.5 font-normal xl:w-32">
                      Progress
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-2.5 font-normal xl:table-cell"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/80 text-xs">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="transition-colors hover:bg-surface-2/60"
                    >
                      <td className="px-3 py-3 font-mono whitespace-nowrap">
                        <Link
                          to={task.taskPath}
                          className="font-medium text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
                        >
                          {task.id}
                        </Link>
                      </td>

                      <td className="min-w-[180px] px-3 py-3">
                        <Link
                          to={task.taskPath}
                          className="font-medium leading-snug text-text-primary hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                        >
                          {task.title}
                        </Link>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[10px] text-text-metadata">
                          <span>{task.workflowName}</span>
                          <span>·</span>
                          <span>{task.workerCount} workers</span>
                          <span className="xl:hidden">
                            · {task.timestampLabel}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={task.status} />
                          <span className="font-mono text-[10px] leading-snug text-text-metadata">
                            {task.stageSummary} · {task.activeWorkerLabel}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5 xl:gap-2">
                          <div
                            role="progressbar"
                            aria-label={`${task.id} progress`}
                            aria-valuenow={task.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-1 w-10 shrink-0 overflow-hidden rounded-[2px] bg-surface-2 xl:w-16"
                          >
                            <div
                              className={`h-full ${PROGRESS_BAR_CLASSES[task.status]}`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-text-secondary tabular-nums whitespace-nowrap">
                            {task.progress}%
                          </span>
                        </div>
                      </td>

                      <td className="hidden px-3 py-3 font-mono text-[11px] text-text-metadata whitespace-nowrap tabular-nums xl:table-cell">
                        {task.timestampLabel}
                      </td>

                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {task.approvalPath &&
                            task.status === "waiting_approval" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => navigate(task.approvalPath!)}
                                className="h-7 border-accent-amber/40 bg-accent-amber/10 px-2 text-[11px] text-accent-amber hover:border-accent-amber"
                              >
                                Review
                              </Button>
                            )}

                          {task.reportPath && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate(task.reportPath!)}
                              className="h-7 px-2 text-[11px]"
                            >
                              Report
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(task.taskPath)}
                            className="h-7 px-2.5 text-[11px]"
                          >
                            Inspect
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (< 768px) */}
            <ul className="divide-y divide-border-default md:hidden">
              {filteredTasks.map((task) => (
                <li key={task.id} className="space-y-2.5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={task.taskPath}
                      className="font-mono text-xs font-semibold text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
                    >
                      {task.id}
                    </Link>
                    <StatusBadge status={task.status} />
                  </div>

                  <Link
                    to={task.taskPath}
                    className="block text-[13px] font-medium leading-snug text-text-primary hover:text-accent-cyan"
                  >
                    {task.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-text-metadata">
                    <span>{task.stageSummary}</span>
                    <span>{task.activeWorkerLabel}</span>
                    <span>{task.timestampLabel}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <div
                      role="progressbar"
                      aria-label={`${task.id} progress`}
                      aria-valuenow={task.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1 flex-1 overflow-hidden rounded-[2px] bg-surface-2"
                    >
                      <div
                        className={`h-full ${PROGRESS_BAR_CLASSES[task.status]}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-text-secondary tabular-nums">
                      {task.progress}%
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(task.taskPath)}
                      className="h-8 text-xs"
                    >
                      Inspect Task
                    </Button>

                    {task.approvalPath &&
                      task.status === "waiting_approval" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(task.approvalPath!)}
                          className="h-8 border-accent-amber/40 bg-accent-amber/10 text-xs text-accent-amber"
                        >
                          Review
                        </Button>
                      )}

                    {task.reportPath && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(task.reportPath!)}
                        className="h-8 text-xs"
                      >
                        Report
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Honest Footer Strip */}
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border-default bg-canvas/50 px-4 py-2.5 font-mono text-[10px] text-text-metadata">
          <span className="tabular-nums">
            Showing {filteredTasks.length} of {MY_TASKS_LIST.length} seeded
            mock tasks
          </span>
          <span>Live task feed awaits backend GET /api/v1/tasks</span>
        </footer>
      </SurfaceCard>
    </div>
  );
}
