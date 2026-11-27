import { Link, useNavigate } from "react-router";
import { Button } from "./Button";
import { StatusBadge, type TaskStatus } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";
import type { WorkforceActivityItem } from "../types/dashboard";

export interface WorkforceActivityPanelProps {
  activeRunsLabel: string;
  items: WorkforceActivityItem[];
}

const progressBarClasses: Record<TaskStatus, string> = {
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

const progressTextClasses: Record<TaskStatus, string> = {
  queued: "text-text-secondary",
  planning: "text-text-secondary",
  running: "text-text-secondary",
  waiting_input: "text-accent-amber",
  waiting_approval: "text-accent-amber",
  verifying: "text-text-secondary",
  completed: "text-accent-emerald",
  failed: "text-accent-danger",
  cancelled: "text-text-metadata",
};

function renderStageCell(item: WorkforceActivityItem) {
  if (item.status === "running" || item.status === "verifying" || item.status === "planning") {
    return (
      <div className="inline-flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan animate-pulse motion-reduce:animate-none"
        />
        <span>{item.stageLabel}</span>
      </div>
    );
  }

  return <StatusBadge status={item.status} label={item.stageLabel} showDot={false} />;
}

function getActionButtonClass(status: TaskStatus): string {
  if (status === "waiting_approval") {
    return "border-accent-amber/35 bg-accent-amber/15 text-accent-amber hover:border-accent-amber/60 hover:bg-accent-amber/25";
  }
  if (status === "completed") {
    return "text-text-secondary hover:text-text-primary";
  }
  return "";
}

export function WorkforceActivityPanel({
  activeRunsLabel,
  items,
}: WorkforceActivityPanelProps) {
  const navigate = useNavigate();

  return (
    <SurfaceCard
      title="Live Workforce Activity"
      titleAddon={
        <StatusBadge tone="neutral" label={activeRunsLabel} showDot={false} />
      }
      action={
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 rounded-[4px] text-xs text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan whitespace-nowrap"
        >
          <span>View all</span>
          <span aria-hidden="true">→</span>
        </Link>
      }
      bodyClassName="p-0"
      className="overflow-hidden"
    >
      {/* Desktop & Tablet High-Density Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-default bg-canvas/50 font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              <th scope="col" className="w-24 px-4 py-2.5 font-normal">
                ID
              </th>
              <th scope="col" className="px-4 py-2.5 font-normal">
                Task
              </th>
              <th scope="col" className="px-4 py-2.5 font-normal">
                Active Stage
              </th>
              <th scope="col" className="w-36 px-4 py-2.5 font-normal">
                Progress
              </th>
              <th scope="col" className="w-24 px-4 py-2.5 text-right font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default/70 text-xs">
            {items.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-surface-2/60"
              >
                <td className="px-4 py-3 font-mono text-text-secondary whitespace-nowrap">
                  {item.id}
                </td>
                <td className="px-4 py-3 font-medium text-text-primary">
                  {item.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {renderStageCell(item)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      role="progressbar"
                      aria-label={`${item.id} progress`}
                      aria-valuenow={item.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1 w-20 shrink-0 overflow-hidden rounded-[2px] bg-surface-2"
                    >
                      <div
                        className={`h-full ${progressBarClasses[item.status]}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span
                      className={`font-mono text-[11px] tabular-nums whitespace-nowrap ${progressTextClasses[item.status]}`}
                    >
                      {item.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(item.actionPath)}
                    className={`h-7 px-2.5 text-[11px] ${getActionButtonClass(item.status)}`}
                  >
                    {item.actionLabel}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List (avoids squeezed multi-column tables below 768px) */}
      <ul className="divide-y divide-border-default/80 md:hidden">
        {items.map((item) => (
          <li key={item.id} className="space-y-2.5 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 font-mono text-[11px]">
                <span className="text-text-secondary">{item.id}</span>
                <span aria-hidden="true" className="text-text-metadata">
                  ·
                </span>
                <span className="text-text-metadata">{item.updatedAt}</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(item.actionPath)}
                className={`h-7 shrink-0 px-2.5 text-[11px] ${getActionButtonClass(item.status)}`}
              >
                {item.actionLabel}
              </Button>
            </div>

            <p className="text-[13px] font-medium leading-snug text-text-primary">
              {item.title}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
              <StatusBadge
                status={item.status}
                label={item.stageLabel}
                showDot={
                  item.status === "running" ||
                  item.status === "verifying" ||
                  item.status === "planning"
                }
              />

              <div className="flex items-center gap-2">
                <div
                  role="progressbar"
                  aria-label={`${item.id} progress`}
                  aria-valuenow={item.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1 w-16 overflow-hidden rounded-[2px] bg-surface-2"
                >
                  <div
                    className={`h-full ${progressBarClasses[item.status]}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span
                  className={`font-mono text-[11px] tabular-nums ${progressTextClasses[item.status]}`}
                >
                  {item.progress}%
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
