import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import type {
  AuthorizedToolInfo,
  EditableSettingsState,
  SettingsValidationErrors,
} from "../types/settings";

export interface SettingsPoliciesPanelProps {
  draft: EditableSettingsState;
  errors: SettingsValidationErrors;
  onChangeField: <K extends keyof EditableSettingsState>(
    key: K,
    value: EditableSettingsState[K],
  ) => void;
}

export function SettingsPoliciesPanel({
  draft,
  errors,
  onChangeField,
}: SettingsPoliciesPanelProps) {
  return (
    <div className="space-y-4">
      {/* Scope Notice: Separate from Personal Profile Settings */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-default bg-surface-1 px-4 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            tone="amber"
            label="Organization Admin Scope"
            showDot={false}
          />
          <span className="text-text-secondary">
            Workspace governance thresholds apply tenant-wide and require
            backend Organization Admin RBAC to persist.
          </span>
        </div>
      </div>

      {/* Numeric Policy Threshold Controls */}
      <div className="divide-y divide-border-default rounded-[6px] border border-border-default bg-surface-1">
        {/* Crawl URL Cap */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 space-y-0.5">
            <label
              htmlFor="settings-crawl-url-cap"
              className="block text-[13px] font-medium text-text-primary"
            >
              Autonomous External URL Cap
            </label>
            <p className="text-xs text-text-secondary">
              Web research subtasks exceeding this domain count pause at{" "}
              <span className="font-mono text-text-primary">waiting_approval</span>{" "}
              (valid range: 1–50 domains).
            </p>
            {errors.crawlUrlCap && (
              <p
                id="settings-crawl-url-cap-error"
                role="alert"
                className="pt-1 text-xs text-accent-danger"
              >
                {errors.crawlUrlCap}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <input
              id="settings-crawl-url-cap"
              type="text"
              inputMode="numeric"
              value={draft.crawlUrlCap}
              onChange={(event) => onChangeField("crawlUrlCap", event.target.value)}
              aria-invalid={Boolean(errors.crawlUrlCap)}
              aria-describedby={
                errors.crawlUrlCap ? "settings-crawl-url-cap-error" : undefined
              }
              className={`h-9 w-20 rounded-[6px] border bg-surface-2 px-3 text-right font-mono text-xs text-text-primary tabular-nums focus:border-accent-cyan focus:outline-none ${
                errors.crawlUrlCap
                  ? "border-accent-danger"
                  : "border-border-interactive"
              }`}
            />
            <span className="font-mono text-[11px] text-text-metadata">
              URLs
            </span>
          </div>
        </div>

        {/* Verification Confidence Alert Threshold */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 space-y-0.5">
            <label
              htmlFor="settings-verification-threshold"
              className="block text-[13px] font-medium text-text-primary"
            >
              Verification Engine Review Floor
            </label>
            <p className="text-xs text-text-secondary">
              Flag unverified claims into Information Gaps when evidence support
              drops below this percentage (valid range: 70–99%).
            </p>
            {errors.verificationThreshold && (
              <p
                id="settings-verification-threshold-error"
                role="alert"
                className="pt-1 text-xs text-accent-danger"
              >
                {errors.verificationThreshold}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <input
              id="settings-verification-threshold"
              type="text"
              inputMode="numeric"
              value={draft.verificationThreshold}
              onChange={(event) =>
                onChangeField("verificationThreshold", event.target.value)
              }
              aria-invalid={Boolean(errors.verificationThreshold)}
              aria-describedby={
                errors.verificationThreshold
                  ? "settings-verification-threshold-error"
                  : undefined
              }
              className={`h-9 w-20 rounded-[6px] border bg-surface-2 px-3 text-right font-mono text-xs text-text-primary tabular-nums focus:border-accent-cyan focus:outline-none ${
                errors.verificationThreshold
                  ? "border-accent-danger"
                  : "border-border-interactive"
              }`}
            />
            <span className="font-mono text-[11px] text-text-metadata">%</span>
          </div>
        </div>

        {/* Non-overridable Security Invariant */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-medium text-text-primary">
                Centralized Tool Executor &amp; Tenant RLS Isolation
              </span>
              <span className="rounded-[4px] border border-border-default bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-metadata">
                LOCKED INVARIANT
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              AI workers always inherit least-privilege tool allowlists and cannot
              bypass server-side RBAC checks or PostgreSQL RLS boundaries.
            </p>
          </div>
          <StatusBadge
            tone="emerald"
            label="Always Enforced"
            showDot={false}
            className="self-start sm:self-auto"
          />
        </div>
      </div>
    </div>
  );
}

export interface SettingsToolsPanelProps {
  tools: readonly AuthorizedToolInfo[];
}

export function SettingsToolsPanel({ tools }: SettingsToolsPanelProps) {
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
          Authorized Research Integrations (Organization Scope)
        </span>
        <span className="font-mono text-[10px] text-text-metadata">
          No API keys or secrets are stored in the frontend
        </span>
      </div>

      <div className="divide-y divide-border-default rounded-[6px] border border-border-default bg-surface-1">
        {tools.map((tool) => {
          const isExpanded = expandedToolId === tool.id;
          return (
            <div key={tool.id} className="p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-border-default bg-surface-2 font-mono text-[11px] font-semibold text-accent-cyan">
                    {tool.shortCode}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-text-primary">
                        {tool.name}
                      </span>
                      <span className="rounded-[4px] border border-border-default bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-metadata">
                        {tool.versionLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {tool.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <StatusBadge
                    tone="amber"
                    label={tool.statusLabel}
                    showDot={false}
                    className="text-[10px]"
                  />
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedToolId((prev) =>
                        prev === tool.id ? null : tool.id,
                      )
                    }
                    className="rounded-[6px] border border-border-interactive bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-primary transition-colors hover:border-accent-cyan focus-visible:outline-2 focus-visible:outline-accent-cyan whitespace-nowrap"
                  >
                    {isExpanded ? "Hide Scope" : "Inspect Scope"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-2 rounded-[6px] border border-border-default bg-canvas p-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-metadata">
                      Contract Tools:
                    </span>
                    {tool.allowedToolNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-[4px] border border-border-default bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-accent-cyan"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <p className="text-text-secondary">{tool.governanceNote}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
