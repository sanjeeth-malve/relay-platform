import type {
  DelegationBriefConfig,
  SupervisorPlanStage,
  WorkflowTemplateItem,
  WorkspaceDepth,
  WorkspaceEntityCount,
  WorkspaceRegion,
  WorkspaceSources,
} from "../types/workspace";

export const DEFAULT_DELEGATION_BRIEF: DelegationBriefConfig = {
  templateId: "sales",
  objective:
    "Research 5 promising B2B SaaS companies in India with recent Series A–C funding. Compare estimated ARR, product positioning, hiring signals, and compile a verified executive comparison report.",
  region: "India",
  entities: "5",
  depth: "Deep",
  sources: "Crustdata, Olostep",
};

export const WORKSPACE_REGION_OPTIONS: readonly WorkspaceRegion[] = [
  "India",
  "North America",
  "EMEA",
  "APAC",
  "Global",
];

export const WORKSPACE_ENTITY_OPTIONS: readonly WorkspaceEntityCount[] = [
  "3",
  "5",
  "8",
  "10",
];

export const WORKSPACE_DEPTH_OPTIONS: readonly WorkspaceDepth[] = [
  "Standard",
  "Deep",
];

export const WORKSPACE_SOURCES_OPTIONS: readonly WorkspaceSources[] = [
  "Crustdata, Olostep",
  "Crustdata Only",
  "Olostep Only",
];

export function buildSupervisorPlanStages(
  config: Pick<DelegationBriefConfig, "sources" | "depth">,
): SupervisorPlanStage[] {
  const usesCrustdata = config.sources !== "Olostep Only";
  const usesOlostep = config.sources !== "Crustdata Only";

  return [
    {
      stepNumber: "01",
      stageLabel: "01 Discovery",
      workerName: usesCrustdata ? "Crustdata API" : "Olostep Search",
      detail: "Entity identification",
    },
    {
      stepNumber: "02",
      stageLabel: "02 Enrichment",
      workerName: usesCrustdata ? "Crustdata API" : "Web Context",
      detail: "Firmographics & headcount",
    },
    {
      stepNumber: "03",
      stageLabel: "03 Web Research",
      workerName: usesOlostep ? "Olostep Crawler" : "Queued Skip",
      detail: usesOlostep ? "Product & hiring signal" : "Olostep disabled",
    },
    {
      stepNumber: "04",
      stageLabel: "04 Analysis",
      workerName: "Comparison Analyst",
      detail: config.depth === "Deep" ? "Deep rubric & matrix" : "Standard rubric",
    },
    {
      stepNumber: "05",
      stageLabel: "05 Verification",
      workerName: "Report Generator",
      detail: "Audit & citations pass",
      isVerification: true,
    },
  ];
}

export function getEstimatedDurationLabel(
  depth: WorkspaceDepth,
  entities: WorkspaceEntityCount,
): string {
  if (depth === "Standard" && entities === "3") return "EST. ~1M 15S";
  if (depth === "Standard") return "EST. ~1M 45S";
  if (entities === "8" || entities === "10") return "EST. ~3M 10S";
  return "EST. ~2M 15S";
}

/**
 * Workflow templates shown in Stitch `relay_ai_workspace`.
 * Per DESIGN.md MVP Scope Guard, only Sales Prospect Research is active for MVP;
 * additional presets are explicitly marked deferred / Post-MVP.
 */
export const WORKFLOW_TEMPLATES: readonly WorkflowTemplateItem[] = [
  {
    id: "sales",
    title: "Sales Prospect Research",
    description:
      "Discover, enrich, and compare target accounts with cited evidence and headcount growth.",
    workerCountLabel: "5 workers",
    durationLabel: "~2m",
    availableInMvp: true,
    defaultObjective: DEFAULT_DELEGATION_BRIEF.objective,
  },
  {
    id: "pricing",
    title: "Competitor Pricing Matrix",
    description:
      "Track SaaS tiers, packaging changes, feature matrix drift, and pricing page revisions.",
    workerCountLabel: "4 workers",
    durationLabel: "~3m",
    availableInMvp: false,
  },
  {
    id: "vendor",
    title: "Vendor Due Diligence",
    description:
      "Verify funding history, compliance posture, SOC2 assertions, and executive changes.",
    workerCountLabel: "4 workers",
    durationLabel: "~2m",
    availableInMvp: false,
  },
];
