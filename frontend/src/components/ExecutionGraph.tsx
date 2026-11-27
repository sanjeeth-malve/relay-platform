import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import {
  ExecutionWorkerNode,
  type WorkerFlowNodeData,
} from "./ExecutionWorkerNode";
import {
  SupervisorNode,
  type SupervisorFlowNodeData,
} from "./SupervisorNode";
import type {
  ExecutionEdgeItem,
  ExecutionNodeItem,
  ExecutionNodeStatus,
  ExecutionWorkerStage,
} from "../types/execution";
import { NODE_STATUS_VISUALS } from "../utils/executionStatus";

type ExecutionFlowNode =
  | Node<SupervisorFlowNodeData, "supervisor">
  | Node<WorkerFlowNodeData, "worker">;

const nodeTypes = {
  supervisor: SupervisorNode,
  worker: ExecutionWorkerNode,
};

const WORKER_HANDLE_LAYOUT: Record<
  Exclude<ExecutionWorkerStage, "supervisor">,
  {
    targetPosition: Position;
    sourcePosition: Position;
    showSourceHandle: boolean;
  }
> = {
  discovery: {
    targetPosition: Position.Left,
    sourcePosition: Position.Bottom,
    showSourceHandle: true,
  },
  enrichment: {
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
    showSourceHandle: true,
  },
  research: {
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
    showSourceHandle: true,
  },
  analysis: {
    targetPosition: Position.Top,
    sourcePosition: Position.Right,
    showSourceHandle: true,
  },
  verification: {
    targetPosition: Position.Left,
    sourcePosition: Position.Bottom,
    showSourceHandle: false,
  },
};

const LEGEND_STATUS_ORDER: readonly ExecutionNodeStatus[] = [
  "completed",
  "running",
  "waiting_approval",
  "failed",
  "queued",
];

export interface ExecutionGraphProps {
  taskId: string;
  nodes: readonly ExecutionNodeItem[];
  edges: readonly ExecutionEdgeItem[];
  selectedNodeId: ExecutionWorkerStage;
  onSelectNode: (nodeId: ExecutionWorkerStage) => void;
}

function ExecutionGraphCanvas({
  taskId,
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: ExecutionGraphProps) {
  const prefersReducedMotion = useReducedMotion();
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  const flowNodes = useMemo<ExecutionFlowNode[]>(
    () =>
      nodes.map((item) => {
        if (item.role === "supervisor" || item.id === "supervisor") {
          return {
            id: item.id,
            type: "supervisor",
            position: item.position,
            selected: item.id === selectedNodeId,
            draggable: false,
            connectable: false,
            data: { node: item },
          };
        }

        const handleConfig = WORKER_HANDLE_LAYOUT[item.id];
        return {
          id: item.id,
          type: "worker",
          position: item.position,
          selected: item.id === selectedNodeId,
          draggable: false,
          connectable: false,
          data: {
            node: item,
            ...handleConfig,
          },
        };
      }),
    [nodes, selectedNodeId],
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((edge) => {
        const isActive = Boolean(edge.active);
        const stroke = isActive ? "#06B6D4" : "#2D3B4E";
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          animated: isActive && !prefersReducedMotion,
          selectable: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: stroke,
            width: 14,
            height: 14,
          },
          style: {
            stroke,
            strokeWidth: isActive ? 1.75 : 1.25,
          },
        };
      }),
    [edges, prefersReducedMotion],
  );

  useEffect(() => {
    const runFitView = () => {
      void fitView({ padding: 0.14, duration: 0 });
    };

    const rafId = window.requestAnimationFrame(runFitView);
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return () => window.cancelAnimationFrame(rafId);
    }

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(runFitView);
    });
    observer.observe(el);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [taskId, fitView]);

  const statusCounts = useMemo(() => {
    const counts: Record<ExecutionNodeStatus, number> = {
      queued: 0,
      running: 0,
      completed: 0,
      failed: 0,
      waiting_approval: 0,
    };
    for (const n of nodes) {
      counts[n.status] += 1;
    }
    return counts;
  }, [nodes]);

  return (
    <div className="flex h-full min-w-0 flex-col bg-canvas">
      {/* Slim Non-Overlapping Graph Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border-default bg-surface-1 px-4 py-2 font-mono text-[10px] uppercase tracking-wider">
        <span className="font-semibold text-text-secondary">
          Execution DAG · 6 Nodes
        </span>

        {/* Mobile (< 640px) non-overlapping zoom/fit toolbar */}
        <div
          role="group"
          aria-label="Mobile graph controls"
          className="inline-flex items-center gap-1 sm:hidden"
        >
          <button
            type="button"
            onClick={() => void zoomIn({ duration: 150 })}
            aria-label="Zoom in graph"
            className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] border border-border-default bg-surface-2 text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => void zoomOut({ duration: 150 })}
            aria-label="Zoom out graph"
            className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] border border-border-default bg-surface-2 text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M3 8h10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => void fitView({ padding: 0.14, duration: 150 })}
            aria-label="Fit graph to view"
            className="inline-flex h-6 items-center justify-center rounded-[4px] border border-border-default bg-surface-2 px-1.5 text-[10px] font-medium text-text-secondary transition-colors hover:border-border-interactive hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            Fit
          </button>
        </div>

        <span className="hidden text-text-metadata sm:inline">
          Click node to inspect
        </span>
      </div>

      {/* React Flow Viewport */}
      <div
        ref={containerRef}
        className="relay-react-flow relative min-h-[340px] flex-1 bg-canvas"
      >
        <ReactFlow
          className="dark"
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.14 }}
          minZoom={0.45}
          maxZoom={1.4}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable
          elementsSelectable
          panOnScroll
          zoomOnScroll
          onNodeClick={(_, node) => {
            onSelectNode(node.id as ExecutionWorkerStage);
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#1E293B"
          />
          <Controls
            position="bottom-left"
            showInteractive={false}
            className="!hidden sm:!flex"
          />
        </ReactFlow>
      </div>

      {/* Non-Overlapping DAG Status Legend Footer */}
      <div
        aria-label="Execution graph status legend"
        className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-default bg-surface-1 px-4 py-2 font-mono text-[10px]"
      >
        {LEGEND_STATUS_ORDER.map((status) => {
          const visual = NODE_STATUS_VISUALS[status];
          const count = statusCounts[status];
          return (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap ${
                count > 0 ? "text-text-secondary" : "text-text-metadata"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${visual.dotClass}`}
              />
              <span>
                {visual.label}
                {count > 0 ? ` (${count})` : ""}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function ExecutionGraph(props: ExecutionGraphProps) {
  return (
    <ReactFlowProvider>
      <ExecutionGraphCanvas {...props} />
    </ReactFlowProvider>
  );
}
