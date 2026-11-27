import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import type { ExecutionNodeItem } from "../types/execution";

export interface ExecutionOutputTabProps {
  selectedNode: ExecutionNodeItem;
  nodeOutput: unknown;
  taskOutputJson: Record<string, unknown>;
}

type CopyState = "idle" | "copied" | "failed";

export function ExecutionOutputTab({
  selectedNode,
  nodeOutput,
  taskOutputJson,
}: ExecutionOutputTabProps) {
  const [payloadScope, setPayloadScope] = useState<"worker" | "task">("worker");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const activePayload =
    payloadScope === "worker" ? nodeOutput : taskOutputJson;

  const formattedJson = useMemo(() => {
    if (activePayload === undefined) return null;
    return JSON.stringify(activePayload, null, 2);
  }, [activePayload]);

  useEffect(() => {
    setCopyState("idle");
  }, [selectedNode.id, payloadScope]);

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopyJson = async () => {
    if (!formattedJson) return;
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Scope & Copy Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default bg-canvas/60 px-4 py-2">
        <div
          role="group"
          aria-label="Output JSON scope"
          className="inline-flex rounded-[4px] border border-border-default bg-surface-1 p-0.5 font-mono text-[10px]"
        >
          <button
            type="button"
            onClick={() => setPayloadScope("worker")}
            className={`rounded-[3px] px-2 py-0.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              payloadScope === "worker"
                ? "bg-surface-2 text-accent-cyan"
                : "text-text-metadata hover:text-text-primary"
            }`}
          >
            Worker Output
          </button>
          <button
            type="button"
            onClick={() => setPayloadScope("task")}
            className={`rounded-[3px] px-2 py-0.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              payloadScope === "task"
                ? "bg-surface-2 text-accent-cyan"
                : "text-text-metadata hover:text-text-primary"
            }`}
          >
            Task Payload
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span aria-live="polite" className="sr-only">
            {copyState === "copied"
              ? "Output JSON copied to clipboard"
              : copyState === "failed"
                ? "Clipboard copy failed"
                : ""}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={!formattedJson}
            onClick={() => void handleCopyJson()}
            className="h-7 px-2.5 font-mono text-[11px]"
          >
            {copyState === "copied"
              ? "Copied ✓"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy JSON"}
          </Button>
        </div>
      </div>

      <div className="relay-subtle-scroll flex-1 overflow-auto bg-canvas p-4">
        {!formattedJson ? (
          <div className="rounded-[6px] border border-border-default bg-surface-1 p-4 text-xs leading-relaxed text-text-secondary">
            No structured JSON output has been emitted yet for{" "}
            <span className="font-medium text-text-primary">
              {selectedNode.name}
            </span>{" "}
            ({selectedNode.status}). Switch to{" "}
            <span className="font-mono text-accent-cyan">Task Payload</span> to
            inspect top-level task telemetry.
          </div>
        ) : (
          <pre className="rounded-[6px] border border-border-default bg-surface-1 p-3.5 font-mono text-[11px] leading-relaxed text-text-primary overflow-x-auto">
            <code>{formattedJson}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
