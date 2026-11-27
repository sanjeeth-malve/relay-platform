import type { BadgeTone, TaskStatus } from "../components/StatusBadge";

export interface DashboardKpiMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  tone: BadgeTone;
  pulse?: boolean;
}

export type WorkforceActionLabel = "Inspect" | "Review" | "Report";

export interface WorkforceActivityItem {
  id: string;
  title: string;
  status: TaskStatus;
  stageLabel: string;
  /** Progress percentage between 0 and 100. */
  progress: number;
  actionLabel: WorkforceActionLabel;
  actionPath: string;
  /** Compact relative update time shown on stacked narrow views. */
  updatedAt: string;
}

export interface PendingApprovalItem {
  id: string;
  taskId: string;
  title: string;
  description: string;
  requestedAt: string;
  reviewPath: string;
}

export interface RecentDeliverableItem {
  id: string;
  taskId: string;
  title: string;
  verifiedLabel: string;
  timestamp: string;
  reportPath: string;
}

export interface DashboardOverviewData {
  kpis: DashboardKpiMetric[];
  activeRunsLabel: string;
  activities: WorkforceActivityItem[];
  pendingApprovalsCountLabel: string;
  pendingApprovals: PendingApprovalItem[];
  recentDeliverables: RecentDeliverableItem[];
}
