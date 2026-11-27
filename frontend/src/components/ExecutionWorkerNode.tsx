import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ExecutionNodeCard } from "./ExecutionNodeCard";
import type { ExecutionNodeItem } from "../types/execution";

export type WorkerFlowNodeData = {
  node: ExecutionNodeItem;
  targetPosition?: Position;
  sourcePosition?: Position;
  showSourceHandle?: boolean;
};

export type WorkerFlowNode = Node<WorkerFlowNodeData, "worker">;

export function ExecutionWorkerNode({
  data,
  selected,
}: NodeProps<WorkerFlowNode>) {
  const targetPos = data.targetPosition ?? Position.Top;
  const sourcePos = data.sourcePosition ?? Position.Bottom;
  const showSource = data.showSourceHandle ?? true;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={targetPos}
        isConnectable={false}
        className="!h-2 !w-2 !border !border-border-interactive !bg-surface-2"
      />
      <ExecutionNodeCard node={data.node} selected={Boolean(selected)} />
      {showSource && (
        <Handle
          type="source"
          position={sourcePos}
          isConnectable={false}
          className="!h-2 !w-2 !border !border-border-interactive !bg-surface-2"
        />
      )}
    </div>
  );
}
