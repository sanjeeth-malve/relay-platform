import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import { ReportEditorialBody } from "../components/ReportEditorialBody";
import { ReportEvidencePanel } from "../components/ReportEvidencePanel";
import { ReportTableOfContents } from "../components/ReportTableOfContents";
import { StatusBadge } from "../components/StatusBadge";
import { REPORT_DETAILS_MOCK, STANDARD_REPORT_TOC } from "../data/reportsMock";
import { TASK_EXECUTION_MOCKS } from "../data/taskExecutionMock";
import type { ReportSectionId } from "../types/reports";

function findScrollContainer(startEl: HTMLElement | null): HTMLElement | null {
  let current: HTMLElement | null = startEl;
  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function ReportDetailPage() {
  const { reportId = "RLY-104" } = useParams<{ reportId?: string }>();
  const navigate = useNavigate();

  const report = REPORT_DETAILS_MOCK[reportId];

  const [activeSectionId, setActiveSectionId] =
    useState<ReportSectionId>("summary");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    report?.companies[0]?.id ?? null,
  );
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(
    null,
  );
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [showExportNotice, setShowExportNotice] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1280px)").matches
      : true,
  );

  const editorialContainerRef = useRef<HTMLDivElement | null>(null);
  const activeSectionRef = useRef<ReportSectionId>("summary");
  const programmaticLockUntilRef = useRef<number>(0);
  const clickedSectionOverrideRef = useRef<ReportSectionId | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handleChange = () => setIsDesktopLayout(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const commitActiveSection = useCallback((nextId: ReportSectionId) => {
    if (activeSectionRef.current !== nextId) {
      activeSectionRef.current = nextId;
      setActiveSectionId(nextId);
    }
  }, []);

  useEffect(() => {
    activeSectionRef.current = "summary";
    clickedSectionOverrideRef.current = null;
    programmaticLockUntilRef.current = 0;
    setActiveSectionId("summary");
    setSelectedCompanyId(report?.companies[0]?.id ?? null);
    setSelectedCitationId(null);
    setShareState("idle");
    setShowExportNotice(false);
  }, [report]);

  useEffect(() => {
    if (!report) return;
    const container = editorialContainerRef.current;
    if (!container) return;

    const scrollRoot = findScrollContainer(container);
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("section[aria-labelledby]"),
    );
    if (sections.length === 0) return;

    let rafId: number | null = null;
    let lastScrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY;

    const syncActiveSection = () => {
      rafId = null;
      const now = Date.now();
      const scrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
      const clientHeight = scrollRoot
        ? scrollRoot.clientHeight
        : window.innerHeight;
      const scrollHeight = scrollRoot
        ? scrollRoot.scrollHeight
        : document.documentElement.scrollHeight;

      if (now < programmaticLockUntilRef.current) {
        lastScrollTop = scrollTop;
        return;
      }

      if (clickedSectionOverrideRef.current !== null) {
        // Keep exact clicked section highlighted while scroll position has not moved away manually
        if (Math.abs(scrollTop - lastScrollTop) <= 4) {
          return;
        }
        clickedSectionOverrideRef.current = null;
      }

      const rootRectTop = scrollRoot
        ? scrollRoot.getBoundingClientRect().top
        : 0;
      const isAtBottom =
        scrollHeight > clientHeight + 8 &&
        scrollTop + clientHeight >= scrollHeight - 16;

      if (isAtBottom) {
        const lastSectionId = sections[sections.length - 1]?.getAttribute(
          "aria-labelledby",
        ) as ReportSectionId | null;
        if (lastSectionId) {
          commitActiveSection(lastSectionId);
          lastScrollTop = scrollTop;
          return;
        }
      }

      const readingAnchorY = rootRectTop + 112;
      let resolvedId = sections[0].getAttribute(
        "aria-labelledby",
      ) as ReportSectionId;

      for (const sec of sections) {
        const id = sec.getAttribute("aria-labelledby") as ReportSectionId | null;
        if (!id) continue;
        if (sec.getBoundingClientRect().top <= readingAnchorY) {
          resolvedId = id;
        } else {
          break;
        }
      }

      lastScrollTop = scrollTop;
      if (resolvedId) {
        commitActiveSection(resolvedId);
      }
    };

    const scheduleSync = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncActiveSection);
    };

    const handleUserScrollIntent = () => {
      clickedSectionOverrideRef.current = null;
      programmaticLockUntilRef.current = 0;
    };

    const handleScrollEnd = () => {
      programmaticLockUntilRef.current = 0;
      lastScrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
    };

    const observer = new IntersectionObserver(
      () => {
        scheduleSync();
      },
      {
        root: scrollRoot,
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.25],
      },
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;
    scrollTarget.addEventListener("scroll", scheduleSync, { passive: true });
    scrollTarget.addEventListener("wheel", handleUserScrollIntent, {
      passive: true,
    });
    scrollTarget.addEventListener("touchstart", handleUserScrollIntent, {
      passive: true,
    });
    scrollTarget.addEventListener("pointerdown", handleUserScrollIntent, {
      passive: true,
    });
    scrollTarget.addEventListener("scrollend", handleScrollEnd, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      scrollTarget.removeEventListener("scroll", scheduleSync);
      scrollTarget.removeEventListener("wheel", handleUserScrollIntent);
      scrollTarget.removeEventListener("touchstart", handleUserScrollIntent);
      scrollTarget.removeEventListener("pointerdown", handleUserScrollIntent);
      scrollTarget.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [report, isDesktopLayout, commitActiveSection]);

  useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const citationMap = useMemo(() => {
    const map = new Map<string, (typeof report.citations)[number]>();
    if (!report) return map;
    for (const citation of report.citations) {
      map.set(citation.id, citation);
    }
    return map;
  }, [report]);

  if (!report) {
    return (
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Reports</span>
        </Link>

        <section
          aria-label="Report Not Found"
          className="rounded-[6px] border border-border-default bg-surface-1 p-6"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge tone="danger" label="Not Found in Mock Registry" />
            <span className="font-mono text-xs text-text-metadata">
              Report ID: {reportId}
            </span>
          </div>
          <h1 className="mt-3 text-lg font-semibold text-text-primary">
            Research report unavailable locally
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Report <span className="font-mono text-text-primary">{reportId}</span>{" "}
            is not in the local mock registry, and{" "}
            <span className="font-mono text-accent-cyan">
              GET /api/v1/reports/{reportId}
            </span>{" "}
            is pending backend integration. Open a seeded deliverable below.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              onClick={() => navigate("/reports/RLY-104")}
            >
              Open RLY-104 Report
            </Button>
            <Button variant="secondary" onClick={() => navigate("/reports")}>
              Back to Reports
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const hasLinkedTask = Boolean(TASK_EXECUTION_MOCKS[report.taskId]);
  const isCleanAudit = report.publishStatus === "verified";

  const handleSelectSection = (sectionId: ReportSectionId) => {
    commitActiveSection(sectionId);
    clickedSectionOverrideRef.current = sectionId;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    programmaticLockUntilRef.current = Date.now() + (reduced ? 120 : 650);

    const target = document.getElementById(sectionId);
    if (target) {
      const sectionEl = target.closest("section") ?? target;
      sectionEl.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      target.focus({ preventScroll: true });
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedCitationId(null);
  };

  const handleSelectCitation = (citationId: string) => {
    const citation = citationMap.get(citationId);
    setSelectedCitationId(citationId);
    if (citation && citation.companyId !== "all") {
      setSelectedCompanyId(citation.companyId);
    } else {
      setSelectedCompanyId(null);
    }
  };

  const handleClearEvidenceFilter = () => {
    setSelectedCitationId(null);
    setSelectedCompanyId(null);
  };

  const handleCopySummary = async () => {
    const summaryText = [
      `${report.id} — ${report.title}`,
      `Confidence: ${report.confidenceScoreLabel} (${report.verifiedCount} verified citations, ${report.unverifiedCount} unverified gaps)`,
      "",
      `Verified Facts: ${report.executiveSummaryFacts}`,
      `AI Assessment: ${report.executiveSummaryAssessment}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summaryText);
      setShareState("copied");
    } catch {
      setShareState("failed");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-3.5">
      {/* Editorial Header Bar */}
      <header className="rounded-[6px] border border-border-default bg-surface-1 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 rounded-[4px] border border-border-default bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
            >
              <span aria-hidden="true">←</span>
              <span>Reports</span>
            </Link>

            <span className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-0.5 font-mono text-xs font-semibold text-accent-cyan whitespace-nowrap">
              {report.id}
            </span>

            <h1 className="min-w-0 text-[16px] font-semibold leading-snug text-text-primary sm:text-[18px]">
              {report.title}
            </h1>

            <StatusBadge
              tone={isCleanAudit ? "emerald" : "amber"}
              label={isCleanAudit ? "Verified ✓" : "Verified w/ Gaps"}
              showDot={false}
            />

            <span className="font-mono text-[11px] text-text-metadata whitespace-nowrap tabular-nums">
              {report.sourcesCheckedCount} sources · {report.completedLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasLinkedTask && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/tasks/${report.taskId}`)}
                className="h-8"
              >
                Inspect Execution
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleCopySummary()}
              className="h-8"
            >
              {shareState === "copied"
                ? "Summary Copied ✓"
                : shareState === "failed"
                  ? "Copy Failed"
                  : "Copy Summary"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowExportNotice((prev) => !prev)}
              className="h-8 font-semibold"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Honest Prototype Notice when Export is toggled */}
        {showExportNotice && (
          <div
            role="status"
            className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-2 text-xs"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="amber" label="Frontend Prototype · Export Pending" />
              <span className="text-text-secondary">
                Server PDF/Markdown export via{" "}
                <span className="font-mono text-accent-cyan">
                  GET /api/v1/reports/{report.id}/export
                </span>{" "}
                is not yet connected.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowExportNotice(false)}
              className="font-mono text-[11px] text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Mobile/Tablet Quick Jump to Evidence Panel when a Citation is Selected */}
        {selectedCitationId && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-accent-cyan/35 bg-accent-cyan/10 px-3 py-1.5 font-mono text-[11px] xl:hidden">
            <span className="text-accent-cyan">
              Citation {selectedCitationId} selected in Verification Evidence
            </span>
            <a
              href="#verification-evidence-panel"
              onClick={(event) => {
                event.preventDefault();
                const el = document.getElementById("verification-evidence-panel");
                if (el) {
                  const reduced = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches;
                  el.scrollIntoView({
                    behavior: reduced ? "auto" : "smooth",
                    block: "start",
                  });
                }
              }}
              className="font-semibold text-text-primary underline-offset-2 hover:underline"
            >
              Jump to Evidence ↓
            </a>
          </div>
        )}
      </header>

      {/* 3-Column Editorial Reading & Verification Workspace */}
      <div className="flex min-w-0 flex-col overflow-hidden rounded-[6px] border border-border-default bg-canvas xl:flex-row">
        <ReportTableOfContents
          items={STANDARD_REPORT_TOC}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          report={report}
        />

        <ReportEditorialBody
          report={report}
          citationMap={citationMap}
          selectedCompanyId={selectedCompanyId}
          selectedCitationId={selectedCitationId}
          containerRef={editorialContainerRef}
          onSelectCompany={handleSelectCompany}
          onSelectCitation={handleSelectCitation}
        />

        <ReportEvidencePanel
          report={report}
          selectedCompanyId={selectedCompanyId}
          selectedCitationId={selectedCitationId}
          onSelectCitation={handleSelectCitation}
          onClearFilter={handleClearEvidenceFilter}
        />
      </div>
    </div>
  );
}
