import type { TaskStatus } from "../components/StatusBadge";
import type {
  ExecutionNodeStatus,
  ExecutionWorkerStage,
} from "./execution";

/**
 * Stitch + RELAY RBAC display roles for human organization members.
 */
export type HumanMemberRole = "Admin" | "Lead Ops" | "Analyst" | "Invited";

export type HumanMemberStatus = "active" | "invited";

export type TeamMemberTab = "all" | "approvers" | "pending";

export type HumanRoleFilter = "All Roles" | HumanMemberRole;

export interface TeamLinkedTask {
  id: string;
  title: string;
  status: TaskStatus;
  stageSummary: string;
  taskPath: string;
  nodeStatus?: ExecutionNodeStatus;
  nodeProgress?: number;
}

/**
 * Represents a real human organization member or pending human invite.
 * AI agents must never use this shape.
 */
export interface HumanTeamMember {
  id: string;
  entityKind: "human";
  initials: string;
  name: string;
  email: string;
  role: HumanMemberRole;
  rbacTierLabel: string;
  department: string;
  canApprove: boolean;
  authorityLabel: "Full Authority" | "Delegate Only" | "Pending";
  status: HumanMemberStatus;
  isOnline?: boolean;
  lastActiveLabel: string;
  capabilities: readonly string[];
  assignedTasks: readonly TeamLinkedTask[];
}

export interface WorkspaceAccessTier {
  id: "admin" | "lead_ops" | "analyst";
  name: string;
  tierBadge: string;
  rbacMapping: string;
  description: string;
}

export type AiWorkerFilter = "all" | "active" | "tools" | "analysis";

/**
 * Represents a non-human specialized AI worker unit / template in RELAY's
 * LangGraph execution architecture (distinct from human organization users).
 */
export interface AiWorkerUnit {
  id: string;
  entityKind: "ai_worker";
  stageId: ExecutionWorkerStage;
  stageCode: string;
  name: string;
  specialization: string;
  architectureRole: string;
  allowedTools: readonly string[];
  guardrailNote: string;
  statusLabel: string;
  isActiveNow: boolean;
  hasWaitingApproval: boolean;
  completedRunsCount: number;
  linkedTasks: readonly TeamLinkedTask[];
}

export type SelectedTeamEntity =
  | { kind: "human"; member: HumanTeamMember }
  | { kind: "ai_worker"; worker: AiWorkerUnit };
