import { useMemo, useState, type FormEvent } from "react";
import { DelegationBriefForm } from "../components/DelegationBriefForm";
import { SupervisorPlanPreview } from "../components/SupervisorPlanPreview";
import { WorkflowTemplatesSection } from "../components/WorkflowTemplatesSection";
import {
  DEFAULT_DELEGATION_BRIEF,
  WORKFLOW_TEMPLATES,
  buildSupervisorPlanStages,
  getEstimatedDurationLabel,
} from "../data/workspacePresets";
import type {
  DelegationBriefConfig,
  PrototypeSubmissionSummary,
  WorkflowTemplateItem,
  WorkspaceValidationErrors,
} from "../types/workspace";

export function WorkspacePage() {
  const [config, setConfig] = useState<DelegationBriefConfig>(
    DEFAULT_DELEGATION_BRIEF,
  );
  const [errors, setErrors] = useState<WorkspaceValidationErrors>({});
  const [prototypeSubmission, setPrototypeSubmission] =
    useState<PrototypeSubmissionSummary | null>(null);

  const activeTemplate = useMemo(
    () =>
      WORKFLOW_TEMPLATES.find((t) => t.id === config.templateId) ??
      WORKFLOW_TEMPLATES[0],
    [config.templateId],
  );

  const planStages = useMemo(
    () =>
      buildSupervisorPlanStages({
        sources: config.sources,
        depth: config.depth,
      }),
    [config.sources, config.depth],
  );

  const estimatedDurationLabel = useMemo(
    () => getEstimatedDurationLabel(config.depth, config.entities),
    [config.depth, config.entities],
  );

  const handleFieldChange = <K extends keyof DelegationBriefConfig>(
    field: K,
    value: DelegationBriefConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    if (field === "objective" && errors.objective) {
      setErrors({});
    }
    if (prototypeSubmission) {
      setPrototypeSubmission(null);
    }
  };

  const handleClearObjective = () => {
    setConfig((prev) => ({ ...prev, objective: "" }));
    setErrors({});
    setPrototypeSubmission(null);
  };

  const handleSelectTemplate = (template: WorkflowTemplateItem) => {
    if (!template.availableInMvp) return;
    setConfig((prev) => ({
      ...prev,
      templateId: template.id,
      objective:
        prev.objective.trim().length === 0 && template.defaultObjective
          ? template.defaultObjective
          : prev.objective,
    }));
    setErrors({});
    setPrototypeSubmission(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = config.objective.trim();

    if (!trimmed) {
      setErrors({
        objective: "Enter a business objective before delegating a task.",
      });
      setPrototypeSubmission(null);
      return;
    }

    if (trimmed.length < 12) {
      setErrors({
        objective:
          "Provide at least 12 characters describing target accounts and report requirements.",
      });
      setPrototypeSubmission(null);
      return;
    }

    setErrors({});
    setPrototypeSubmission({
      workflowTitle: activeTemplate.title,
      config: { ...config, objective: trimmed },
      submittedAtLabel: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[860px] min-w-0 flex-col gap-6 py-1 sm:py-2">
      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[18px] font-semibold tracking-tight text-text-primary sm:text-[20px]">
          AI Workspace
        </h1>
        <p className="max-w-2xl text-sm text-text-secondary">
          Define a business objective. The Supervisor will plan, assign
          specialized workers, and verify outputs.
        </p>
      </header>

      {/* Structured Delegation Brief Card */}
      <DelegationBriefForm
        workflowTitle={activeTemplate.title}
        config={config}
        errors={errors}
        prototypeSubmission={prototypeSubmission}
        onChange={handleFieldChange}
        onClearObjective={handleClearObjective}
        onDismissPrototypeNotice={() => setPrototypeSubmission(null)}
        onSubmit={handleSubmit}
      />

      {/* Supervisor Execution Plan Preview Card */}
      <SupervisorPlanPreview
        estimatedDurationLabel={estimatedDurationLabel}
        stages={planStages}
      />

      {/* Workflow Templates Section */}
      <WorkflowTemplatesSection
        templates={WORKFLOW_TEMPLATES}
        selectedTemplateId={config.templateId}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
