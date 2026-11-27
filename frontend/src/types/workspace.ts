export type WorkflowTemplateId = "sales" | "pricing" | "vendor";

export type WorkspaceRegion =
  | "India"
  | "North America"
  | "EMEA"
  | "APAC"
  | "Global";

export type WorkspaceEntityCount = "3" | "5" | "8" | "10";

export type WorkspaceDepth = "Standard" | "Deep";

export type WorkspaceSources =
  | "Crustdata, Olostep"
  | "Crustdata Only"
  | "Olostep Only";

export interface DelegationBriefConfig {
  templateId: WorkflowTemplateId;
  objective: string;
  region: WorkspaceRegion;
  entities: WorkspaceEntityCount;
  depth: WorkspaceDepth;
  sources: WorkspaceSources;
}

export interface SupervisorPlanStage {
  stepNumber: string;
  stageLabel: string;
  workerName: string;
  detail: string;
  isVerification?: boolean;
}

export interface WorkflowTemplateItem {
  id: WorkflowTemplateId;
  title: string;
  description: string;
  workerCountLabel: string;
  durationLabel: string;
  availableInMvp: boolean;
  defaultObjective?: string;
}

export interface WorkspaceValidationErrors {
  objective?: string;
}

export interface PrototypeSubmissionSummary {
  workflowTitle: string;
  config: DelegationBriefConfig;
  submittedAtLabel: string;
}
