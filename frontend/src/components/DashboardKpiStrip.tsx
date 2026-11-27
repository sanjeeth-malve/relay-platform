import type { BadgeTone } from "./StatusBadge";
import type { DashboardKpiMetric } from "../types/dashboard";

export interface DashboardKpiStripProps {
  metrics: DashboardKpiMetric[];
}

const subtextToneClasses: Record<BadgeTone, string> = {
  cyan: "text-accent-cyan",
  amber: "text-accent-amber",
  emerald: "text-accent-emerald",
  danger: "text-accent-danger",
  neutral: "text-text-metadata",
};

const dotToneClasses: Record<BadgeTone, string> = {
  cyan: "bg-accent-cyan",
  amber: "bg-accent-amber",
  emerald: "bg-accent-emerald",
  danger: "bg-accent-danger",
  neutral: "bg-text-metadata",
};

export function DashboardKpiStrip({ metrics }: DashboardKpiStripProps) {
  return (
    <section aria-label="Workspace Key Metrics">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-border-default bg-border-default sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col justify-between bg-surface-1 p-4"
          >
            <span className="font-mono text-[11px] uppercase leading-none tracking-wider text-text-metadata">
              {metric.label}
            </span>
            <div className="my-2 font-mono text-2xl font-semibold tabular-nums leading-tight text-text-primary">
              {metric.value}
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${subtextToneClasses[metric.tone]}`}
            >
              {metric.tone !== "neutral" && (
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotToneClasses[metric.tone]} ${
                    metric.pulse ? "animate-pulse motion-reduce:animate-none" : ""
                  }`}
                />
              )}
              <span>{metric.subtext}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
