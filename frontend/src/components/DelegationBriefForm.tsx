import type { FormEvent } from "react";
import { Button } from "./Button";
import { SelectDropdown } from "./SelectDropdown";
import { StatusBadge } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";
import {
  WORKSPACE_DEPTH_OPTIONS,
  WORKSPACE_ENTITY_OPTIONS,
  WORKSPACE_REGION_OPTIONS,
  WORKSPACE_SOURCES_OPTIONS,
} from "../data/workspacePresets";
import type {
  DelegationBriefConfig,
  PrototypeSubmissionSummary,
  WorkspaceDepth,
  WorkspaceEntityCount,
  WorkspaceRegion,
  WorkspaceSources,
  WorkspaceValidationErrors,
} from "../types/workspace";

export interface DelegationBriefFormProps {
  workflowTitle: string;
  config: DelegationBriefConfig;
  errors: WorkspaceValidationErrors;
  prototypeSubmission: PrototypeSubmissionSummary | null;
  onChange: <K extends keyof DelegationBriefConfig>(
    field: K,
    value: DelegationBriefConfig[K],
  ) => void;
  onClearObjective: () => void;
  onDismissPrototypeNotice: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function DelegationBriefForm({
  workflowTitle,
  config,
  errors,
  prototypeSubmission,
  onChange,
  onClearObjective,
  onDismissPrototypeNotice,
  onSubmit,
}: DelegationBriefFormProps) {
  return (
    <SurfaceCard bodyClassName="p-0" className="overflow-visible">
      <form onSubmit={onSubmit} noValidate>
        {/* Top Monospace Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-[5px] border-b border-border-default bg-canvas px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-text-metadata">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 shrink-0 bg-accent-cyan"
            />
            <span>New Delegation Brief</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Workflow:</span>
            <span className="font-medium text-text-primary">{workflowTitle}</span>
          </div>
        </div>

        {/* Main Brief Objective Input */}
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label
              htmlFor="brief-objective"
              className="font-mono text-[11px] uppercase tracking-wider text-text-metadata"
            >
              Business Objective
            </label>
            {config.objective.length > 0 && (
              <button
                type="button"
                onClick={onClearObjective}
                className="rounded-[4px] px-1.5 py-0.5 font-mono text-[11px] text-text-metadata transition-colors hover:bg-surface-2 hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-accent-cyan"
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            id="brief-objective"
            name="objective"
            rows={4}
            value={config.objective}
            onChange={(e) => onChange("objective", e.target.value)}
            placeholder="Specify exact target accounts, geography, criteria, output format, verification rigor..."
            aria-invalid={Boolean(errors.objective)}
            aria-describedby={
              errors.objective ? "brief-objective-error" : "brief-objective-help"
            }
            className={`w-full resize-y rounded-[6px] border bg-surface-2/40 px-3.5 py-2.5 text-[14px] leading-relaxed text-text-primary placeholder:text-text-metadata transition-colors focus:outline-none sm:text-[15px] ${
              errors.objective
                ? "border-accent-danger focus:border-accent-danger"
                : "border-border-default focus:border-accent-cyan"
            }`}
          />

          <p id="brief-objective-help" className="sr-only">
            Describe the target companies, geographic scope, and report goals for
            the Supervisor.
          </p>

          {errors.objective && (
            <p
              id="brief-objective-error"
              role="alert"
              className="mt-2 text-xs text-accent-danger"
            >
              {errors.objective}
            </p>
          )}
        </div>

        {/* Bottom Parameter Toolbar & Delegate Action */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2.5 border-t border-border-default bg-canvas/70 px-4 py-3 xl:flex-nowrap ${
            prototypeSubmission ? "" : "rounded-b-[5px]"
          }`}
        >
          <div
            role="group"
            aria-label="Task configuration parameters"
            className="flex min-w-0 flex-wrap items-center gap-1.5"
          >
            <SelectDropdown<WorkspaceRegion>
              id="param-region"
              label="Region"
              inlineLabel="Region"
              value={config.region}
              options={WORKSPACE_REGION_OPTIONS}
              onChange={(val) => onChange("region", val)}
            />
            <SelectDropdown<WorkspaceEntityCount>
              id="param-entities"
              label="Entities"
              inlineLabel="Entities"
              value={config.entities}
              options={WORKSPACE_ENTITY_OPTIONS}
              onChange={(val) => onChange("entities", val)}
            />
            <SelectDropdown<WorkspaceDepth>
              id="param-depth"
              label="Depth"
              inlineLabel="Depth"
              value={config.depth}
              options={WORKSPACE_DEPTH_OPTIONS}
              onChange={(val) => onChange("depth", val)}
            />
            <SelectDropdown<WorkspaceSources>
              id="param-sources"
              label="Sources"
              inlineLabel="Sources"
              value={config.sources}
              options={WORKSPACE_SOURCES_OPTIONS}
              onChange={(val) => onChange("sources", val)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="h-9 w-full shrink-0 font-semibold sm:w-auto"
          >
            <span>Delegate Task</span>
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h10" />
              <path d="M9.5 4.5L13 8l-3.5 3.5" />
            </svg>
          </Button>
        </div>

        {/* Prototype Integration Notice (only after valid local submission) */}
        {prototypeSubmission && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-b-[5px] border-t border-accent-amber/30 bg-surface-2 px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    tone="amber"
                    label="Frontend Prototype · Backend Pending"
                    showDot={false}
                  />
                  <span className="font-mono text-[11px] text-text-metadata">
                    Validated locally at {prototypeSubmission.submittedAtLabel}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-text-secondary">
                  Brief configuration ({prototypeSubmission.workflowTitle} · Region:{" "}
                  <span className="font-mono text-text-primary">
                    {prototypeSubmission.config.region}
                  </span>
                  , Entities:{" "}
                  <span className="font-mono text-text-primary">
                    {prototypeSubmission.config.entities}
                  </span>
                  , Depth:{" "}
                  <span className="font-mono text-text-primary">
                    {prototypeSubmission.config.depth}
                  </span>
                  , Sources:{" "}
                  <span className="font-mono text-text-primary">
                    {prototypeSubmission.config.sources}
                  </span>
                  ) is ready for{" "}
                  <code className="font-mono text-[11px] text-accent-cyan">
                    POST /api/v1/tasks
                  </code>{" "}
                  once backend execution is connected. No backend task was created.
                </p>
              </div>

              <button
                type="button"
                onClick={onDismissPrototypeNotice}
                aria-label="Dismiss prototype status message"
                className="shrink-0 rounded-[4px] border border-border-interactive bg-surface-1 px-2 py-1 font-mono text-[11px] text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </form>
    </SurfaceCard>
  );
}
