import { SelectDropdown } from "./SelectDropdown";
import { StatusBadge } from "./StatusBadge";
import type {
  EditableProfileFields,
  ProfileOrganizationMembership,
  ProfileTimezone,
  ProfileValidationErrors,
} from "../types/profile";

export interface ProfileIdentitySectionProps {
  memberId: string;
  workEmail: string;
  fields: EditableProfileFields;
  errors: ProfileValidationErrors;
  organizations: readonly ProfileOrganizationMembership[];
  activeOrganization: ProfileOrganizationMembership;
  timezoneOptions: readonly ProfileTimezone[];
  onFieldChange: <K extends keyof EditableProfileFields>(
    key: K,
    value: EditableProfileFields[K],
  ) => void;
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "AK";
}

export function ProfileIdentitySection({
  memberId,
  workEmail,
  fields,
  errors,
  organizations,
  activeOrganization,
  timezoneOptions,
  onFieldChange,
}: ProfileIdentitySectionProps) {
  const initials = deriveInitials(fields.fullName);
  const organizationNames = organizations.map((org) => org.name);

  const handleSelectOrganization = (selectedName: string) => {
    const match = organizations.find((org) => org.name === selectedName);
    if (match) {
      onFieldChange("activeOrganizationId", match.id);
    }
  };

  return (
    <section
      aria-label="Identity and organization scope"
      className="space-y-5 border-b border-border-default py-6"
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-text-metadata">
        Identity &amp; Organization Role
      </span>

      {/* Top Avatar & Authority Summary Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3.5">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] border border-border-interactive bg-surface-2 font-mono text-[15px] font-semibold text-text-primary select-none"
          >
            {initials}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-[15px] font-semibold text-text-primary">
                {fields.fullName.trim() || "Unnamed Member"}
              </span>
              <StatusBadge
                tone="emerald"
                label={activeOrganization.authorityLabel}
                showDot={false}
                className="text-[11px]"
              />
            </div>
            <p className="truncate font-mono text-[11px] text-text-metadata">
              {activeOrganization.name} · Mock ID {memberId}
            </p>
          </div>
        </div>

        <span
          title="Avatar upload awaits Supabase Storage integration"
          className="inline-flex shrink-0 items-center rounded-[4px] border border-border-default bg-surface-1 px-2.5 py-1 font-mono text-[10px] text-text-metadata self-start sm:self-auto"
        >
          Initials Avatar · Upload Pending Storage
        </span>
      </div>

      {/* 2-Column Editable Profile Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Editable: Full Name */}
        <div className="flex flex-col">
          <label
            htmlFor="profile-full-name"
            className="mb-1.5 text-xs font-medium text-text-secondary"
          >
            Full Name
          </label>
          <input
            id="profile-full-name"
            type="text"
            value={fields.fullName}
            onChange={(event) => onFieldChange("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "profile-full-name-error" : undefined}
            className={`h-9 w-full rounded-[6px] border bg-surface-2 px-3 text-[13px] text-text-primary transition-colors focus:border-accent-cyan focus:outline-none ${
              errors.fullName
                ? "border-accent-danger"
                : "border-border-interactive"
            }`}
          />
          {errors.fullName && (
            <p
              id="profile-full-name-error"
              role="alert"
              className="mt-1.5 text-xs text-accent-danger"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Read-Only: Work Email */}
        <div className="flex flex-col">
          <span
            id="profile-work-email-label"
            className="mb-1.5 text-xs font-medium text-text-secondary"
          >
            Work Email
          </span>
          <div
            aria-labelledby="profile-work-email-label"
            className="flex h-9 w-full items-center justify-between gap-2 rounded-[6px] border border-border-default bg-surface-1 px-3"
          >
            <span className="min-w-0 truncate font-mono text-xs text-text-secondary">
              {workEmail}
            </span>
            <span className="shrink-0 rounded-[4px] border border-border-interactive bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] tracking-tight text-text-metadata">
              READ-ONLY
            </span>
          </div>
        </div>

        {/* Editable: Job Title / Role */}
        <div className="flex flex-col">
          <label
            htmlFor="profile-job-title"
            className="mb-1.5 text-xs font-medium text-text-secondary"
          >
            Job Title / Display Role
          </label>
          <input
            id="profile-job-title"
            type="text"
            value={fields.jobTitle}
            onChange={(event) => onFieldChange("jobTitle", event.target.value)}
            aria-invalid={Boolean(errors.jobTitle)}
            aria-describedby={errors.jobTitle ? "profile-job-title-error" : undefined}
            className={`h-9 w-full rounded-[6px] border bg-surface-2 px-3 text-[13px] text-text-primary transition-colors focus:border-accent-cyan focus:outline-none ${
              errors.jobTitle
                ? "border-accent-danger"
                : "border-border-interactive"
            }`}
          />
          {errors.jobTitle && (
            <p
              id="profile-job-title-error"
              role="alert"
              className="mt-1.5 text-xs text-accent-danger"
            >
              {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Editable: Timezone */}
        <div className="flex flex-col">
          <span className="mb-1.5 text-xs font-medium text-text-secondary">
            Timezone
          </span>
          <SelectDropdown<ProfileTimezone>
            id="profile-timezone"
            label="Timezone"
            value={fields.timezone}
            options={timezoneOptions}
            onChange={(val) => onFieldChange("timezone", val)}
            fullWidth
            menuClassName="w-full min-w-full"
          />
        </div>
      </div>

      {/* Organization Membership & Access Tier Card */}
      <div className="space-y-3 rounded-[6px] border border-border-default bg-surface-1 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-medium text-text-primary">
                Active Organization
              </span>
              <span className="rounded-[4px] border border-accent-cyan/25 bg-accent-cyan/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-cyan">
                {activeOrganization.rbacTierBadge}
              </span>
              <span className="font-mono text-[11px] text-text-secondary">
                {activeOrganization.rbacRoleName}
              </span>
            </div>
            <p className="text-xs text-text-metadata">
              Backend tenant scope awaits JWT resolution via{" "}
              <span className="font-mono">/api/v1/auth/active-organization</span>.
            </p>
          </div>

          <SelectDropdown<string>
            id="profile-active-org"
            label="Active organization"
            value={activeOrganization.name}
            options={organizationNames}
            onChange={handleSelectOrganization}
            fullWidth
            className="sm:w-64 shrink-0"
            menuClassName="right-0 left-auto sm:min-w-[260px]"
          />
        </div>

        <ul className="grid grid-cols-1 gap-1.5 border-t border-border-default pt-3 text-xs text-text-secondary sm:grid-cols-2">
          {activeOrganization.capabilities.map((cap) => (
            <li key={cap} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan"
              />
              <span>{cap}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
