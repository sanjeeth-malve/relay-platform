import type {
  ReportDetailRecord,
  ReportSectionId,
  ReportTocItem,
} from "../types/reports";

export interface ReportTableOfContentsProps {
  items: readonly ReportTocItem[];
  activeSectionId: ReportSectionId;
  onSelectSection: (sectionId: ReportSectionId) => void;
  report: Pick<
    ReportDetailRecord,
    | "entitiesCount"
    | "sourcesCheckedCount"
    | "verifiedCount"
    | "unverifiedCount"
    | "confidenceScoreLabel"
  >;
}

export function ReportTableOfContents({
  items,
  activeSectionId,
  onSelectSection,
  report,
}: ReportTableOfContentsProps) {
  return (
    <>
      {/* Mobile / Tablet Compact TOC & Telemetry Strip (< xl) */}
      <div className="border-b border-border-default bg-surface-1 px-4 py-3 xl:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
          <span className="font-semibold">Contents · 9 Sections</span>
          <div className="flex flex-wrap items-center gap-3 tabular-nums">
            <span>Entities: {report.entitiesCount}</span>
            <span>Sources: {report.sourcesCheckedCount}</span>
            <span className="text-accent-emerald">
              Confidence: {report.confidenceScoreLabel}
            </span>
          </div>
        </div>
        <nav
          aria-label="Report section navigation"
          className="flex flex-wrap gap-1.5"
        >
          {items.map((item) => {
            const isActive = item.id === activeSectionId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onSelectSection(item.id);
                }}
                className={`rounded-[4px] border px-2 py-1 font-mono text-[11px] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                  isActive
                    ? "border-accent-cyan bg-surface-2 text-accent-cyan"
                    : "border-border-default bg-canvas text-text-secondary hover:border-border-interactive hover:text-text-primary"
                }`}
              >
                {item.number} · {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Desktop Left Rail (xl+) */}
      <aside
        aria-label="Report Contents"
        className="hidden xl:flex xl:h-[calc(100vh-195px)] xl:min-h-[500px] xl:max-h-[780px] xl:w-[200px] xl:shrink-0 xl:flex-col xl:justify-between xl:overflow-y-auto xl:border-r xl:border-border-default xl:bg-canvas xl:p-3.5"
      >
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
            Contents
          </h2>
          <nav aria-label="Report section navigation" className="space-y-1">
            {items.map((item) => {
              const isActive = item.id === activeSectionId;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelectSection(item.id);
                  }}
                  className={`flex items-center gap-2 rounded-r-[4px] border-l-2 px-2 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                    isActive
                      ? "border-accent-cyan bg-surface-2 font-medium text-text-primary"
                      : "border-transparent text-text-secondary hover:bg-surface-2/50 hover:text-text-primary"
                  }`}
                >
                  <span className="font-mono text-[10px] text-text-metadata tabular-nums">
                    {item.number}
                  </span>
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <dl className="mt-6 space-y-2 border-t border-border-default pt-4 font-mono text-[11px]">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-text-metadata">Entities</dt>
            <dd className="text-text-primary tabular-nums">
              {report.entitiesCount}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-text-metadata">Sources Checked</dt>
            <dd className="text-text-primary tabular-nums">
              {report.sourcesCheckedCount}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-text-metadata">Verified Facts</dt>
            <dd className="text-accent-emerald tabular-nums">
              {report.verifiedCount}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-text-metadata">Open Gaps</dt>
            <dd
              className={`tabular-nums ${
                report.unverifiedCount > 0
                  ? "text-accent-amber"
                  : "text-text-secondary"
              }`}
            >
              {report.unverifiedCount}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border-default pt-2 font-medium">
            <dt className="text-accent-emerald">Verification</dt>
            <dd className="text-accent-emerald tabular-nums">
              {report.confidenceScoreLabel}
            </dd>
          </div>
        </dl>
      </aside>
    </>
  );
}
