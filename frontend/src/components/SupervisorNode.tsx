import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ExecutionNodeCard } from "./ExecutionNodeCard";
import type { ExecutionNodeItem } from "../types/execution";

export type SupervisorFlowNodeData = {
  node: ExecutionNodeItem;
};

export type SupervisorFlowNode = Node<SupervisorFlowNodeData, "supervisor">;

export function SupervisorNode({
  data,
  selected,
}: NodeProps<SupervisorFlowNode>) {
  return (
    <div className="relative">
      <ExecutionNodeCard node={data.node} selected={Boolean(selected)} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="!h-2 !w-2 !border !border-border-interactive !bg-surface-2"
      />
    </div>
  );
}
