import { Link } from "react-router";
import { StatusBadge, type BadgeTone } from "./StatusBadge";
import type { HumanMemberRole, HumanTeamMember } from "../types/team";

export interface TeamDirectoryTableProps {
  members: readonly HumanTeamMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: HumanTeamMember) => void;
  onResendInvite: (member: HumanTeamMember) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const ROLE_BADGE_MAP: Record<HumanMemberRole, { tone: BadgeTone }> = {
  Admin: { tone: "cyan" },
  "Lead Ops": { tone: "neutral" },
  Analyst: { tone: "neutral" },
  Invited: { tone: "amber" },
};

export function TeamDirectoryTable({
  members,
  selectedMemberId,
  onSelectMember,
  onResendInvite,
  hasActiveFilters,
  onResetFilters,
}: TeamDirectoryTableProps) {
  if (members.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-start justify-between gap-4 rounded-[6px] border border-border-default bg-surface-1 p-6 sm:flex-row sm:items-center"
      >
        <div className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
            No Matching Members
          </p>
          <p className="text-xs text-text-secondary">
            {hasActiveFilters
              ? "No human organization members match the active tab, role, or search query."
              : "No organization members found in the current directory snapshot."}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-1.5 font-mono text-xs text-accent-cyan transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
      {/* Desktop & Tablet High-Density Members Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-default bg-canvas/60 font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              <th scope="col" className="px-3 py-2.5 font-normal xl:px-4">
                Member
              </th>
              <th scope="col" className="px-2.5 py-2.5 font-normal whitespace-nowrap xl:px-4">
                Role
              </th>
              <th scope="col" className="px-2.5 py-2.5 font-normal leading-tight xl:px-4">
                Approval Authority
              </th>
              <th scope="col" className="px-2.5 py-2.5 font-normal whitespace-nowrap xl:px-4">
                <span className="xl:hidden">Tasks</span>
                <span className="hidden xl:inline">Assigned Tasks</span>
              </th>
              <th scope="col" className="hidden px-4 py-2.5 font-normal whitespace-nowrap xl:table-cell">
                Last Active
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-normal whitespace-nowrap xl:px-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-default text-xs">
            {members.map((member) => {
              const isSelected = selectedMemberId === member.id;
              const roleBadge = ROLE_BADGE_MAP[member.role];

              return (
                <tr
                  key={member.id}
                  data-testid={`team-member-row-${member.id}`}
                  className={`transition-colors ${
                    isSelected
                      ? "bg-surface-2"
                      : "hover:bg-surface-2/60"
                  }`}
                >
                  {/* Member Name & Email */}
                  <td
                    className={`border-l-2 px-3 py-3 xl:px-4 ${
                      isSelected ? "border-accent-cyan" : "border-transparent"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5 xl:gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border font-mono text-[11px] font-medium ${
                          member.status === "invited"
                            ? "border-border-default bg-surface-2 text-text-metadata"
                            : "border-border-interactive bg-surface-2 text-text-secondary"
                        }`}
                      >
                        {member.initials}
                      </span>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectMember(member)}
                          className="block max-w-[140px] truncate text-left text-[13px] font-medium text-text-primary transition-colors hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan xl:max-w-[220px]"
                        >
                          {member.name}
                        </button>
                        <p className="max-w-[148px] truncate font-mono text-[11px] text-text-metadata xl:max-w-[240px]">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-2.5 py-3 whitespace-nowrap xl:px-4">
                    <StatusBadge
                      tone={roleBadge.tone}
                      label={member.role}
                      showDot={false}
                      className={
                        member.role === "Analyst"
                          ? "bg-surface-2 text-text-metadata"
                          : ""
                      }
                    />
                  </td>

                  {/* Approval Authority (+ compact Last Active below xl) */}
                  <td className="px-2.5 py-3 whitespace-nowrap xl:px-4">
                    {member.canApprove ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-accent-emerald">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-emerald"
                        />
                        <span>{member.authorityLabel}</span>
                      </span>
                    ) : (
                      <span className="text-text-metadata">
                        {member.authorityLabel}
                      </span>
                    )}
                    <span className="mt-0.5 block font-mono text-[10px] text-text-metadata xl:hidden">
                      {member.lastActiveLabel}
                    </span>
                  </td>

                  {/* Assigned Tasks (Links directly to /tasks/:taskId) */}
                  <td className="px-2.5 py-3 xl:px-4">
                    {member.assignedTasks.length === 0 ? (
                      <span className="font-mono text-[11px] text-text-metadata tabular-nums">
                        0
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {member.assignedTasks.map((task) => (
                          <Link
                            key={task.id}
                            to={task.taskPath}
                            title={task.title}
                            className="rounded-[4px] border border-border-default bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
                          >
                            {task.id}
                          </Link>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Last Active (Desktop xl+ dedicated Stitch column) */}
                  <td className="hidden px-4 py-3 whitespace-nowrap xl:table-cell">
                    {member.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 text-text-secondary">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-emerald animate-pulse motion-reduce:animate-none"
                        />
                        <span>{member.lastActiveLabel}</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-text-secondary tabular-nums">
                        {member.lastActiveLabel}
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-3 text-right whitespace-nowrap xl:px-4">
                    <div className="inline-flex items-center gap-1.5">
                      {member.status === "invited" && (
                        <button
                          type="button"
                          onClick={() => onResendInvite(member)}
                          data-testid={`resend-invite-${member.id}`}
                          className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-text-metadata hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
                        >
                          Resend
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectMember(member)}
                        data-testid={`inspect-member-${member.id}`}
                        className="rounded-[4px] border border-border-interactive bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-primary transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan xl:px-2.5"
                      >
                        {member.status === "invited" ? "Details" : "Inspect"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Member Cards (< 768px) */}
      <ul className="divide-y divide-border-default md:hidden">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id;
          const roleBadge = ROLE_BADGE_MAP[member.role];

          return (
            <li
              key={member.id}
              data-testid={`team-member-card-${member.id}`}
              className={`space-y-3 border-l-2 p-4 ${
                isSelected
                  ? "border-accent-cyan bg-surface-2"
                  : "border-transparent bg-surface-1"
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-border-interactive bg-surface-2 font-mono text-[11px] font-medium text-text-secondary"
                  >
                    {member.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-text-primary">
                      {member.name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-text-metadata">
                      {member.email}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  tone={roleBadge.tone}
                  label={member.role}
                  showDot={false}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span
                  className={
                    member.canApprove
                      ? "inline-flex items-center gap-1.5 font-medium text-accent-emerald"
                      : "text-text-metadata"
                  }
                >
                  {member.canApprove && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-emerald"
                    />
                  )}
                  <span>{member.authorityLabel}</span>
                </span>

                <span className="font-mono text-[11px] text-text-metadata tabular-nums">
                  {member.lastActiveLabel}
                </span>
              </div>

              {member.assignedTasks.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {member.assignedTasks.map((task) => (
                    <Link
                      key={task.id}
                      to={task.taskPath}
                      className="rounded-[4px] border border-border-default bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-secondary hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      {task.id}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-0.5">
                {member.status === "invited" && (
                  <button
                    type="button"
                    onClick={() => onResendInvite(member)}
                    className="rounded-[4px] border border-border-interactive bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-secondary hover:text-text-primary"
                  >
                    Resend
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectMember(member)}
                  className="rounded-[4px] border border-border-interactive bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-primary hover:border-accent-cyan"
                >
                  {member.status === "invited" ? "Details" : "Inspect"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
