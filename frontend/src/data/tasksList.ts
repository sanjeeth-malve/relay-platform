import { REPORT_DETAILS_MOCK } from "./reportsMock";
import { TASK_EXECUTION_MOCKS } from "./taskExecutionMock";
import type { TaskExecutionRecord } from "../types/execution";
import type { TaskListItem } from "../types/tasks";

const WORKFLOW_NAMES_BY_TASK: Record<string, string> = {
  "RLY-104": "Sales Prospect Research",
  "RLY-103": "Pricing Matrix (Demo)",
  "RLY-102": "Sales Prospect Research",
  "RLY-101": "Due Diligence (Demo)",
  "RLY-099": "Sales Prospect Research",
  "RLY-098": "Compliance Audit (Demo)",
};

function deriveTaskListItem(record: TaskExecutionRecord): TaskListItem {
  const supervisor = record.nodes.find((node) => node.role === "supervisor");
  const focusWorker =
    record.nodes.find(
      (node) =>
        node.role === "worker" &&
        (node.status === "running" ||
          node.status === "waiting_approval" ||
          node.status === "failed"),
    ) ??
    [...record.nodes]
      .reverse()
      .find((node) => node.role === "worker" && node.status === "completed");

  const linkedReportId = REPORT_DETAILS_MOCK[record.id]?.id;

  return {
    id: record.id,
    title: record.title,
    workflowName: WORKFLOW_NAMES_BY_TASK[record.id] ?? "Sales Prospect Research",
    status: record.status,
    stageSummary: record.stageSummary,
    activeWorkerLabel: focusWorker ? focusWorker.name : "Supervisor",
    progress: supervisor?.progress ?? 0,
    workerCount: record.nodes.filter((node) => node.role === "worker").length,
    timestampLabel: record.createdAtLabel,
    taskPath: `/tasks/${record.id}`,
    reportPath:
      record.reportPath ??
      (linkedReportId ? `/reports/${linkedReportId}` : undefined),
    approvalPath: record.approvalPrompt?.reviewPath,
  };
}

/**
 * Reuses TASK_EXECUTION_MOCKS as single source of truth for `/tasks`.
 */
export const MY_TASKS_LIST: readonly TaskListItem[] = [
  "RLY-104",
  "RLY-103",
  "RLY-102",
  "RLY-101",
  "RLY-099",
  "RLY-098",
]
  .map((id) => TASK_EXECUTION_MOCKS[id])
  .filter((record): record is TaskExecutionRecord => Boolean(record))
  .map(deriveTaskListItem);
