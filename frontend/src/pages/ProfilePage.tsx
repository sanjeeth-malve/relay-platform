import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../components/Button";
import { ProfileIdentitySection } from "../components/ProfileIdentitySection";
import { ProfileSecuritySection } from "../components/ProfileSecuritySection";
import { SelectDropdown } from "../components/SelectDropdown";
import { StatusBadge } from "../components/StatusBadge";
import {
  PROFILE_MOCK_DATA,
  PROFILE_REGION_OPTIONS,
  PROFILE_REPORT_FORMAT_OPTIONS,
  PROFILE_TIMEZONE_OPTIONS,
} from "../data/profileMock";
import type {
  DefaultReportFormat,
  EditableProfileFields,
  ProfileValidationErrors,
} from "../types/profile";
import type { WorkspaceRegion } from "../types/workspace";

function validateFields(
  fields: EditableProfileFields,
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};
  const trimmedName = fields.fullName.trim();
  const trimmedRole = fields.jobTitle.trim();

  if (trimmedName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  } else if (trimmedName.length > 60) {
    errors.fullName = "Full name cannot exceed 60 characters.";
  }

  if (trimmedRole.length < 2) {
    errors.jobTitle = "Job title must be at least 2 characters.";
  } else if (trimmedRole.length > 50) {
    errors.jobTitle = "Job title cannot exceed 50 characters.";
  }

  return errors;
}

function areFieldsEqual(
  a: EditableProfileFields,
  b: EditableProfileFields,
): boolean {
  return (
    a.fullName === b.fullName &&
    a.jobTitle === b.jobTitle &&
    a.timezone === b.timezone &&
    a.activeOrganizationId === b.activeOrganizationId &&
    a.defaultReportFormat === b.defaultReportFormat &&
    a.defaultResearchRegion === b.defaultResearchRegion
  );
}

export function ProfilePage() {
  const [savedFields, setSavedFields] = useState<EditableProfileFields>(
    PROFILE_MOCK_DATA.initialFields,
  );
  const [draftFields, setDraftFields] = useState<EditableProfileFields>(
    PROFILE_MOCK_DATA.initialFields,
  );
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [feedback, setFeedback] = useState<{
    tone: "emerald" | "neutral";
    title: string;
    message: string;
  } | null>(null);

  const isDirty = useMemo(
    () => !areFieldsEqual(draftFields, savedFields),
    [draftFields, savedFields],
  );

  const activeOrganization = useMemo(
    () =>
      PROFILE_MOCK_DATA.organizations.find(
        (org) => org.id === draftFields.activeOrganizationId,
      ) ?? PROFILE_MOCK_DATA.organizations[0],
    [draftFields.activeOrganizationId],
  );

  const handleFieldChange = <K extends keyof EditableProfileFields>(
    key: K,
    value: EditableProfileFields[K],
  ) => {
    setDraftFields((prev) => ({ ...prev, [key]: value }));
    if (key === "fullName" && errors.fullName) {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
    if (key === "jobTitle" && errors.jobTitle) {
      setErrors((prev) => ({ ...prev, jobTitle: undefined }));
    }
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleCancel = () => {
    setDraftFields(savedFields);
    setErrors({});
    setFeedback({
      tone: "neutral",
      title: "Changes Reverted",
      message: "Restored profile fields to your latest local prototype snapshot.",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateFields(draftFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback(null);
      if (validationErrors.fullName) {
        document.getElementById("profile-full-name")?.focus();
      } else if (validationErrors.jobTitle) {
        document.getElementById("profile-job-title")?.focus();
      }
      return;
    }

    const normalized: EditableProfileFields = {
      ...draftFields,
      fullName: draftFields.fullName.trim(),
      jobTitle: draftFields.jobTitle.trim(),
    };

    setSavedFields(normalized);
    setDraftFields(normalized);
    setErrors({});
    setFeedback({
      tone: "emerald",
      title: "Saved Locally (Prototype)",
      message:
        "Updated profile preferences in local UI state. Endpoint PATCH /api/v1/profile is not connected; resets on reload.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-[820px] min-w-0 flex-col pb-4"
    >
      {/* Page Header Row */}
      <header className="flex flex-col justify-between gap-3 border-b border-border-default pb-4 sm:flex-row sm:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-[24px]">
              Profile
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
                label="Mock Profile · PATCH /api/v1/profile pending"
                showDot={false}
                className="text-[10px]"
              />
            )}
          </div>
          <p className="text-[13px] text-text-secondary">
            Manage personal display details, organization access scope, and
            default delegation parameters.
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
            Save Changes
          </Button>
        </div>
      </header>

      {/* Validation Summary or Save/Cancel Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-border-interactive bg-surface-2 px-3.5 py-2.5 text-xs"
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

      {/* Section 1: Identity, Editable Fields, & Organization Role */}
      <ProfileIdentitySection
        memberId={PROFILE_MOCK_DATA.memberId}
        workEmail={PROFILE_MOCK_DATA.workEmail}
        fields={draftFields}
        errors={errors}
        organizations={PROFILE_MOCK_DATA.organizations}
        activeOrganization={activeOrganization}
        timezoneOptions={PROFILE_TIMEZONE_OPTIONS}
        onFieldChange={handleFieldChange}
      />

      {/* Sections 2 & 3: Authentication & Session Overview */}
      <ProfileSecuritySection authStatusRows={PROFILE_MOCK_DATA.authStatusRows} />

      {/* Section 4: Personal Delegation Defaults (Matches Stitch Section 4) */}
      <section aria-label="Delegation defaults" className="pt-6">
        <span className="mb-4 block font-mono text-[11px] uppercase tracking-wider text-text-metadata">
          Delegation Defaults
        </span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <span className="mb-1.5 text-xs font-medium text-text-secondary">
              Default Report Format
            </span>
            <SelectDropdown<DefaultReportFormat>
              id="profile-default-report-format"
              label="Default report format"
              value={draftFields.defaultReportFormat}
              options={PROFILE_REPORT_FORMAT_OPTIONS}
              onChange={(val) => handleFieldChange("defaultReportFormat", val)}
              fullWidth
              menuClassName="w-full min-w-full"
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1.5 text-xs font-medium text-text-secondary">
              Default Research Region
            </span>
            <SelectDropdown<WorkspaceRegion>
              id="profile-default-region"
              label="Default research region"
              value={draftFields.defaultResearchRegion}
              options={PROFILE_REGION_OPTIONS}
              onChange={(val) =>
                handleFieldChange("defaultResearchRegion", val)
              }
              fullWidth
              menuClassName="w-full min-w-full"
            />
          </div>
        </div>
      </section>
    </form>
  );
}
