import type { RefObject } from "react";
import { StatusBadge } from "./StatusBadge";
import type {
  EpistemicCategory,
  ReportCitation,
  ReportDetailRecord,
  ReportSectionId,
} from "../types/reports";
import { toSafeExternalUrl } from "../utils/executionStatus";

export interface ReportEditorialBodyProps {
  report: ReportDetailRecord;
  citationMap: ReadonlyMap<string, ReportCitation>;
  selectedCompanyId: string | null;
  selectedCitationId: string | null;
  containerRef?: RefObject<HTMLDivElement | null>;
  onSelectCompany: (companyId: string) => void;
  onSelectCitation: (citationId: string) => void;
}

function SectionHeading({
  id,
  number,
  title,
  tag,
  aside,
}: {
  id: ReportSectionId;
  number: string;
  title: string;
  tag: EpistemicCategory | "mixed" | "gap";
  aside?: string;
}) {
  const tagBadge =
    tag === "verified_fact"
      ? { tone: "emerald" as const, label: "Verified Facts" }
      : tag === "ai_assessment"
        ? { tone: "cyan" as const, label: "AI Assessment" }
        : tag === "gap"
          ? { tone: "amber" as const, label: "Open Gaps" }
          : { tone: "neutral" as const, label: "Facts & Assessment" };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] font-semibold text-accent-cyan tabular-nums">
          {number}
        </span>
        <h2
          id={id}
          tabIndex={-1}
          className="text-[16px] font-semibold tracking-tight text-text-primary focus:outline-none"
        >
          {title}
        </h2>
        <StatusBadge
          tone={tagBadge.tone}
          label={tagBadge.label}
          showDot={false}
          className="text-[10px]"
        />
      </div>
      {aside && (
        <span className="font-mono text-[11px] text-text-metadata">
          {aside}
        </span>
      )}
    </div>
  );
}

