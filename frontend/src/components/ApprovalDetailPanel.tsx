import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Button } from "./Button";
import { StatusBadge, type BadgeTone } from "./StatusBadge";
import type {
  ApprovalDecisionStatus,
  ApprovalRecord,
  ApprovalRiskLevel,
} from "../types/approvals";

export interface ApprovalDetailPanelProps {
  item: ApprovalRecord | null;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, reason: string) => void;
}

const RISK_TONE: Record<ApprovalRiskLevel, BadgeTone> = {
  high: "danger",
  medium: "amber",
  low: "neutral",
};

const DECISION_BADGE: Record<
  ApprovalDecisionStatus,
  { tone: BadgeTone; label: string }
> = {
  pending: { tone: "amber", label: "Awaiting Approval" },
  approved: { tone: "emerald", label: "Approved (Local Prototype)" },
  rejected: { tone: "danger", label: "Rejected (Local Prototype)" },
};

export function ApprovalDetailPanel({
  item,
  onApprove,
  onReject,
}: ApprovalDetailPanelProps) {
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const [auditNote, setAuditNote] = useState("");
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  useEffect(() => {
    setAuditNote("");
    setIsConfirmingReject(false);
    setRejectReason("");
    setRejectError(null);
    setCopyState("idle");
  }, [item?.id, item?.status]);

  useEffect(() => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTop = 0;
    }
  }, [item?.id]);

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const formattedPayload = useMemo(
    () => (item ? JSON.stringify(item.payloadPreview, null, 2) : ""),
    [item],
  );

  if (!item) {
    return (
      <section
        aria-label="Approval Detail"
        className="flex min-h-[360px] min-w-0 flex-1 flex-col items-center justify-center overflow-hidden bg-canvas p-6 text-center lg:min-h-0"
      >
        <p className="font-mono text-xs uppercase tracking-wider text-text-metadata">
          No Approval Selected
        </p>
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-text-secondary">
          Select an approval item from the inbox or switch status filters to
          review resolved checkpoints.
        </p>
      </section>
    );
  }

  const badge = DECISION_BADGE[item.status];
  const isPending = item.status === "pending";

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(formattedPayload);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const handleStartReject = () => {
    setIsConfirmingReject(true);
    setRejectReason(auditNote.trim());
    setRejectError(null);
  };

  const handleConfirmReject = () => {
    if (!isPending) return;
    const trimmed = rejectReason.trim();
    if (trimmed.length < 6) {
      setRejectError(
        "Provide a clear rejection reason (at least 6 characters) for the audit log.",
      );
      return;
    }
    onReject(item.id, trimmed);
    setIsConfirmingReject(false);
    setRejectError(null);
  };

  return (
    <section
      aria-label="Approval Detail"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-canvas lg:h-full"
    >
      {/* Main Review Body (independent desktop scroller) */}
      <div
        ref={bodyScrollRef}
        data-testid="approval-detail-scroll"
        className="relay-subtle-scroll space-y-5 p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
      >
        {/* Context Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-0.5 font-mono text-xs font-semibold text-accent-cyan">
                {item.id}
              </span>
              <span className="rounded-[4px] border border-border-default bg-surface-1 px-2 py-0.5 font-mono text-xs text-text-secondary">
                {item.taskId}
              </span>
              <StatusBadge
                tone={badge.tone}
                label={badge.label}
                showDot
              />
              <StatusBadge
                tone={RISK_TONE[item.riskLevel]}
                label={item.riskSummary}
                showDot={false}
              />
            </div>

            {item.taskPath && (
              <Link
                to={item.taskPath}
                className="inline-flex items-center gap-1 rounded-[4px] font-mono text-[11px] text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
              >
                <span>Inspect Execution Graph</span>
                <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>

          <h2 className="text-lg font-semibold leading-snug text-text-primary sm:text-[20px]">
            {item.requestedAction}
          </h2>

          <div className="flex flex-col gap-1 font-mono text-[11px] text-text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>Task: {item.taskTitle}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>Requested by {item.requestingWorker}</span>
          </div>
        </div>

        {/* Section 1: Checkpoint Summary 3-Column Grid */}
        <div className="grid grid-cols-1 divide-y divide-border-default rounded-[6px] border border-border-default bg-surface-1 md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y xl:grid-cols-3 xl:divide-x xl:divide-y-0">
          <div className="min-w-0 p-4">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
              Authorized Tool
            </span>
            <p className="mt-1.5 text-[14px] font-semibold text-text-primary [overflow-wrap:anywhere]">
              {item.authorizedTool}
            </p>
            <p className="mt-1 font-mono text-[11px] text-text-metadata [overflow-wrap:anywhere]">
              {item.toolVersion}
            </p>
          </div>

          <div className="min-w-0 p-4">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
              Proposed Scope
            </span>
            <p className="mt-1.5 font-mono text-[13px] font-semibold text-text-primary [overflow-wrap:anywhere]">
              {item.proposedScope}
            </p>
            <p className="mt-1 font-mono text-[11px] text-text-metadata [overflow-wrap:anywhere]">
              {item.scopeDetail}
            </p>
          </div>

          <div className="min-w-0 p-4">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
              Est. Duration &amp; Impact
            </span>
            <p className="mt-1.5 font-mono text-[13px] font-semibold text-accent-cyan [overflow-wrap:anywhere]">
              {item.estimatedImpact}
            </p>
            <p className="mt-1 font-mono text-[11px] text-text-metadata [overflow-wrap:anywhere]">
              {item.impactDetail}
            </p>
          </div>
        </div>

        {/* Section 2: Reason & Supporting Context */}
        <div className="space-y-3 rounded-[6px] border border-border-default bg-surface-1 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan"
              />
              <span>Reason &amp; Supporting Context</span>
            </div>
            <span className="font-mono text-[11px] text-text-metadata tabular-nums">
              {item.confidenceLabel}
            </span>
          </div>

          <p className="text-[13px] leading-relaxed text-text-primary">
            {item.reason}
          </p>

          <ul className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] text-text-secondary">
            {item.supportingContext.map((note) => (
              <li
                key={note}
                className="rounded-[4px] border border-border-default bg-surface-2 px-2 py-0.5"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Proposed Action Payload */}
        <div className="overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default bg-surface-2/60 px-4 py-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              Proposed Action Payload
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-[4px] border border-border-default bg-canvas px-2 py-0.5 font-mono text-[10px] text-text-metadata">
                READ-ONLY
              </span>
              <button
                type="button"
                onClick={() => void handleCopyPayload()}
                className="rounded-[4px] border border-border-default bg-canvas px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
              >
                {copyState === "copied"
                  ? "Copied ✓"
                  : copyState === "failed"
                    ? "Copy failed"
                    : "Copy JSON"}
              </button>
            </div>
          </div>

          <pre className="relay-subtle-scroll overflow-x-auto bg-canvas p-4 font-mono text-[11px] leading-relaxed text-text-primary">
            <code>{formattedPayload}</code>
          </pre>
        </div>

        {/* Audit Context Footprint */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-text-metadata">
          <span>Policy ID: {item.policyId}</span>
          <span>Triggered at {item.submittedUtcLabel} ({item.submittedAtLabel})</span>
        </div>
      </div>

      {/* Bottom Decision Action Bar (docked at bottom of right column) */}
      <footer className="shrink-0 border-t border-border-default bg-surface-1 p-4 sm:px-6">
        {isPending ? (
          isConfirmingReject ? (
            <div
              role="region"
              aria-label="Confirm rejection"
              className="space-y-3 rounded-[6px] border border-accent-danger/35 bg-accent-danger/5 p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-danger">
                  Confirm Rejection · {item.id}
                </span>
                <span className="font-mono text-[10px] text-text-metadata">
                  Local prototype action only
                </span>
              </div>

              <div>
                <label
                  htmlFor="reject-reason-input"
                  className="mb-1.5 block text-xs text-text-secondary"
                >
                  Rejection reason (recorded in local audit state)
                </label>
                <input
                  id="reject-reason-input"
                  type="text"
                  value={rejectReason}
                  onChange={(event) => {
                    setRejectReason(event.target.value);
                    if (rejectError) setRejectError(null);
                  }}
                  placeholder="Specify policy or verification reason for rejecting..."
                  aria-invalid={Boolean(rejectError)}
                  className="h-9 w-full rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
                />
                {rejectError && (
                  <p role="alert" className="mt-1.5 text-xs text-accent-danger">
                    {rejectError}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsConfirmingReject(false);
                    setRejectError(null);
                  }}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleConfirmReject}
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <label htmlFor="approval-audit-note" className="sr-only">
                  Optional audit note
                </label>
                <input
                  id="approval-audit-note"
                  type="text"
                  value={auditNote}
                  onChange={(event) => setAuditNote(event.target.value)}
                  placeholder="Add optional audit note for execution log..."
                  className="h-9 w-full rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 shrink-0">
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleStartReject}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onApprove(item.id, auditNote.trim())}
                  className="font-semibold"
                >
                  Approve &amp; Resume
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  tone={badge.tone}
                  label={badge.label}
                  showDot
                />
                {item.resolvedAtLabel && (
                  <span className="font-mono text-[11px] text-text-metadata">
                    Updated {item.resolvedAtLabel}
                  </span>
                )}
              </div>
              {item.decisionNote && (
                <p className="text-text-secondary">
                  Decision note:{" "}
                  <span className="text-text-primary">{item.decisionNote}</span>
                </p>
              )}
            </div>
            <span className="font-mono text-[10px] text-text-metadata">
              Decision locked to prevent duplicate submission
            </span>
          </div>
        )}
      </footer>
    </section>
  );
}
