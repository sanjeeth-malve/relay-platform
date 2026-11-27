import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { BotIcon, ShieldCheckIcon, WrenchIcon } from "./TeamIcons";
import type { AiWorkerFilter, AiWorkerUnit } from "../types/team";

export interface AiWorkforceSectionProps {
  units: readonly AiWorkerUnit[];
  filter: AiWorkerFilter;
  onFilterChange: (next: AiWorkerFilter) => void;
  searchQuery: string;
  onSearchChange: (next: string) => void;
  selectedWorkerId: string | null;
  onSelectWorker: (worker: AiWorkerUnit) => void;
}

const FILTER_TABS: readonly { id: AiWorkerFilter; label: string }[] = [
  { id: "all", label: "All Units" },
  { id: "active", label: "Active Runs" },
  { id: "tools", label: "Tool-Enabled" },
  { id: "analysis", label: "No External Tools" },
];

export function AiWorkforceSection({
  units,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedWorkerId,
  onSelectWorker,
}: AiWorkforceSectionProps) {
  const hasFilters = filter !== "all" || searchQuery.trim().length > 0;

  return (
    <section aria-label="AI Workforce Units" className="space-y-3.5 pt-2">
      {/* Section Header explicitly distinguishing non-human AI agents */}
      <div className="flex flex-col gap-2 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[16px] font-semibold tracking-tight text-text-primary">
              AI Workforce Units
            </h2>
            <StatusBadge
              tone="cyan"
              label="Non-Human Execution Agents"
              showDot={false}
            />
          </div>
          <p className="text-xs text-text-secondary">
            Task-scoped Sales MVP agent templates governed by the centralized Tool
            Executor — distinct from human organization accounts.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar for AI Workforce Units */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
        <div
          role="group"
          aria-label="Filter AI workforce units"
          className="flex flex-wrap items-center gap-1 rounded-[6px] border border-border-default bg-surface-1 p-1 self-start"
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onFilterChange(tab.id)}
                className={`inline-flex h-7 items-center rounded-[4px] border px-2.5 font-mono text-[11px] leading-none transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                  isSelected
                    ? "border-border-interactive bg-surface-2 text-accent-cyan"
                    : "border-transparent text-text-metadata hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <label htmlFor="ai-worker-search" className="sr-only">
            Search AI workforce units or allowed tools
          </label>
          <input
            id="ai-worker-search"
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter AI units or tools..."
            className="h-9 w-full rounded-[6px] border border-border-default bg-surface-1 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Units Grid or Empty State */}
      {units.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-start justify-between gap-3 rounded-[6px] border border-border-default bg-surface-1 p-5 sm:flex-row sm:items-center"
        >
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              No Matching AI Units
            </p>
            <p className="text-xs text-text-secondary">
              No specialized AI worker units match the current filter or search term.
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                onFilterChange("all");
                onSearchChange("");
              }}
              className="rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-1.5 font-mono text-xs text-accent-cyan transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
            >
              Reset AI Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {units.map((unit) => {
            const isSelected = selectedWorkerId === unit.id;
            const statusTone = unit.isActiveNow
              ? "cyan"
              : unit.hasWaitingApproval
                ? "amber"
                : "emerald";

            return (
              <article
                key={unit.id}
                data-testid={`ai-worker-card-${unit.id}`}
                className={`flex flex-col justify-between rounded-[6px] border p-4 transition-colors ${
                  isSelected
                    ? "border-accent-cyan bg-surface-2/80"
                    : "border-border-default bg-surface-1 hover:border-border-interactive"
                }`}
              >
                <div className="space-y-3">
                  {/* Card Top Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border-default bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-secondary whitespace-nowrap">
                      <BotIcon className="h-3 w-3 text-accent-cyan" />
                      <span>{unit.stageCode}</span>
                      <span aria-hidden="true" className="text-border-interactive">
                        ·
                      </span>
                      <span className="uppercase tracking-wider text-text-metadata">
                        AI Agent
                      </span>
                    </span>

                    <StatusBadge
                      tone={statusTone}
                      label={unit.statusLabel}
                      showDot={unit.isActiveNow}
                      className="text-[10px]"
                    />
                  </div>

                  {/* Worker Name & Specialization */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-text-primary">
                      {unit.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {unit.specialization}
                    </p>
                  </div>

                  {/* Tool Allowlist */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                      {unit.allowedTools.length > 0 ? (
                        <WrenchIcon className="h-3 w-3 shrink-0" />
                      ) : (
                        <ShieldCheckIcon className="h-3 w-3 shrink-0" />
                      )}
                      <span>Authorized Tools</span>
                    </div>
                    {unit.allowedTools.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {unit.allowedTools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-[4px] border border-border-default bg-canvas px-2 py-0.5 font-mono text-[10px] text-text-primary"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-block rounded-[4px] border border-border-default bg-canvas px-2 py-0.5 font-mono text-[10px] text-text-metadata">
                        None (Reasoning / Synthesis Only)
                      </span>
                    )}
                  </div>
                </div>

                {/* Linked Runs & Action */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    {unit.linkedTasks.slice(0, 3).map((task) => (
                      <Link
                        key={task.id}
                        to={task.taskPath}
                        title={task.title}
                        className="rounded-[4px] border border-border-default bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan whitespace-nowrap"
                      >
                        {task.id}
                      </Link>
                    ))}
                    {unit.linkedTasks.length > 3 && (
                      <span className="font-mono text-[10px] text-text-metadata">
                        +{unit.linkedTasks.length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectWorker(unit)}
                    data-testid={`inspect-worker-${unit.id}`}
                    className="rounded-[4px] border border-border-interactive bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-primary transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
                  >
                    Inspect Unit
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
