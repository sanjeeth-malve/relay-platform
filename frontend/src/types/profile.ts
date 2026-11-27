import type { WorkspaceRegion } from "./workspace";

export type ProfileTimezone =
  | "Asia/Kolkata (IST, UTC+05:30)"
  | "Asia/Singapore (SGT, UTC+08:00)"
  | "Europe/London (GMT/BST)"
  | "America/New_York (EST/EDT)"
  | "UTC";

export type DefaultReportFormat =
  | "Executive Comparison Report"
  | "Sales Prospect Research (9-Section)";

export interface ProfileOrganizationMembership {
  id: string;
  name: string;
  roleTitle: string;
  rbacTierBadge: string;
  rbacRoleName: string;
  canApprove: boolean;
  authorityLabel: string;
  capabilities: readonly string[];
}

export interface EditableProfileFields {
  fullName: string;
  jobTitle: string;
  timezone: ProfileTimezone;
  activeOrganizationId: string;
  defaultReportFormat: DefaultReportFormat;
  defaultResearchRegion: WorkspaceRegion;
}

export interface ProfileValidationErrors {
  fullName?: string;
  jobTitle?: string;
}

export interface ProfileAuthStatusRow {
  id: string;
  title: string;
  description: string;
  statusLabel: string;
  tone: "amber" | "neutral" | "cyan";
}

export interface ProfileMockData {
  memberId: string;
  workEmail: string;
  organizations: readonly ProfileOrganizationMembership[];
  initialFields: EditableProfileFields;
  authStatusRows: readonly ProfileAuthStatusRow[];
}
