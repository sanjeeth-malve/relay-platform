import { useParams } from "react-router";
import { StatusBadge } from "../components/StatusBadge";
import { SurfaceCard } from "../components/SurfaceCard";

export interface PlaceholderPageProps {
  title: string;
  description: string;
  routePath: string;
  includeParamId?: boolean;
}

export function PlaceholderPage({
  title,
  description,
  routePath,
  includeParamId = false,
}: PlaceholderPageProps) {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {title}
            {includeParamId && id ? (
              <span className="ml-2 font-mono text-sm font-normal text-accent-cyan">
                {id}
              </span>
            ) : null}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>

        <StatusBadge label="shell_placeholder" tone="cyan" />
      </div>

      <SurfaceCard
        title="Screen Placeholder"
        subtitle="Routing and AppShell layout are active; screen implementation is scheduled in upcoming tasks."
      >
        <div className="grid gap-3 text-xs text-text-secondary sm:grid-cols-2">
          <div className="min-w-0 rounded-[6px] border border-border-default bg-surface-2 p-3">
            <div className="font-mono text-[11px] uppercase text-text-metadata">
              Route Pattern
            </div>
            <div className="mt-1 truncate font-mono text-text-primary">
              {routePath}
            </div>
          </div>
          <div className="min-w-0 rounded-[6px] border border-border-default bg-surface-2 p-3">
            <div className="font-mono text-[11px] uppercase text-text-metadata">
              Data Integration
            </div>
            <div className="mt-1 truncate font-mono text-text-primary">
              Pending backend /api/v1 wiring
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
