export type ApprovalDecisionStatus = "pending" | "approved" | "rejected";

export type ApprovalFilterTab = "all" | ApprovalDecisionStatus;

export type ApprovalRiskLevel = "low" | "medium" | "high";

export type ApprovalSortOrder = "Latest" | "Risk (High-Low)";

export interface ApprovalRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  taskPath?: string;
  categoryLabel: string;
  requestedAction: string;
  requestingWorker: string;
  workerBadge: string;
  reason: string;
  supportingContext: readonly string[];
  riskLevel: ApprovalRiskLevel;
  riskSummary: string;
  authorizedTool: string;
  toolVersion: string;
  proposedScope: string;
  scopeDetail: string;
  estimatedImpact: string;
  impactDetail: string;
  policyId: string;
  confidenceLabel: string;
  submittedAtLabel: string;
  submittedUtcLabel: string;
  payloadPreview: Record<string, unknown>;
  status: ApprovalDecisionStatus;
  decisionNote?: string;
  resolvedAtLabel?: string;
}

export interface ApprovalActionFeedback {
  id: string;
  decision: Exclude<ApprovalDecisionStatus, "pending">;
  message: string;
}
