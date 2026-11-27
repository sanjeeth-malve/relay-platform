import { useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import type { EvidenceSourceTag, ReportDetailRecord } from "../types/reports";
import { toSafeExternalUrl } from "../utils/executionStatus";

export interface ReportEvidencePanelProps {
  report: ReportDetailRecord;
  selectedCompanyId: string | null;
  selectedCitationId: string | null;
  onSelectCitation: (citationId: string) => void;
  onClearFilter: () => void;
}

const SOURCE_TAG_CLASSES: Record<EvidenceSourceTag, string> = {
  CRUSTDATA: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10",
  OLOSTEP: "text-text-primary border-border-interactive bg-surface-2",
  VERIFIER: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10",
  UNVERIFIED: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
};

export function ReportEvidencePanel({
  report,
  selectedCompanyId,
  selectedCitationId,
  onSelectCitation,
  onClearFilter,
}: ReportEvidencePanelProps) {
  const selectedCitation = useMemo(
    () =>
      selectedCitationId
        ? (report.citations.find((c) => c.id === selectedCitationId) ?? null)
        : null,
    [report.citations, selectedCitationId],
  );

  const selectedCompany = useMemo(
    () =>
      selectedCompanyId
        ? (report.companies.find((c) => c.id === selectedCompanyId) ?? null)
        : null,
    [report.companies, selectedCompanyId],
  );

  const displayedCitations = useMemo(() => {
    if (selectedCitation) {
      const rest = report.citations.filter((c) => c.id !== selectedCitation.id);
      return [selectedCitation, ...rest];
    }
    if (selectedCompanyId) {
      const matched = report.citations.filter(
        (c) => c.companyId === selectedCompanyId || c.companyId === "all",
      );
      if (matched.length > 0) return matched;
    }
    return report.citations;
  }, [report.citations, selectedCitation, selectedCompanyId]);

  const scopeTitle = selectedCitation
    ? `Citation ${selectedCitation.code} · ${selectedCitation.companyName}`
    : selectedCompany
      ? selectedCompany.name
      : "All Audited Sources";

  const hasActiveFilter = Boolean(selectedCitation || selectedCompany);

  return (
    <aside
      id="verification-evidence-panel"
      aria-label="Verification Evidence"
      className="flex w-full min-w-0 flex-col border-t border-border-default bg-surface-1 xl:h-[calc(100vh-195px)] xl:min-h-[500px] xl:max-h-[780px] xl:w-[320px] xl:shrink-0 xl:border-t-0 xl:border-l"
    >
      {/* Evidence Context Header */}
      <div className="shrink-0 border-b border-border-default p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
            Verification Evidence
          </span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              className="rounded-[4px] font-mono text-[10px] text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              Show all ({report.citations.length})
            </button>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-[14px] font-semibold text-text-primary">
            {scopeTitle}
          </h2>
          {selectedCitation ? (
            <StatusBadge
              tone={
                selectedCitation.verificationState === "verified"
                  ? "emerald"
                  : "amber"
              }
              label={
                selectedCitation.verificationState === "verified"
                  ? "Verified"
                  : "Unverified"
              }
              showDot
              className="text-[10px]"
            />
          ) : selectedCompany ? (
            <StatusBadge
              tone={
                selectedCompany.verificationState === "verified"
                  ? "emerald"
                  : "amber"
              }
              label={
                selectedCompany.verificationState === "verified"
                  ? "Passed Audit ✓"
                  : "Has Open Gap"
              }
              showDot={false}
              className="text-[10px]"
            />
          ) : (
            <StatusBadge
              tone="neutral"
              label={`${report.verifiedCount} verified · ${report.unverifiedCount} unverified`}
              showDot={false}
              className="text-[10px]"
            />
          )}
        </div>
      </div>

      {/* Citations Stack */}
      <div className="relay-subtle-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {displayedCitations.map((citation) => {
          const isSelected = citation.id === selectedCitationId;
          const isVerified = citation.verificationState === "verified";
          const safeUrl = toSafeExternalUrl(citation.url);

          return (
            <article
              key={citation.id}
              data-testid={`evidence-card-${citation.id}`}
              className={`rounded-[6px] border p-3 transition-colors ${
                isSelected
                  ? "border-accent-cyan bg-surface-2"
                  : isVerified
                    ? "border-border-default bg-canvas hover:border-border-interactive"
                    : "border-accent-amber/40 bg-accent-amber/5 hover:border-accent-amber"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-[4px] border px-1.5 py-0 font-mono text-[10px] font-semibold tracking-wider ${SOURCE_TAG_CLASSES[citation.sourceTag]}`}
                  >
                    [{citation.sourceTag}]
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectCitation(citation.id)}
                    aria-pressed={isSelected}
                    className="rounded-[4px] font-mono text-[10px] font-medium text-text-secondary hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                  >
                    {citation.code}
                  </button>
                </div>

                <StatusBadge
                  tone={isVerified ? "emerald" : "amber"}
                  label={isVerified ? "Verified" : "Unverified"}
                  showDot
                  className="px-1.5 py-0 text-[10px]"
                />
              </div>

              <h3 className="mt-2 text-xs font-semibold leading-snug text-text-primary">
                {citation.sourceName}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {citation.summary}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-2 font-mono text-[10px]">
                <span className="text-text-metadata tabular-nums">
                  {citation.companyName} · {citation.collectedAt}
                </span>

                {safeUrl ? (
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${citation.sourceName} in a new tab`}
                    className="inline-flex max-w-full items-center gap-1 text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
                  >
                    <span className="max-w-[140px] truncate">{safeUrl}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="text-text-metadata">Source URL omitted</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Audit Telemetry Footer */}
      <div className="mt-auto shrink-0 border-t border-border-default bg-surface-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
            Confidence Score
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-accent-emerald tabular-nums">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent-emerald"
            />
            <span>{report.confidenceScoreLabel}</span>
          </div>
        </div>
        <p className="mt-1 font-mono text-[10px] text-text-metadata">
          Mock audit snapshot · GET /api/v1/reports/{"{id}"}/evidence pending
        </p>
      </div>
    </aside>
  );
}
