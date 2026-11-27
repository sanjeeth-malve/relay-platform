import type {
  AuthorizedToolInfo,
  EditableSettingsState,
  EvidenceOrderPreference,
  ExportFormatPreference,
  NotificationDigestMode,
} from "../types/settings";

export const EXPORT_FORMAT_OPTIONS: readonly ExportFormatPreference[] = [
  "Markdown Report (.md)",
  "JSON + Evidence Package",
  "Executive Summary (.pdf)",
];

export const EVIDENCE_ORDER_OPTIONS: readonly EvidenceOrderPreference[] = [
  "Verified Facts First",
  "Chronological Collection Order",
];

export const NOTIFICATION_DIGEST_OPTIONS: readonly NotificationDigestMode[] = [
  "Immediate Alerts (In-App)",
  "Hourly Summary",
  "Daily Digest",
];

export const SETTINGS_INITIAL_STATE: EditableSettingsState = {
  autoScrollSseLogs: true,
  compactDataDensity: false,
  reduceUiMotion: false,
  logBufferLimit: "250",
  defaultExportFormat: "Markdown Report (.md)",
  evidenceOrder: "Verified Facts First",

  notifyApprovalRequired: true,
  notifyReportReady: true,
  notifyWorkerRetry: false,
  notificationDigest: "Immediate Alerts (In-App)",

  crawlUrlCap: "10",
  verificationThreshold: "90",
};

/**
 * Authorized provider integrations from AGENTS.md and API_INTEGRATION_CONTRACTS.md.
 * Credentials are stored strictly on the backend outside the frontend bundle.
 */
export const AUTHORIZED_TOOLS_MOCK: readonly AuthorizedToolInfo[] = [
  {
    id: "crustdata",
    shortCode: "CD",
    name: "Crustdata API",
    versionLabel: "Adapter Planned",
    purpose: "B2B company discovery, firmographics & leadership enrichment",
    statusLabel: "Pending Backend Validation",
    allowedToolNames: [
      "crustdata_search_companies",
      "crustdata_enrich_company",
      "crustdata_search_people",
      "crustdata_enrich_person",
    ],
    governanceNote:
      "Calls execute exclusively through backend/tools/ Tool Executor after RBAC & credit quota verification.",
  },
  {
    id: "olostep",
    shortCode: "OC",
    name: "Olostep Crawler",
    versionLabel: "Adapter Planned",
    purpose: "Live public web search, pricing extraction & hiring signals",
    statusLabel: "Pending Backend Validation",
    allowedToolNames: ["olostep_search_web", "olostep_scrape_page"],
    governanceNote:
      "Scraped external content is treated strictly as untrusted data; deep crawls exceeding subtask caps pause for human approval.",
  },
  {
    id: "gemini",
    shortCode: "GA",
    name: "Gemini API",
    versionLabel: "Gemini 4 Hydrogen (Target)",
    purpose: "Supervisor planning, worker reasoning & evidence verification",
    statusLabel: "Model ID Pending Validation",
    allowedToolNames: ["LangGraph StateGraph Runtime", "LangSmith Trace Export"],
    governanceNote:
      "API credentials and model identifiers are configured via server-side environment secrets; never exposed in frontend code.",
  },
];
