import { useMemo, useState, type FormEvent } from "react";
import { AiWorkforceSection } from "../components/AiWorkforceSection";
import { Button } from "../components/Button";
import { SelectDropdown } from "../components/SelectDropdown";
import { StatusBadge } from "../components/StatusBadge";
import { TeamDirectoryTable } from "../components/TeamDirectoryTable";
import { TeamEntityInspectorDrawer } from "../components/TeamEntityInspectorDrawer";
import {
  CpuIcon,
  PlusIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "../components/TeamIcons";
import {
  AI_WORKFORCE_UNITS,
  HUMAN_TEAM_MEMBERS_INITIAL,
  WORKSPACE_ACCESS_TIERS,
} from "../data/teamMock";
import type {
  AiWorkerFilter,
  HumanRoleFilter,
  HumanTeamMember,
  SelectedTeamEntity,
  TeamMemberTab,
} from "../types/team";

type InviteRoleOption = "Admin" | "Lead Ops" | "Analyst";

const ROLE_FILTER_OPTIONS: readonly HumanRoleFilter[] = [
  "All Roles",
  "Admin",
  "Lead Ops",
  "Analyst",
  "Invited",
];

const INVITE_ROLE_OPTIONS: readonly InviteRoleOption[] = [
  "Analyst",
  "Lead Ops",
  "Admin",
];

function initialsFromEmailOrName(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "UM";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function TeamPage() {
  const [members, setMembers] = useState<readonly HumanTeamMember[]>(
    HUMAN_TEAM_MEMBERS_INITIAL,
  );
  const [activeTab, setActiveTab] = useState<TeamMemberTab>("all");
  const [roleFilter, setRoleFilter] = useState<HumanRoleFilter>("All Roles");
  const [searchQuery, setSearchQuery] = useState("");

  const [aiFilter, setAiFilter] = useState<AiWorkerFilter>("all");
  const [aiSearchQuery, setAiSearchQuery] = useState("");

  const [selectedEntity, setSelectedEntity] =
    useState<SelectedTeamEntity | null>(null);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRoleOption>("Analyst");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      total: members.length,
      approvers: members.filter((m) => m.canApprove).length,
      pending: members.filter((m) => m.status === "invited").length,
      aiUnitsTotal: AI_WORKFORCE_UNITS.length,
      aiUnitsActive: AI_WORKFORCE_UNITS.filter((unit) => unit.isActiveNow).length,
    }),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return members.filter((member) => {
      if (activeTab === "approvers" && !member.canApprove) return false;
      if (activeTab === "pending" && member.status !== "invited") return false;
      if (roleFilter !== "All Roles" && member.role !== roleFilter) return false;
      if (!query) return true;
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.assignedTasks.some((t) => t.id.toLowerCase().includes(query))
      );
    });
  }, [members, activeTab, roleFilter, searchQuery]);

  const filteredAiUnits = useMemo(() => {
    const query = aiSearchQuery.trim().toLowerCase();
    return AI_WORKFORCE_UNITS.filter((unit) => {
      if (aiFilter === "active" && !unit.isActiveNow) return false;
      if (aiFilter === "tools" && unit.allowedTools.length === 0) return false;
      if (aiFilter === "analysis" && unit.allowedTools.length > 0) return false;
      if (!query) return true;
      return (
        unit.name.toLowerCase().includes(query) ||
        unit.specialization.toLowerCase().includes(query) ||
        unit.stageCode.toLowerCase().includes(query) ||
        unit.allowedTools.some((tool) => tool.toLowerCase().includes(query))
      );
    });
  }, [aiFilter, aiSearchQuery]);

  const hasHumanFilters =
    activeTab !== "all" ||
    roleFilter !== "All Roles" ||
    searchQuery.trim().length > 0;

  const resetHumanFilters = () => {
    setActiveTab("all");
    setRoleFilter("All Roles");
    setSearchQuery("");
  };

  const handleResendInvite = (member: HumanTeamMember) => {
    setStatusNotice(
      `Local UI prototype only: queued reminder note for ${member.email}. Organization invite delivery requires backend integration.`,
    );
  };

  const handleInviteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = inviteEmail.trim().toLowerCase();
    const trimmedName = inviteName.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setInviteError("Enter a valid organization email address.");
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === trimmedEmail)) {
      setInviteError("A member or pending invite with this email already exists.");
      return;
    }

    const displayName =
      trimmedName ||
      trimmedEmail
        .split("@")[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(" ");

    const newInvite: HumanTeamMember = {
      id: `usr-invite-${Date.now()}`,
      entityKind: "human",
      initials: initialsFromEmailOrName(displayName, trimmedEmail),
      name: displayName,
      email: trimmedEmail,
      role: "Invited",
      rbacTierLabel: `Pending Invite · Target ${inviteRole}`,
      department: "Sales Organization",
      canApprove: false,
      authorityLabel: "Pending",
      status: "invited",
      lastActiveLabel: "Invite queued (Mock)",
      capabilities: [
        "Local prototype invite — permissions activate once accepted",
        `Target workspace role: ${inviteRole}`,
      ],
      assignedTasks: [],
    };

    setMembers((prev) => [...prev, newInvite]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Analyst");
    setInviteError(null);
    setIsInviteOpen(false);
    setActiveTab("all");
    setRoleFilter("All Roles");
    setStatusNotice(
      `Added ${displayName} (${trimmedEmail}) locally in UI prototype state. Endpoint POST /api/v1/team/members is not connected.`,
    );
  };

  const tabItems: readonly {
    id: TeamMemberTab;
    labelPrefix: string;
    labelSuffix?: string;
    count: number;
  }[] = [
    {
      id: "all",
      labelPrefix: "All",
      labelSuffix: "Members",
      count: counts.total,
    },
    { id: "approvers", labelPrefix: "Approvers", count: counts.approvers },
    {
      id: "pending",
      labelPrefix: "Pending",
      labelSuffix: "Invites",
      count: counts.pending,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1160px] min-w-0 flex-col gap-5">
      {/* 1. Page Header Row */}
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[24px]">
              Team
            </h1>
            <StatusBadge
              tone="neutral"
              label="Mock Directory · GET /api/v1/team/members pending"
              showDot={false}
              className="text-[10px]"
            />
          </div>
          <p className="text-[13px] text-text-secondary">
            Manage human organization members, approval authority, and specialized AI
            workforce units.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setIsInviteOpen((prev) => !prev);
            setInviteError(null);
          }}
          className="self-start sm:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Invite Member</span>
        </Button>
      </header>

      {/* Collapsible Prototype Invite Member Composer */}
      {isInviteOpen && (
        <form
          onSubmit={handleInviteSubmit}
          aria-label="Invite organization member prototype form"
          className="space-y-3 rounded-[6px] border border-border-interactive bg-surface-1 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent-cyan">
              Invite Human Organization Member · UI Prototype Only
            </span>
            <button
              type="button"
              onClick={() => {
                setIsInviteOpen(false);
                setInviteError(null);
              }}
              className="font-mono text-[11px] text-text-metadata hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <label
                htmlFor="invite-member-name"
                className="mb-1 block text-xs text-text-secondary"
              >
                Full Name (Optional)
              </label>
              <input
                id="invite-member-name"
                type="text"
                value={inviteName}
                onChange={(event) => setInviteName(event.target.value)}
                placeholder="e.g. Meera Iyer"
                className="h-9 w-full rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor="invite-member-email"
                className="mb-1 block text-xs text-text-secondary"
              >
                Work Email
              </label>
              <input
                id="invite-member-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => {
                  setInviteEmail(event.target.value);
                  if (inviteError) setInviteError(null);
                }}
                placeholder="meera.iyer@relay-ops.io"
                aria-invalid={Boolean(inviteError)}
                className="h-9 w-full rounded-[6px] border border-border-default bg-surface-2 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end sm:col-span-3">
              <span className="mb-1 block text-xs text-text-secondary">
                Target Role
              </span>
              <SelectDropdown<InviteRoleOption>
                id="invite-member-role"
                label="Target role"
                value={inviteRole}
                options={INVITE_ROLE_OPTIONS}
                onChange={setInviteRole}
                className="w-full"
              />
            </div>
          </div>

          {inviteError && (
            <p role="alert" className="text-xs text-accent-danger">
              {inviteError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="font-mono text-[10px] text-text-metadata">
              Adds invite to local session state only; resets on reload.
            </span>
            <Button type="submit" size="sm" variant="primary">
              Queue Prototype Invite
            </Button>
          </div>
        </form>
      )}

      {/* Local Prototype Action Feedback Banner */}
      {statusNotice && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3.5 py-2.5 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone="cyan"
              label="Prototype Action"
              showDot={false}
            />
            <span className="text-text-secondary">{statusNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="font-mono text-[11px] text-text-metadata hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Compact 3-Column Summary Strip (Matches Stitch Team) */}
      <section
        aria-label="Organization workforce summary"
        className="grid grid-cols-1 divide-y divide-border-default rounded-[6px] border border-border-default bg-surface-1 md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        <div className="flex flex-col justify-between px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              Total Members
            </span>
            <UsersIcon className="h-4 w-4 text-text-metadata" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold leading-none text-text-primary tabular-nums">
              {counts.total}
            </span>
            <span className="text-xs text-text-secondary tabular-nums">
              · {counts.pending} pending{" "}
              {counts.pending === 1 ? "invite" : "invites"}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              Approval Authorities
            </span>
            <ShieldCheckIcon className="h-4 w-4 text-accent-amber" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold leading-none text-text-primary tabular-nums">
              {counts.approvers}
            </span>
            <span className="text-xs font-medium text-accent-amber">
              Can authorize checkpoints
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              AI Workforce Units
            </span>
            <CpuIcon className="h-4 w-4 text-accent-emerald" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold leading-none text-text-primary tabular-nums">
              {counts.aiUnitsActive} / {counts.aiUnitsTotal}
            </span>
            <span className="text-xs font-medium text-accent-emerald">
              Active non-human units
            </span>
          </div>
        </div>
      </section>

      {/* 3. Human Members Filter & Search Control Bar */}
      <section aria-label="Human organization directory" className="space-y-3.5">
        <div className="flex flex-col items-stretch justify-between gap-2.5 xl:flex-row xl:items-center">
          {/* Segmented Filter Tabs */}
          <div
            role="group"
            aria-label="Filter team members"
            className="flex w-full shrink-0 flex-nowrap items-center justify-between gap-1 rounded-[6px] border border-border-default bg-surface-1 p-1 sm:w-auto sm:self-start sm:justify-start"
          >
            {tabItems.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[4px] border px-2 font-mono text-[11px] leading-none transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan sm:px-3 ${
                    isSelected
                      ? "border-border-interactive bg-surface-2 text-text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span>
                    {tab.labelPrefix}
                    {tab.labelSuffix && (
                      <span className="hidden sm:inline"> {tab.labelSuffix}</span>
                    )}
                  </span>
                  <span className="text-[10px] text-text-metadata tabular-nums">
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Custom Role SelectDropdown */}
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:w-60 xl:w-64">
              <label htmlFor="team-member-search" className="sr-only">
                Search human members by name, email, role, or task ID
              </label>
              <input
                id="team-member-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, email, or task..."
                className="h-9 w-full rounded-[6px] border border-border-default bg-surface-1 px-3 text-xs text-text-primary placeholder:text-text-metadata focus:border-accent-cyan focus:outline-none"
              />
            </div>

            <SelectDropdown<HumanRoleFilter>
              id="team-role-filter"
              label="Filter by role"
              inlineLabel="Role"
              value={roleFilter}
              options={ROLE_FILTER_OPTIONS}
              onChange={setRoleFilter}
              className="shrink-0"
              menuClassName="right-0 left-auto"
            />
          </div>
        </div>

        {/* 4. High-Density Human Organization Members Directory */}
        <TeamDirectoryTable
          members={filteredMembers}
          selectedMemberId={
            selectedEntity?.kind === "human" ? selectedEntity.member.id : null
          }
          onSelectMember={(member) =>
            setSelectedEntity({ kind: "human", member })
          }
          onResendInvite={handleResendInvite}
          hasActiveFilters={hasHumanFilters}
          onResetFilters={resetHumanFilters}
        />
      </section>

      {/* 5. Compact Workspace Access Tiers Reference Strip */}
      <section
        aria-label="Workspace access tiers"
        className="rounded-[6px] border border-border-default bg-surface-1 p-4"
      >
        <h2 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-wider text-text-metadata">
          Workspace Access Tiers (Human RBAC)
        </h2>
        <div className="grid grid-cols-1 divide-y divide-border-default/60 md:grid-cols-3 md:divide-x md:divide-y-0">
          {WORKSPACE_ACCESS_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex min-w-0 flex-col py-3 first:pt-0 last:pb-0 md:px-4 md:py-0 first:md:pl-0 last:md:pr-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-text-primary">
                  {tier.name}
                </span>
                <span
                  className={`rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] ${
                    tier.id === "admin"
                      ? "border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan"
                      : tier.id === "lead_ops"
                        ? "border-border-interactive bg-surface-2 text-text-secondary"
                        : "border-border-default bg-canvas text-text-metadata"
                  }`}
                >
                  {tier.tierBadge}
                </span>
                <span className="font-mono text-[10px] text-text-metadata">
                  {tier.rbacMapping}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                {tier.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Separate AI Workforce Units Section (Non-Human Agents) */}
      <AiWorkforceSection
        units={filteredAiUnits}
        filter={aiFilter}
        onFilterChange={setAiFilter}
        searchQuery={aiSearchQuery}
        onSearchChange={setAiSearchQuery}
        selectedWorkerId={
          selectedEntity?.kind === "ai_worker" ? selectedEntity.worker.id : null
        }
        onSelectWorker={(worker) =>
          setSelectedEntity({ kind: "ai_worker", worker })
        }
      />

      {/* Slide-Over Detail Drawer */}
      <TeamEntityInspectorDrawer
        selected={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onResendInvite={(memberId) => {
          const found = members.find((m) => m.id === memberId);
          if (found) handleResendInvite(found);
        }}
      />
    </div>
  );
}
