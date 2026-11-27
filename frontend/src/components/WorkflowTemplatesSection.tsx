import { StatusBadge } from "./StatusBadge";
import type { WorkflowTemplateId, WorkflowTemplateItem } from "../types/workspace";

export interface WorkflowTemplatesSectionProps {
  templates: readonly WorkflowTemplateItem[];
  selectedTemplateId: WorkflowTemplateId;
  onSelectTemplate: (template: WorkflowTemplateItem) => void;
}

export function WorkflowTemplatesSection({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: WorkflowTemplatesSectionProps) {
  return (
    <section aria-label="Workflow Templates" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
          Workflow Templates
        </h2>
        <span className="font-mono text-[11px] text-text-metadata">
          Presets configure supervisor graph &amp; tools
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isMvpAvailable = template.availableInMvp;

          return (
            <button
              key={template.id}
              type="button"
              disabled={!isMvpAvailable}
              aria-pressed={isSelected}
              onClick={() => {
                if (isMvpAvailable) onSelectTemplate(template);
              }}
              className={`flex flex-col justify-between rounded-[6px] border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan ${
                isSelected
                  ? "border-accent-cyan bg-surface-1"
                  : isMvpAvailable
                    ? "border-border-default bg-surface-1 hover:border-border-interactive"
                    : "cursor-not-allowed border-border-default/80 bg-surface-1/60 opacity-75"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[14px] font-semibold leading-snug text-text-primary">
                    {template.title}
                  </span>
                  {isMvpAvailable ? (
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        isSelected ? "bg-accent-cyan" : "bg-border-interactive"
                      }`}
                    />
                  ) : (
                    <StatusBadge
                      tone="neutral"
                      label="Post-MVP"
                      showDot={false}
                      className="shrink-0 text-[10px]"
                    />
                  )}
                </div>

                <p className="text-[13px] leading-relaxed text-text-secondary">
                  {template.description}
                </p>
              </div>

              <div
                className={`mt-3 flex items-center justify-between border-t border-border-default pt-2.5 font-mono text-[11px] ${
                  isSelected ? "text-accent-cyan" : "text-text-metadata"
                }`}
              >
                <span>{template.workerCountLabel}</span>
                <span>
                  {isMvpAvailable ? template.durationLabel : "Deferred"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
