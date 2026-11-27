import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "../components/Button";
import { SelectDropdown } from "../components/SelectDropdown";
import { SettingsSwitchRow } from "../components/SettingsSwitchRow";
import {
  SettingsPoliciesPanel,
  SettingsToolsPanel,
} from "../components/SettingsToolsAndPolicies";
import { StatusBadge } from "../components/StatusBadge";
import {
  AUTHORIZED_TOOLS_MOCK,
  EVIDENCE_ORDER_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  NOTIFICATION_DIGEST_OPTIONS,
  SETTINGS_INITIAL_STATE,
} from "../data/settingsMock";
import type {
  EditableSettingsState,
  EvidenceOrderPreference,
  ExportFormatPreference,
  NotificationDigestMode,
  SettingsTabId,
  SettingsValidationErrors,
} from "../types/settings";

const SETTINGS_TABS: readonly {
  id: SettingsTabId;
  label: string;
  scope: "Personal" | "Org Admin";
}[] = [
  { id: "general", label: "General", scope: "Personal" },
  { id: "tools", label: "Authorized Tools", scope: "Org Admin" },
  { id: "policies", label: "Approval Policies", scope: "Org Admin" },
  { id: "notifications", label: "Notifications", scope: "Personal" },
];

function validateIntegerRange(
  raw: string,
  min: number,
  max: number,
  label: string,
): string | undefined {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    return `${label} must be a whole number (${min}–${max}).`;
  }
  const parsed = Number.parseInt(trimmed, 10);
  if (parsed < min || parsed > max) {
    return `${label} must be between ${min} and ${max}.`;
  }
  return undefined;
}

function validateSettings(
  state: EditableSettingsState,
): SettingsValidationErrors {
  const errors: SettingsValidationErrors = {};
  const logErr = validateIntegerRange(
    state.logBufferLimit,
    100,
    1000,
    "Task log buffer limit",
  );
  if (logErr) errors.logBufferLimit = logErr;

  const crawlErr = validateIntegerRange(
    state.crawlUrlCap,
    1,
    50,
    "Autonomous URL cap",
  );
  if (crawlErr) errors.crawlUrlCap = crawlErr;

  const verErr = validateIntegerRange(
    state.verificationThreshold,
    70,
    99,
    "Verification review floor",
  );
  if (verErr) errors.verificationThreshold = verErr;

  return errors;
}