function CitationChipList({
  citationIds,
  citationMap,
  selectedCitationId,
  onSelectCitation,
}: {
  citationIds: readonly string[];
  citationMap: ReadonlyMap<string, ReportCitation>;
  selectedCitationId: string | null;
  onSelectCitation: (citationId: string) => void;
}) {
  if (citationIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {citationIds.map((cid) => {
        const citation = citationMap.get(cid);
        if (!citation) return null;
        const isSelected = citation.id === selectedCitationId;
        const isVerified = citation.verificationState === "verified";

        return (
          <button
            key={cid}
            type="button"
            onClick={() => onSelectCitation(citation.id)}
            aria-pressed={isSelected}
            aria-label={`Inspect citation ${citation.code}: ${citation.sourceName}`}
            className={`inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              isSelected
                ? "border-accent-cyan bg-accent-cyan/15 text-accent-cyan"
                : isVerified
                  ? "border-border-default bg-surface-2 text-text-secondary hover:border-border-interactive hover:text-text-primary"
                  : "border-accent-amber/40 bg-accent-amber/10 text-accent-amber hover:border-accent-amber"
            }`}
          >
            <span>[{citation.code}]</span>
            <span className="hidden sm:inline">{citation.sourceTag}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ReportEditorialBody({
  report,
  citationMap,
  selectedCompanyId,
  selectedCitationId,
  containerRef,
  onSelectCompany,
  onSelectCitation,
}: ReportEditorialBodyProps) {
  return (
    <div
      ref={containerRef}
      className="relay-subtle-scroll min-w-0 flex-1 space-y-8 bg-canvas p-4 sm:p-5 xl:h-[calc(100vh-195px)] xl:min-h-[500px] xl:max-h-[780px] xl:overflow-y-auto xl:pb-72"
    >
      {/* 01. Executive Summary */}
      <section aria-labelledby="summary" className="scroll-mt-16 space-y-3">
        <SectionHeading
          id="summary"
          number="01"
          title="Executive Summary"
          tag="mixed"
        />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-[6px] border border-border-default bg-surface-1 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-emerald">
                Verified Facts Baseline
              </span>
              <StatusBadge
                tone="emerald"
                label="Verified ✓"
                showDot={false}
                className="text-[10px]"
              />
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {report.executiveSummaryFacts}
            </p>
          </div>

          <div className="rounded-[6px] border border-border-default bg-surface-1 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-cyan">
                Supervisor Strategic Synthesis
              </span>
              <StatusBadge
                tone="cyan"
                label="AI Assessment"
                showDot={false}
                className="text-[10px]"
              />
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {report.executiveSummaryAssessment}
            </p>
          </div>
        </div>

        {/* Key Findings & Recommendations */}
        <div className="rounded-[6px] border border-border-default bg-surface-1 p-4">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
            Key Findings &amp; Recommendations
          </h3>
          <ul className="mt-3 divide-y divide-border-default">
            {report.recommendations.map((rec) => (
              <li
                key={rec.id}
                className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {rec.title}
                  </span>
                  <StatusBadge
                    tone={rec.category === "verified_fact" ? "emerald" : "cyan"}
                    label={
                      rec.category === "verified_fact"
                        ? "Verified Fact"
                        : "AI Assessment"
                    }
                    showDot={false}
                    className="text-[10px]"
                  />
                </div>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {rec.detail}
                </p>
                <CitationChipList
                  citationIds={rec.citationIds}
                  citationMap={citationMap}
                  selectedCitationId={selectedCitationId}
                  onSelectCitation={onSelectCitation}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02. Company Profile */}
      <section
        aria-labelledby="company-profile"
        className="scroll-mt-16 space-y-3"
      >
        <SectionHeading
          id="company-profile"
          number="02"
          title={`Company Profile (${report.companies.length})`}
          tag="verified_fact"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {report.companies.map((company) => {
            const isSelected = company.id === selectedCompanyId;
            return (
              <article
                key={company.id}
                className={`rounded-[6px] border p-4 transition-colors ${
                  isSelected
                    ? "border-accent-cyan bg-surface-2/60"
                    : "border-border-default bg-surface-1"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {company.rank} · {company.name} — {company.category}
                    </h3>
                  </div>
                  <span className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    {company.stage}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-1 gap-2.5 border-t border-border-default pt-3 sm:grid-cols-3">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                      HQ
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-text-primary">
                      {company.hq}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                      Target ICP
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-text-primary">
                      {company.targetIcp}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                      Key Signal
                    </dt>
                    <dd className="mt-0.5 font-mono text-[11px] text-accent-cyan">
                      {company.keySignal}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-2.5">
                  <CitationChipList
                    citationIds={company.citationIds}
                    citationMap={citationMap}
                    selectedCitationId={selectedCitationId}
                    onSelectCitation={onSelectCitation}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 03. Company Information */}
      <section
        aria-labelledby="company-information"
        className="scroll-mt-16 space-y-3"
      >
        <SectionHeading
          id="company-information"
          number="03"
          title="Company Information"
          tag="verified_fact"
          aside="Crustdata firmographic records"
        />

        <div className="overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-default bg-canvas/70 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Entity
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Headcount
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Funding
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Hiring
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Citations
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-xs">
                {report.companies.map((company) => (
                  <tr key={company.id} className="hover:bg-surface-2/50">
                    <td className="px-2.5 py-2.5 font-medium text-text-primary">
                      {company.name}
                    </td>
                    <td className="px-2.5 py-2.5 font-mono text-[11px] text-text-secondary tabular-nums whitespace-nowrap">
                      {company.headcount}
                    </td>
                    <td className="px-2.5 py-2.5 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                      {company.fundingTotal}
                    </td>
                    <td className="px-2.5 py-2.5 font-mono text-[11px] text-accent-emerald tabular-nums whitespace-nowrap">
                      {company.hiringGrowth}
                    </td>
                    <td className="px-2.5 py-2.5">
                      <CitationChipList
                        citationIds={company.citationIds}
                        citationMap={citationMap}
                        selectedCitationId={selectedCitationId}
                        onSelectCitation={onSelectCitation}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border-default md:hidden">
            {report.companies.map((company) => (
              <li key={company.id} className="space-y-2 p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">
                    {company.name}
                  </span>
                  <span className="font-mono text-accent-emerald tabular-nums">
                    {company.hiringGrowth}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-text-secondary">
                  <span>{company.headcount}</span>
                  <span>{company.fundingTotal}</span>
                </div>
                <CitationChipList
                  citationIds={company.citationIds}
                  citationMap={citationMap}
                  selectedCitationId={selectedCitationId}
                  onSelectCitation={onSelectCitation}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04. Business Overview */}
      <section
        aria-labelledby="business-overview"
        className="scroll-mt-16 space-y-3"
      >
        <SectionHeading
          id="business-overview"
          number="04"
          title="Business Overview"
          tag="verified_fact"
          aside="Product, pricing & trust center extracts"
        />

        <div className="space-y-2.5">
          {report.companies.map((company) => (
            <article
              key={company.id}
              className="rounded-[6px] border border-border-default bg-surface-1 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[13px] font-semibold text-text-primary">
                  {company.name} · {company.category}
                </h3>
                <CitationChipList
                  citationIds={company.citationIds}
                  citationMap={citationMap}
                  selectedCitationId={selectedCitationId}
                  onSelectCitation={onSelectCitation}
                />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                {company.businessSummary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 05. Potential Fit (Documented Rubric Breakdown) */}
      <section aria-labelledby="potential-fit" className="scroll-mt-16 space-y-3">
        <SectionHeading
          id="potential-fit"
          number="05"
          title="Potential Fit &amp; Rubric Scoring"
          tag="ai_assessment"
          aside="Weighted 100-point rubric"
        />

        <div className="rounded-[6px] border border-border-default bg-surface-1 p-4 space-y-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {report.rubricCriteria.map((item) => (
              <div
                key={item.id}
                className="rounded-[6px] border border-border-default bg-canvas p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-text-primary">
                    {item.criterion}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-accent-cyan tabular-nums">
                    {item.weightPct}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                  {item.measurementBasis}
                </p>
                <p className="mt-1.5 font-mono text-[10px] text-accent-emerald">
                  Top benchmark: {item.topLeaderScore}
                </p>
              </div>
            ))}
          </div>

          <ul className="divide-y divide-border-default border-t border-border-default pt-3">
            {report.companies.map((company) => (
              <li key={company.id} className="space-y-1.5 py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-text-primary">
                    {company.name}
                  </span>
                  <span className="font-mono text-xs font-semibold text-accent-cyan tabular-nums">
                    {company.fitScore}/100
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {company.fitRationale}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06. Comparison Matrix (Interactive Row Selection -> Evidence Panel) */}
      <section aria-labelledby="comparison" className="scroll-mt-16 space-y-3">
        <SectionHeading
          id="comparison"
          number="06"
          title="Comparison Matrix"
          tag="mixed"
          aside="Click any row to inspect evidence"
        />

        <div className="overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
          {/* Desktop / Tablet Matrix */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-default bg-canvas/80 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Company
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Funding
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Est. ARR
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 font-normal">
                    Hiring
                  </th>
                  <th scope="col" className="px-2 py-2.5 font-normal">
                    Fit
                  </th>
                  <th scope="col" className="px-2.5 py-2.5 text-right font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-xs">
                {report.companies.map((company) => {
                  const isSelected = company.id === selectedCompanyId;
                  const isVerified = company.verificationState === "verified";

                  return (
                    <tr
                      key={company.id}
                      onClick={() => onSelectCompany(company.id)}
                      className={`cursor-pointer border-l-2 transition-colors ${
                        isSelected
                          ? "border-accent-cyan bg-surface-2"
                          : "border-transparent hover:bg-surface-2/60"
                      }`}
                    >
                      <td className="px-2.5 py-2.5">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectCompany(company.id);
                          }}
                          aria-pressed={isSelected}
                          className="inline-flex items-center gap-1.5 rounded-[4px] font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              isSelected ? "bg-accent-cyan" : "bg-transparent"
                            }`}
                          />
                          <span>{company.name}</span>
                        </button>
                      </td>
                      <td className="px-2.5 py-2.5 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                        {company.fundingTotal}
                      </td>
                      <td className="px-2.5 py-2.5 font-mono text-[11px] text-text-secondary tabular-nums whitespace-nowrap">
                        {company.estimatedArr}
                      </td>
                      <td className="px-2.5 py-2.5 font-mono text-[11px] text-accent-emerald tabular-nums whitespace-nowrap">
                        {company.hiringGrowth}
                      </td>
                      <td className="px-2 py-2.5 font-mono text-[11px] text-accent-cyan tabular-nums whitespace-nowrap">
                        {company.fitScore}
                      </td>
                      <td className="px-2.5 py-2.5 text-right whitespace-nowrap">
                        <StatusBadge
                          tone={isVerified ? "emerald" : "amber"}
                          label={isVerified ? "Verified ✓" : "Open Gap"}
                          showDot={false}
                          className="text-[10px]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Matrix Cards */}
          <ul className="divide-y divide-border-default md:hidden">
            {report.companies.map((company) => {
              const isSelected = company.id === selectedCompanyId;
              const isVerified = company.verificationState === "verified";

              return (
                <li key={company.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCompany(company.id)}
                    aria-pressed={isSelected}
                    className={`w-full space-y-2 border-l-2 p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                      isSelected
                        ? "border-accent-cyan bg-surface-2"
                        : "border-transparent hover:bg-surface-2/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        {company.name}
                      </span>
                      <StatusBadge
                        tone={isVerified ? "emerald" : "amber"}
                        label={isVerified ? "Verified ✓" : "Unverified Gap"}
                        showDot={false}
                        className="text-[10px]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-text-secondary">
                      <span>{company.fundingTotal}</span>
                      <span>ARR: {company.estimatedArr}</span>
                      <span className="text-accent-emerald">
                        {company.hiringGrowth}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 07. Research Evidence */}
      <section
        aria-labelledby="research-evidence"
        className="scroll-mt-16 space-y-3"
      >
        <SectionHeading
          id="research-evidence"
          number="07"
          title={`Research Evidence (${report.citations.length})`}
          tag="mixed"
          aside="Select any citation to inspect source & audit status"
        />

        <div className="space-y-2">
          {report.citations.map((citation) => {
            const isSelected = citation.id === selectedCitationId;
            const isVerified = citation.verificationState === "verified";
            const safeUrl = toSafeExternalUrl(citation.url);

            return (
              <div
                key={citation.id}
                className={`flex flex-col gap-2 rounded-[6px] border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  isSelected
                    ? "border-accent-cyan bg-surface-2"
                    : "border-border-default bg-surface-1"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-accent-cyan">
                      [{citation.code}]
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      {citation.sourceName}
                    </span>
                    <StatusBadge
                      tone={isVerified ? "emerald" : "amber"}
                      label={isVerified ? "Verified" : "Unverified"}
                      showDot
                      className="text-[10px]"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {citation.summary}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {safeUrl && (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[4px] border border-border-default bg-canvas px-2 py-1 font-mono text-[10px] text-text-secondary hover:border-border-interactive hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                    >
                      Source ↗
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectCitation(citation.id)}
                    aria-pressed={isSelected}
                    className={`rounded-[4px] border px-2.5 py-1 font-mono text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                      isSelected
                        ? "border-accent-cyan bg-accent-cyan/15 text-accent-cyan"
                        : "border-border-interactive bg-surface-2 text-text-primary hover:border-accent-cyan"
                    }`}
                  >
                    {isSelected ? "Inspecting" : "Inspect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 08. Information Gaps */}
      <section
        aria-labelledby="information-gaps"
        className="scroll-mt-16 space-y-3"
      >
        <SectionHeading
          id="information-gaps"
          number="08"
          title="Information Gaps"
          tag="gap"
          aside="Disclosed missing or unverified evidence"
        />

        <div className="space-y-2.5">
          {report.informationGaps.map((gap) => (
            <article
              key={gap.id}
              className="rounded-[6px] border border-accent-amber/35 bg-accent-amber/5 p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-text-primary">
                  {gap.topic}
                </h3>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    tone="amber"
                    label="Unverified Gap"
                    showDot
                    className="text-[10px]"
                  />
                  {gap.relatedCitationId && (
                    <button
                      type="button"
                      onClick={() => onSelectCitation(gap.relatedCitationId!)}
                      className="rounded-[4px] border border-accent-amber/40 bg-surface-1 px-2 py-0.5 font-mono text-[10px] text-accent-amber hover:border-accent-amber focus-visible:outline-2 focus-visible:outline-accent-cyan"
                    >
                      Inspect [{gap.relatedCitationId}]
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {gap.reason}
              </p>
              <p className="font-mono text-[11px] text-text-metadata">
                Qualification guidance: {gap.impact}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 09. Final Analysis */}
      <section aria-labelledby="final-analysis" className="scroll-mt-16 space-y-3">
        <SectionHeading
          id="final-analysis"
          number="09"
          title="Final Analysis"
          tag="ai_assessment"
        />

        <div className="rounded-[6px] border border-border-default bg-surface-1 p-4 space-y-4">
          <p className="text-[13px] leading-relaxed text-text-primary">
            {report.finalAnalysisVerdict}
          </p>

          <div className="border-t border-border-default pt-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-metadata">
              Recommended Actions
            </h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-text-secondary">
              {report.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
