import type { TaskStatus } from "../components/StatusBadge";

/**
 * Node-level execution states required for the React Flow task DAG.
 */
export type ExecutionNodeStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "waiting_approval";

export type ExecutionNodeRole = "supervisor" | "worker";

export type ExecutionWorkerStage =
  | "supervisor"
  | "discovery"
  | "enrichment"
  | "research"
  | "analysis"
  | "verification";

export type ExecutionInspectorTab = "logs" | "evidence" | "output";

export type ExecutionLogLevel = "info" | "warning" | "error";

export type EvidenceVerificationStatus = "verified" | "unverified";

export interface ExecutionNodeItem {
  id: ExecutionWorkerStage;
  role: ExecutionNodeRole;
  stepBadge: string;
  name: string;
  workerSubtitle: string;
  status: ExecutionNodeStatus;
  activitySummary: string;
  progress: number;
  elapsedLabel: string;
  allowedTools: readonly string[];
  position: {
    x: number;
    y: number;
  };
}

export interface ExecutionEdgeItem {
  id: string;
  source: ExecutionWorkerStage;
  target: ExecutionWorkerStage;
  active?: boolean;
}

export interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  workerId: ExecutionWorkerStage;
  workerTag: string;
  level: ExecutionLogLevel;
  message: string;
}

export interface ExecutionEvidenceItem {
  id: string;
  workerId: ExecutionWorkerStage;
  workerName: string;
  sourceName: string;
  url: string;
  summary: string;
  verificationStatus: EvidenceVerificationStatus;
  collectedAt: string;
}

export interface ExecutionApprovalPrompt {
  title: string;
  summary: string;
  reviewPath: string;
}

export interface TaskExecutionRecord {
  id: string;
  title: string;
  objective: string;
  status: TaskStatus;
  stageSummary: string;
  createdAtLabel: string;
  elapsedLabel: string;
  defaultSelectedNodeId: ExecutionWorkerStage;
  approvalPrompt?: ExecutionApprovalPrompt;
  reportPath?: string;
  nodes: readonly ExecutionNodeItem[];
  edges: readonly ExecutionEdgeItem[];
  logs: readonly ExecutionLogEntry[];
  evidence: readonly ExecutionEvidenceItem[];
  outputByNode: Partial<Record<ExecutionWorkerStage, unknown>>;
  taskOutputJson: Record<string, unknown>;
}