function areSettingsEqual(
  a: EditableSettingsState,
  b: EditableSettingsState,
): boolean {
  return (
    a.autoScrollSseLogs === b.autoScrollSseLogs &&
    a.compactDataDensity === b.compactDataDensity &&
    a.reduceUiMotion === b.reduceUiMotion &&
    a.logBufferLimit === b.logBufferLimit &&
    a.defaultExportFormat === b.defaultExportFormat &&
    a.evidenceOrder === b.evidenceOrder &&
    a.notifyApprovalRequired === b.notifyApprovalRequired &&
    a.notifyReportReady === b.notifyReportReady &&
    a.notifyWorkerRetry === b.notifyWorkerRetry &&
    a.notificationDigest === b.notificationDigest &&
    a.crawlUrlCap === b.crawlUrlCap &&
    a.verificationThreshold === b.verificationThreshold
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("general");
  const [savedSettings, setSavedSettings] = useState<EditableSettingsState>(
    SETTINGS_INITIAL_STATE,
  );
  const [draftSettings, setDraftSettings] = useState<EditableSettingsState>(
    SETTINGS_INITIAL_STATE,
  );
  const [errors, setErrors] = useState<SettingsValidationErrors>({});
  const [feedback, setFeedback] = useState<{
    tone: "emerald" | "neutral" | "danger";
    title: string;
    message: string;
  } | null>(null);

  const isDirty = useMemo(
    () => !areSettingsEqual(draftSettings, savedSettings),
    [draftSettings, savedSettings],
  );

  const updateField = <K extends keyof EditableSettingsState>(
    key: K,
    value: EditableSettingsState[K],
  ) => {
    setDraftSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "logBufferLimit" && errors.logBufferLimit) {
      setErrors((prev) => ({ ...prev, logBufferLimit: undefined }));
    }
    if (key === "crawlUrlCap" && errors.crawlUrlCap) {
      setErrors((prev) => ({ ...prev, crawlUrlCap: undefined }));
    }
    if (key === "verificationThreshold" && errors.verificationThreshold) {
      setErrors((prev) => ({ ...prev, verificationThreshold: undefined }));
    }
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleCancel = () => {
    setDraftSettings(savedSettings);
    setErrors({});
    setFeedback({
      tone: "neutral",
      title: "Changes Reverted",
      message: "Restored settings to your latest local UI prototype state.",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateSettings(draftSettings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({
        tone: "danger",
        title: "Validation Error",
        message: "Fix the highlighted configuration value before saving.",
      });
      if (validationErrors.logBufferLimit) {
        setActiveTab("general");
        window.setTimeout(() => {
          document.getElementById("settings-log-buffer-limit")?.focus();
        }, 0);
      } else {
        setActiveTab("policies");
        window.setTimeout(() => {
          const targetId = validationErrors.crawlUrlCap
            ? "settings-crawl-url-cap"
            : "settings-verification-threshold";
          document.getElementById(targetId)?.focus();
        }, 0);
      }
      return;
    }

    const normalized: EditableSettingsState = {
      ...draftSettings,
      logBufferLimit: String(Number.parseInt(draftSettings.logBufferLimit, 10)),
      crawlUrlCap: String(Number.parseInt(draftSettings.crawlUrlCap, 10)),
      verificationThreshold: String(
        Number.parseInt(draftSettings.verificationThreshold, 10),
      ),
    };

    setSavedSettings(normalized);
    setDraftSettings(normalized);
    setErrors({});
    setFeedback({
      tone: "emerald",
      title: "Preferences Saved (Prototype)",
      message:
        "Applied settings locally in UI prototype state. Endpoint PATCH /api/v1/settings is not connected; resets on reload.",
    });
  };

  const activeScope =
    SETTINGS_TABS.find((t) => t.id === activeTab)?.scope ?? "Personal";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-[820px] min-w-0 flex-col gap-6 pb-4"
    >
      {/* Page Header Row */}
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[24px]">
              Settings
            </h1>
            {isDirty ? (
              <StatusBadge
                tone="amber"
                label="Unsaved Local Edits"
                showDot
                className="text-[10px]"
              />
            ) : (
              <StatusBadge
                tone="neutral"
                label="Mock Settings · PATCH /api/v1/settings pending"
                showDot={false}
                className="text-[10px]"
              />
            )}
          </div>
          <p className="text-[13px] text-text-secondary">
            Configure workspace interface preferences, notification triggers, and
            organization integration governance.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={!isDirty}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </header>

      {/* Horizontal Stitch Sub-Tab Bar */}
      <div
        role="tablist"
        aria-label="Settings categories"
        className="relay-subtle-scroll flex items-center gap-5 overflow-x-auto border-b border-border-default sm:gap-6"
      >
        {SETTINGS_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`settings-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex h-10 shrink-0 items-center gap-1.5 text-[13px] font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-cyan ${
                isSelected
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-[3px] border px-1 py-0 font-mono text-[9px] uppercase ${
                  tab.scope === "Org Admin"
                    ? "border-accent-amber/25 bg-accent-amber/10 text-accent-amber"
                    : "border-border-default bg-surface-1 text-text-metadata"
                }`}
              >
                {tab.scope === "Org Admin" ? "Org" : "User"}
              </span>
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 left-0 h-[2px] bg-accent-cyan"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role={feedback.tone === "danger" ? "alert" : "status"}
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3.5 py-2.5 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={feedback.tone}
              label={feedback.title}
              showDot={false}
            />
            <span className="text-text-secondary">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-mono text-[11px] text-text-metadata hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Panel 1: General (Personal Execution & Interface + Research Defaults) */}
      {activeTab === "general" && (
        <div
          id="settings-panel-general"
          role="tabpanel"
          aria-labelledby="settings-tab-general"
          className="space-y-6"
        >
          {/* Execution & Interface Switches */}
          <section className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
                Execution &amp; Interface Preferences
              </span>
              <Link
                to="/profile"
                className="font-mono text-[10px] text-accent-cyan hover:underline focus-visible:outline-2 focus-visible:outline-accent-cyan"
              >
                Personal Identity &amp; Timezone → Profile
              </Link>
            </div>

            <div className="divide-y divide-border-default overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
              <SettingsSwitchRow
                id="toggle-auto-scroll-logs"
                label="Auto-scroll Live SSE Logs"
                description="Automatically follow incoming worker log events inside the Task Execution inspector."
                checked={draftSettings.autoScrollSseLogs}
                onToggle={(val) => updateField("autoScrollSseLogs", val)}
                scopeBadge="User Preference"
              />

              <SettingsSwitchRow
                id="toggle-compact-density"
                label="Compact Data Density"
                description="Prefer tighter row spacing across My Tasks, Reports comparison matrices, and Team directory views."
                checked={draftSettings.compactDataDensity}
                onToggle={(val) => updateField("compactDataDensity", val)}
                scopeBadge="User Preference"
              />

              <SettingsSwitchRow
                id="toggle-reduce-motion"
                label="Prefer Reduced Motion"
                description="Minimize decorative transitions and subtle pulse indicators alongside OS prefers-reduced-motion."
                checked={draftSettings.reduceUiMotion}
                onToggle={(val) => updateField("reduceUiMotion", val)}
                scopeBadge="Accessibility"
              />

              {/* Validated numeric input for inspector log buffer */}
              <div className="flex flex-col justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center">
                <div className="min-w-0 space-y-0.5">
                  <label
                    htmlFor="settings-log-buffer-limit"
                    className="block text-[13px] font-medium text-text-primary"
                  >
                    Live Log Inspector Buffer Limit
                  </label>
                  <p className="text-xs text-text-secondary">
                    Maximum retained SSE events buffered in client memory per
                    task view (valid range: 100–1000 lines).
                  </p>
                  {errors.logBufferLimit && (
                    <p
                      id="settings-log-buffer-limit-error"
                      role="alert"
                      className="pt-1 text-xs text-accent-danger"
                    >
                      {errors.logBufferLimit}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                  <input
                    id="settings-log-buffer-limit"
                    type="text"
                    inputMode="numeric"
                    value={draftSettings.logBufferLimit}
                    onChange={(event) =>
                      updateField("logBufferLimit", event.target.value)
                    }
                    aria-invalid={Boolean(errors.logBufferLimit)}
                    aria-describedby={
                      errors.logBufferLimit
                        ? "settings-log-buffer-limit-error"
                        : undefined
                    }
                    className={`h-9 w-24 rounded-[6px] border bg-surface-2 px-3 text-right font-mono text-xs text-text-primary tabular-nums focus:border-accent-cyan focus:outline-none ${
                      errors.logBufferLimit
                        ? "border-accent-danger"
                        : "border-border-interactive"
                    }`}
                  />
                  <span className="font-mono text-[11px] text-text-metadata">
                    events
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Report & Research Output Preferences */}
          <section className="space-y-2.5">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-text-metadata">
              Report &amp; Evidence Preferences
            </span>

            <div className="grid grid-cols-1 gap-4 rounded-[6px] border border-border-default bg-surface-1 p-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <span className="mb-1.5 text-xs font-medium text-text-secondary">
                  Default Report Export Format
                </span>
                <SelectDropdown<ExportFormatPreference>
                  id="settings-export-format"
                  label="Default report export format"
                  value={draftSettings.defaultExportFormat}
                  options={EXPORT_FORMAT_OPTIONS}
                  onChange={(val) => updateField("defaultExportFormat", val)}
                  fullWidth
                  menuClassName="w-full min-w-full"
                />
              </div>

              <div className="flex flex-col">
                <span className="mb-1.5 text-xs font-medium text-text-secondary">
                  Verification Evidence Ordering
                </span>
                <SelectDropdown<EvidenceOrderPreference>
                  id="settings-evidence-order"
                  label="Verification evidence ordering"
                  value={draftSettings.evidenceOrder}
                  options={EVIDENCE_ORDER_OPTIONS}
                  onChange={(val) => updateField("evidenceOrder", val)}
                  fullWidth
                  menuClassName="w-full min-w-full"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab Panel 2: Authorized Tools (Organization Scope) */}
      {activeTab === "tools" && (
        <div
          id="settings-panel-tools"
          role="tabpanel"
          aria-labelledby="settings-tab-tools"
        >
          <SettingsToolsPanel tools={AUTHORIZED_TOOLS_MOCK} />
        </div>
      )}

      {/* Tab Panel 3: Approval Policies (Organization Scope) */}
      {activeTab === "policies" && (
        <div
          id="settings-panel-policies"
          role="tabpanel"
          aria-labelledby="settings-tab-policies"
        >
          <SettingsPoliciesPanel
            draft={draftSettings}
            errors={errors}
            onChangeField={updateField}
          />
        </div>
      )}

      {/* Tab Panel 4: Notifications (Personal Scope) */}
      {activeTab === "notifications" && (
        <div
          id="settings-panel-notifications"
          role="tabpanel"
          aria-labelledby="settings-tab-notifications"
          className="space-y-4"
        >
          <div className="divide-y divide-border-default overflow-hidden rounded-[6px] border border-border-default bg-surface-1">
            <SettingsSwitchRow
              id="toggle-notify-approval"
              label="Human-in-the-Loop Approval Alerts"
              description="Surface high-priority alerts immediately when a worker pauses at a gated policy checkpoint."
              checked={draftSettings.notifyApprovalRequired}
              onToggle={(val) => updateField("notifyApprovalRequired", val)}
              scopeBadge="User Alert"
            />

            <SettingsSwitchRow
              id="toggle-notify-report"
              label="Verified Report Ready"
              description="Notify when Sales Prospect Research verification finishes and the deliverable is published."
              checked={draftSettings.notifyReportReady}
              onToggle={(val) => updateField("notifyReportReady", val)}
              scopeBadge="User Alert"
            />

            <SettingsSwitchRow
              id="toggle-notify-retry"
              label="Worker Retry & Timeout Notices"
              description="Show non-blocking notices when external Crustdata or Olostep calls hit backoff retries."
              checked={draftSettings.notifyWorkerRetry}
              onToggle={(val) => updateField("notifyWorkerRetry", val)}
              scopeBadge="User Alert"
            />

            <div className="flex flex-col justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center">
              <div className="min-w-0 space-y-0.5">
                <span className="block text-[13px] font-medium text-text-primary">
                  Notification Delivery Cadence
                </span>
                <p className="text-xs text-text-secondary">
                  Controls how workspace completion notices are grouped once
                  backend notifications are enabled.
                </p>
              </div>
              <SelectDropdown<NotificationDigestMode>
                id="settings-notification-digest"
                label="Notification delivery cadence"
                value={draftSettings.notificationDigest}
                options={NOTIFICATION_DIGEST_OPTIONS}
                onChange={(val) => updateField("notificationDigest", val)}
                fullWidth
                className="sm:w-64 shrink-0"
                menuClassName="right-0 left-auto sm:min-w-[240px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Honest System & Prototype Telemetry Strip (Replaces fake 42ms / US-EAST-1 stitch claim) */}
      <footer className="flex flex-col justify-between gap-2.5 rounded-[6px] border border-border-default bg-surface-1 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-xs text-text-secondary">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-text-metadata"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>
            Viewing{" "}
            <strong className="font-medium text-text-primary">
              {activeScope}
            </strong>{" "}
            scope in local UI prototype mode — edits are saved in memory only and
            reset on reload.
          </span>
        </div>

        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-text-metadata">
          MODE: LOCAL PROTOTYPE
        </span>
      </footer>
    </form>
  );
}
