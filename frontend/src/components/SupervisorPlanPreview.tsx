import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";
import type { SupervisorPlanStage } from "../types/workspace";

export interface SupervisorPlanPreviewProps {
  estimatedDurationLabel: string;
  stages: SupervisorPlanStage[];
}

export function SupervisorPlanPreview({
  estimatedDurationLabel,
  stages,
}: SupervisorPlanPreviewProps) {
  return (
    <SurfaceCard bodyClassName="p-4 space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold uppercase tracking-wider text-text-metadata">
            Supervisor Plan Preview
          </h2>
          <StatusBadge tone="neutral" label="Autopilot" showDot={false} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 uppercase tracking-wider text-text-metadata">
          <span className="tabular-nums">{estimatedDurationLabel}</span>
          <span aria-hidden="true">·</span>
          <span>5 WORKERS</span>
          <span aria-hidden="true">·</span>
          <span className="text-accent-emerald">VERIFICATION ON</span>
        </div>
      </div>

      {/* 5 Pipeline Stage Cards (2-col on tablet, 5-col on desktop) */}
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage) => {
          const isVerify = Boolean(stage.isVerification);
          return (
            <li
              key={stage.stepNumber}
              className={`flex min-w-0 flex-col justify-between gap-1 rounded-[6px] border p-2.5 transition-colors ${
                isVerify
                  ? "border-accent-emerald/45 bg-accent-emerald/5 hover:border-accent-emerald"
                  : "border-border-default bg-surface-2 hover:border-border-interactive"
              }`}
            >
              <div className="min-w-0">
                <div
                  className={`mb-0.5 flex items-center justify-between gap-1 font-mono text-[10px] uppercase tracking-wider ${
                    isVerify ? "text-accent-emerald" : "text-accent-cyan"
                  }`}
                >
                  <span className="truncate">{stage.stageLabel}</span>
                  {isVerify && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-emerald"
                    />
                  )}
                </div>
                <div className="text-[12px] font-medium leading-snug text-text-primary">
                  {stage.workerName}
                </div>
              </div>
              <div
                className={`pt-1 font-mono text-[10px] leading-snug ${
                  isVerify ? "text-accent-emerald/90" : "text-text-metadata"
                }`}
              >
                {stage.detail}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Bottom Telemetry Sub-strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-3 font-mono text-[11px] text-text-metadata">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span>
            SUPERVISOR:{" "}
            <span className="text-text-primary">STANDBY · 5 STAGES</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            WORKERS: <span className="text-text-primary">5 BLUEPRINT STEPS</span>
          </span>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 rounded-[4px] text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan whitespace-nowrap"
        >
          <span>View execution queue</span>
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="2.5" width="4" height="3.5" rx="0.5" />
            <rect x="10" y="2.5" width="4" height="3.5" rx="0.5" />
            <rect x="6" y="10" width="4" height="3.5" rx="0.5" />
            <path d="M4 6v2h8V6M8 8v2" />
          </svg>
        </Link>
      </div>
    </SurfaceCard>
  );
}
