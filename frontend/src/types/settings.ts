export type SettingsTabId = "general" | "notifications" | "policies" | "tools";

export type ExportFormatPreference =
  | "Markdown Report (.md)"
  | "JSON + Evidence Package"
  | "Executive Summary (.pdf)";

export type EvidenceOrderPreference =
  | "Verified Facts First"
  | "Chronological Collection Order";

export type NotificationDigestMode =
  | "Immediate Alerts (In-App)"
  | "Hourly Summary"
  | "Daily Digest";

export interface EditableSettingsState {
  // Personal workspace & execution display preferences
  autoScrollSseLogs: boolean;
  compactDataDensity: boolean;
  reduceUiMotion: boolean;
  logBufferLimit: string;
  defaultExportFormat: ExportFormatPreference;
  evidenceOrder: EvidenceOrderPreference;

  // Personal notification triggers
  notifyApprovalRequired: boolean;
  notifyReportReady: boolean;
  notifyWorkerRetry: boolean;
  notificationDigest: NotificationDigestMode;

  // Organization governance policy preview values (Admin scope)
  crawlUrlCap: string;
  verificationThreshold: string;
}

export interface SettingsValidationErrors {
  logBufferLimit?: string;
  crawlUrlCap?: string;
  verificationThreshold?: string;
}

export interface AuthorizedToolInfo {
  id: string;
  shortCode: string;
  name: string;
  versionLabel: string;
  purpose: string;
  statusLabel: string;
  allowedToolNames: readonly string[];
  governanceNote: string;
}
