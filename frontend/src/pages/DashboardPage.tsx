import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { DashboardKpiStrip } from "../components/DashboardKpiStrip";
import { PendingApprovalsPanel } from "../components/PendingApprovalsPanel";
import { RecentDeliverablesPanel } from "../components/RecentDeliverablesPanel";
import { WorkforceActivityPanel } from "../components/WorkforceActivityPanel";
import { DASHBOARD_OVERVIEW_MOCK } from "../data/dashboardMock";

export function DashboardPage() {
  const navigate = useNavigate();
  const data = DASHBOARD_OVERVIEW_MOCK;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-5 sm:gap-6">
      {/* 1. Page Header Row */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[22px]">
            Overview
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Live AI workforce operations and verification queue.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/workspace")}
          className="h-9 shrink-0 px-3.5 text-xs font-semibold"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          <span>Delegate Task</span>
        </Button>
      </header>

      {/* 2. Top KPI Metric Strip */}
      <DashboardKpiStrip metrics={data.kpis} />

      {/* 3. Main 2-Column Operational Grid */}
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12 xl:items-start">
        {/* Left Column — Live Workforce Activity */}
        <div className="min-w-0 xl:col-span-8">
          <WorkforceActivityPanel
            activeRunsLabel={data.activeRunsLabel}
            items={data.activities}
          />
        </div>

        {/* Right Column — Pending Approvals & Recent Deliverables */}
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <PendingApprovalsPanel
            countLabel={data.pendingApprovalsCountLabel}
            items={data.pendingApprovals}
          />
          <RecentDeliverablesPanel items={data.recentDeliverables} />
        </div>
      </div>
    </div>
  );
}
