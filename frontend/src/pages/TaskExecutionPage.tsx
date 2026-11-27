import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import { ExecutionGraph } from "../components/ExecutionGraph";
import { ExecutionInspector } from "../components/ExecutionInspector";
import { StatusBadge } from "../components/StatusBadge";
import {
  TASK_EXECUTION_MOCKS,
  TASK_MOCK_SWITCHER_LINKS,
} from "../data/taskExecutionMock";
import type { ExecutionWorkerStage } from "../types/execution";

const CANCELLABLE_STATUSES = new Set([
  "queued",
  "planning",
  "running",
  "waiting_input",
  "waiting_approval",
  "verifying",
]);

export function TaskExecutionPage() {
  const { taskId = "RLY-104" } = useParams<{ taskId?: string }>();
  const navigate = useNavigate();

  const task = TASK_EXECUTION_MOCKS[taskId];

  const [selectedNodeId, setSelectedNodeId] = useState<ExecutionWorkerStage>(
    task?.defaultSelectedNodeId ?? "research",
  );
  const [isLocalCancelled, setIsLocalCancelled] = useState(false);

  useEffect(() => {
    if (task) {
      setSelectedNodeId(task.defaultSelectedNodeId);
    }
    setIsLocalCancelled(false);
  }, [task]);

  const selectedNode = useMemo(() => {
    if (!task) return undefined;
    return (
      task.nodes.find((node) => node.id === selectedNodeId) ?? task.nodes[0]
    );
  }, [task, selectedNodeId]);

  if (!task || !selectedNode) {
    return (
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 rounded-[4px] font-mono text-xs text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
          >
            <span aria-hidden="true">←</span>
            <span>Back to My Tasks</span>
          </Link>
        </div>

        <section
          aria-label="Task Not Found"
          className="rounded-[6px] border border-border-default bg-surface-1 p-6"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge tone="danger" label="Not Found in Mock Registry" />
            <span className="font-mono text-xs text-text-metadata">
              ID: {taskId}
            </span>
          </div>
          <h1 className="mt-3 text-lg font-semibold text-text-primary">
            Task execution record unavailable locally
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Task <span className="font-mono text-text-primary">{taskId}</span>{" "}
            is not present in the local mock snapshot registry, and{" "}
            <span className="font-mono text-accent-cyan">
              GET /api/v1/tasks/{taskId}
            </span>{" "}
            is not yet connected. Open one of the seeded mock tasks below to
            inspect the execution graph.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              onClick={() => navigate("/tasks/RLY-104")}
            >
              Inspect RLY-104 Demo
            </Button>
            <Button variant="secondary" onClick={() => navigate("/tasks")}>
              Back to My Tasks
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const effectiveStatus = isLocalCancelled ? "cancelled" : task.status;
  const canCancel = CANCELLABLE_STATUSES.has(effectiveStatus);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-3.5">
      {/* Task Execution Header Bar */}
      <header className="rounded-[6px] border border-border-default bg-surface-1 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Identity & Overall Task Status */}
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 rounded-[4px] border border-border-default bg-surface-2 px-2 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
            >
              <span aria-hidden="true">←</span>
              <span>My Tasks</span>
            </Link>

            <span className="rounded-[4px] border border-border-default bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-accent-cyan whitespace-nowrap">
              {task.id}
            </span>

            <h1 className="min-w-0 text-[16px] font-semibold leading-snug text-text-primary sm:text-[18px]">
              {task.title}
            </h1>

            <StatusBadge
              status={effectiveStatus}
              label={`${effectiveStatus.replace("_", " ")} · ${task.stageSummary}`}
            />
          </div>

          {/* Right Mock Telemetry Timings & Honest Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[6px] border border-border-default bg-canvas px-2.5 py-1 font-mono text-[11px] text-text-secondary tabular-nums whitespace-nowrap">
              {task.createdAtLabel}
            </span>
            <span className="rounded-[6px] border border-border-default bg-canvas px-2.5 py-1 font-mono text-[11px] text-text-primary tabular-nums whitespace-nowrap">
              Elapsed (Mock): {task.elapsedLabel}
            </span>

            {effectiveStatus === "waiting_approval" && task.approvalPrompt && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(task.approvalPrompt!.reviewPath)}
                className="h-8 bg-accent-amber text-canvas border-accent-amber hover:brightness-110 font-semibold"
              >
                Review Approval
              </Button>
            )}

            {effectiveStatus === "completed" && task.reportPath && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(task.reportPath!)}
                className="h-8"
              >
                View Report
              </Button>
            )}

            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsLocalCancelled(true)}
                className="h-8"
              >
                Cancel Task
              </Button>
            )}
          </div>
        </div>

        {/* Delegated Objective + Static Seed Switcher Strip */}
        <div className="mt-2.5 flex flex-col gap-2.5 border-t border-border-default pt-2.5 text-xs xl:flex-row xl:items-center xl:justify-between">
          <p className="min-w-0 leading-relaxed text-text-secondary xl:flex-1">
            {task.objective}
          </p>

          <nav
            aria-label="Mock execution snapshots"
            className="flex shrink-0 flex-wrap items-center gap-1.5 font-mono text-[10px]"
          >
            <span className="uppercase tracking-wider text-text-metadata">
              Mock Snapshots:
            </span>
            {TASK_MOCK_SWITCHER_LINKS.map((item) => {
              const isCurrent = item.id === task.id;
              return (
                <Link
                  key={item.id}
                  to={`/tasks/${item.id}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`rounded-[4px] border px-2 py-0.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
                    isCurrent
                      ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                      : "border-border-default bg-surface-2 text-text-secondary hover:border-border-interactive hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Approval Intervention Banner (when task is paused awaiting approval) */}
        {effectiveStatus === "waiting_approval" && task.approvalPrompt && (
          <div
            role="region"
            aria-label="Approval required notice"
            className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-accent-amber/40 bg-accent-amber/10 px-3 py-2 text-xs"
          >
            <div className="min-w-0">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-amber">
                {task.approvalPrompt.title}:
              </span>{" "}
              <span className="text-text-primary">
                {task.approvalPrompt.summary}
              </span>
            </div>
            <Link
              to={task.approvalPrompt.reviewPath}
              className="font-mono text-[11px] font-medium text-accent-amber underline-offset-2 hover:underline whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              Open Approvals Queue →
            </Link>
          </div>
        )}

        {/* Local Cancel Prototype Notice */}
        {isLocalCancelled && (
          <div
            role="status"
            className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3 py-2 text-xs"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="amber" label="Local Prototype Action" />
              <span className="text-text-secondary">
                Marked cancelled in local UI preview only.{" "}
                <span className="font-mono text-accent-cyan">
                  POST /api/v1/tasks/{task.id}/cancel
                </span>{" "}
                is not connected.
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLocalCancelled(false)}
              className="h-7 px-2 font-mono text-[11px]"
            >
              Restore Snapshot
            </Button>
          </div>
        )}
      </header>

      {/* Main 65 / 35 Responsive Execution Split Pane */}
      <div className="flex min-w-0 flex-col overflow-hidden rounded-[6px] border border-border-default bg-surface-1 xl:h-[clamp(560px,calc(100vh-235px),740px)] xl:flex-row">
        {/* Left Panel (65% on xl+): React Flow Execution DAG */}
        <section
          aria-label="Task execution DAG"
          className="h-[460px] w-full min-w-0 border-b border-border-default sm:h-[520px] xl:h-full xl:w-[65%] xl:border-r xl:border-b-0"
        >
          <ExecutionGraph
            taskId={task.id}
            nodes={task.nodes}
            edges={task.edges}
            selectedNodeId={selectedNode.id}
            onSelectNode={setSelectedNodeId}
          />
        </section>

        {/* Right Panel (35% on xl+): Telemetry, Evidence & Output Inspector */}
        <div className="h-[520px] w-full min-w-0 xl:h-full xl:w-[35%]">
          <ExecutionInspector
            key={task.id}
            selectedNode={selectedNode}
            logs={task.logs}
            evidence={task.evidence}
            nodeOutput={task.outputByNode[selectedNode.id]}
            taskOutputJson={task.taskOutputJson}
          />
        </div>
      </div>
    </div>
  );
}
