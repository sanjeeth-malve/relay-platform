import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { BotIcon, CloseIcon, ShieldCheckIcon, UserIcon } from "./TeamIcons";
import type { SelectedTeamEntity } from "../types/team";

export interface TeamEntityInspectorDrawerProps {
  selected: SelectedTeamEntity | null;
  onClose: () => void;
  onResendInvite: (memberId: string) => void;
}

export function TeamEntityInspectorDrawer({
  selected,
  onClose,
  onResendInvite,
}: TeamEntityInspectorDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selected) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onClose]);

  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-canvas/75"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Directory details inspector"
        className="relative z-10 flex h-full w-full max-w-[440px] flex-col border-l border-border-default bg-surface-1 text-text-primary"
      >
        {/* Top Bar */}
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border-default px-5 py-3.5">
          {selected.kind === "human" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-accent-emerald/30 bg-accent-emerald/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-emerald">
                <UserIcon className="h-3 w-3" />
                <span>Human User</span>
              </span>
              <span className="font-mono text-[11px] text-text-metadata">
                {selected.member.rbacTierLabel}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-cyan">
                <BotIcon className="h-3 w-3" />
                <span>Non-Human AI Agent</span>
              </span>
              <span className="font-mono text-[11px] text-text-metadata">
                {selected.worker.stageCode}
              </span>
            </div>
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border-default bg-surface-2 text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        {/* Scrollable Inspector Body */}
        <div className="relay-subtle-scroll min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          {selected.kind === "human" ? (
            <>
              {/* Human Identity Card */}
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border border-border-interactive bg-surface-2 font-mono text-sm font-semibold text-text-primary"
                >
                  {selected.member.initials}
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-base font-semibold text-text-primary">
                    {selected.member.name}
                  </h2>
                  <p className="truncate font-mono text-xs text-text-secondary">
                    {selected.member.email}
                  </p>
                  <p className="font-mono text-[11px] text-text-metadata">
                    Department: {selected.member.department}
                  </p>
                </div>
              </div>

              {/* Authority & Status Bento */}
              <div className="grid grid-cols-2 divide-x divide-border-default rounded-[6px] border border-border-default bg-canvas">
                <div className="p-3.5">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                    Approval Authority
                  </span>
                  <p
                    className={`mt-1.5 text-xs font-medium ${
                      selected.member.canApprove
                        ? "text-accent-emerald"
                        : "text-text-secondary"
                    }`}
                  >
                    {selected.member.authorityLabel}
                  </p>
                </div>
                <div className="p-3.5">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                    Activity Status
                  </span>
                  <p className="mt-1.5 font-mono text-xs text-text-primary">
                    {selected.member.lastActiveLabel}
                  </p>
                </div>
              </div>

              {/* Capabilities Scope */}
              <div className="space-y-2 rounded-[6px] border border-border-default bg-canvas p-4">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  <ShieldCheckIcon className="h-3.5 w-3.5 text-accent-cyan" />
                  <span>Workspace Role Permissions ({selected.member.role})</span>
                </div>
                <ul className="space-y-1.5 pt-1 text-xs text-text-secondary">
                  {selected.member.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan"
                      />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assigned Tasks */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  <span>Assigned / Monitored Tasks</span>
                  <span className="tabular-nums">
                    {selected.member.assignedTasks.length} linked
                  </span>
                </div>

                {selected.member.assignedTasks.length === 0 ? (
                  <p className="rounded-[6px] border border-border-default bg-canvas p-3.5 text-xs text-text-metadata">
                    No active or delegated tasks assigned to this human account.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {selected.member.assignedTasks.map((task) => (
                      <li key={task.id}>
                        <Link
                          to={task.taskPath}
                          onClick={onClose}
                          className="flex items-start justify-between gap-2 rounded-[6px] border border-border-default bg-canvas p-3 transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-accent-cyan">
                                {task.id}
                              </span>
                              <StatusBadge
                                status={task.status}
                                showDot={false}
                                className="text-[10px]"
                              />
                            </div>
                            <p className="text-xs font-medium text-text-primary">
                              {task.title}
                            </p>
                            <p className="font-mono text-[10px] text-text-metadata">
                              {task.stageSummary}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[11px] text-accent-cyan">
                            ↗
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {selected.member.status === "invited" && (
                <button
                  type="button"
                  onClick={() => onResendInvite(selected.member.id)}
                  className="w-full rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-2 font-mono text-xs text-text-primary transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                >
                  Resend Prototype Invite
                </button>
              )}
            </>
          ) : (
            <>
              {/* AI Worker Unit Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StatusBadge
                    tone={
                      selected.worker.isActiveNow
                        ? "cyan"
                        : selected.worker.hasWaitingApproval
                          ? "amber"
                          : "emerald"
                    }
                    label={selected.worker.statusLabel}
                    showDot={selected.worker.isActiveNow}
                  />
                  <span className="font-mono text-[10px] text-text-metadata">
                    Stage ID: {selected.worker.stageId}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-text-primary">
                  {selected.worker.name}
                </h2>
                <p className="font-mono text-[11px] text-text-metadata">
                  {selected.worker.architectureRole}
                </p>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {selected.worker.specialization}
                </p>
              </div>

              {/* Authorized Tools */}
              <div className="space-y-2 rounded-[6px] border border-border-default bg-canvas p-4">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  Authorized Tool Executor Allowlist
                </span>
                {selected.worker.allowedTools.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selected.worker.allowedTools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-accent-cyan"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">
                    None — strictly reasoning, orchestration, or verification only.
                  </p>
                )}
              </div>

              {/* Execution & Governance Guardrail */}
              <div className="space-y-1.5 rounded-[6px] border border-border-default bg-canvas p-4">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  Governance &amp; Security Boundary
                </span>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {selected.worker.guardrailNote}
                </p>
              </div>

              {/* Linked Task Runs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                  <span>Observed Task Executions</span>
                  <span className="tabular-nums">
                    {selected.worker.linkedTasks.length} tasks
                  </span>
                </div>

                <ul className="space-y-2">
                  {selected.worker.linkedTasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        to={task.taskPath}
                        onClick={onClose}
                        className="flex items-start justify-between gap-2 rounded-[6px] border border-border-default bg-canvas p-3 transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-accent-cyan">
                              {task.id}
                            </span>
                            <StatusBadge
                              status={task.status}
                              showDot={false}
                              className="text-[10px]"
                            />
                            {typeof task.nodeProgress === "number" && (
                              <span className="font-mono text-[10px] text-text-metadata tabular-nums">
                                Node {task.nodeProgress}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-text-primary">
                            {task.title}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] text-accent-cyan">
                          ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer Prototype Boundary Notice */}
        <footer className="shrink-0 border-t border-border-default bg-canvas px-5 py-3 font-mono text-[10px] text-text-metadata">
          UI prototype state · Role mutations await /api/v1/team/members &amp; RBAC
          persistence.
        </footer>
      </aside>
    </div>
  );
}
