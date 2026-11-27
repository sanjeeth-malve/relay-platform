import type { TaskStatus } from "../components/StatusBadge";

export type TaskStatusFilterId =
  | "all"
  | "active"
  | "waiting_approval"
  | "completed"
  | "failed";

export type TaskSortOrder = "Recent" | "Progress (High-Low)" | "ID (Asc)";

export interface TaskListItem {
  id: string;
  title: string;
  workflowName: string;
  status: TaskStatus;
  stageSummary: string;
  activeWorkerLabel: string;
  progress: number;
  workerCount: number;
  timestampLabel: string;
  taskPath: string;
  reportPath?: string;
  approvalPath?: string;
}
