import { HUMAN_TEAM_MEMBERS_INITIAL } from "./teamMock";
import { WORKSPACE_REGION_OPTIONS } from "./workspacePresets";
import type {
  DefaultReportFormat,
  ProfileMockData,
  ProfileTimezone,
} from "../types/profile";

const PRIMARY_MOCK_MEMBER = HUMAN_TEAM_MEMBERS_INITIAL[0];

export const PROFILE_TIMEZONE_OPTIONS: readonly ProfileTimezone[] = [
  "Asia/Kolkata (IST, UTC+05:30)",
  "Asia/Singapore (SGT, UTC+08:00)",
  "Europe/London (GMT/BST)",
  "America/New_York (EST/EDT)",
  "UTC",
];

export const PROFILE_REPORT_FORMAT_OPTIONS: readonly DefaultReportFormat[] = [
  "Executive Comparison Report",
  "Sales Prospect Research (9-Section)",
];

export const PROFILE_REGION_OPTIONS = WORKSPACE_REGION_OPTIONS;

/**
 * Local UI prototype profile snapshot grounded in Team mock identity (Alex Kumar)
 * while maintaining strict honesty about unauthenticated Supabase Auth state.
 */
export const PROFILE_MOCK_DATA: ProfileMockData = {
  memberId: PRIMARY_MOCK_MEMBER?.id ?? "usr-alex-kumar",
  workEmail: PRIMARY_MOCK_MEMBER?.email ?? "alex.kumar@relay-ops.io",
  organizations: [
    {
      id: "org-ops-command",
      name: "RELAY Operations Command",
      roleTitle: "Organization Admin",
      rbacTierBadge: "TIER 0",
      rbacRoleName: "Organization Admin",
      canApprove: true,
      authorityLabel: "Full Approval Authority",
      capabilities: PRIMARY_MOCK_MEMBER?.capabilities ?? [
        "Approve or reject gated checkpoint actions",
        "Manage organization roles and member invites",
        "Inspect all organization tasks and verified reports",
      ],
    },
    {
      id: "org-sales-mvp-sandbox",
      name: "Sales Prospect Research Sandbox",
      roleTitle: "Sales Manager",
      rbacTierBadge: "TIER 1",
      rbacRoleName: "Sales Manager",
      canApprove: true,
      authorityLabel: "Checkpoint Approval Authority",
      capabilities: [
        "Delegate structured Sales Prospect Research briefs",
        "Approve or reject paused external crawl requests",
        "Inspect and export team verification reports",
      ],
    },
  ],
  initialFields: {
    fullName: PRIMARY_MOCK_MEMBER?.name ?? "Alex Kumar",
    jobTitle: PRIMARY_MOCK_MEMBER?.role === "Admin" ? "Lead Ops" : "Analyst",
    timezone: "Asia/Kolkata (IST, UTC+05:30)",
    activeOrganizationId: "org-ops-command",
    defaultReportFormat: "Executive Comparison Report",
    defaultResearchRegion: "India",
  },
  authStatusRows: [
    {
      id: "supabase-auth",
      title: "Supabase Auth & Enterprise SSO",
      description:
        "JWT issuance and SAML SSO integration are scheduled; currently viewing local UI prototype state.",
      statusLabel: "Auth Not Connected",
      tone: "amber",
    },
    {
      id: "checkpoint-rbac",
      title: "Approval & Tool Execution Governance",
      description:
        "Role-based permissions and Tool Executor boundaries are enforced server-side upon backend connection.",
      statusLabel: "Backend Enforced (Planned)",
      tone: "neutral",
    },
  ],
};
