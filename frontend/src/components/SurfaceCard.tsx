import type { ReactNode } from "react";

export interface SurfaceCardProps {
  title?: string;
  subtitle?: string;
  /** Optional compact badge/tag displayed adjacent to the card title. */
  titleAddon?: ReactNode;
  action?: ReactNode;
  surface?: 1 | 2;
  /** Override default body padding (e.g., "p-0" for full-bleed tables). */
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
}

export function SurfaceCard({
  title,
  subtitle,
  titleAddon,
  action,
  surface = 1,
  bodyClassName = "p-4",
  children,
  className = "",
}: SurfaceCardProps) {
  const surfaceBg = surface === 2 ? "bg-surface-2" : "bg-surface-1";

  return (
    <section
      className={`rounded-[6px] border border-border-default ${surfaceBg} ${className}`}
    >
      {(title || subtitle || titleAddon || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-4 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {title && (
              <h2 className="text-[14px] font-semibold leading-5 text-text-primary">
                {title}
              </h2>
            )}
            {titleAddon}
            {subtitle && (
              <p className="w-full text-xs text-text-secondary">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
