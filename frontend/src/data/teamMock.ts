import { TASK_EXECUTION_MOCKS } from "./taskExecutionMock";
import type { ExecutionWorkerStage } from "../types/execution";
import type {
  AiWorkerUnit,
  HumanTeamMember,
  TeamLinkedTask,
  WorkspaceAccessTier,
} from "../types/team";

/**
 * Resolves task summaries directly from TASK_EXECUTION_MOCKS without duplicating
 * task records. Every task links to `/tasks/:taskId`.
 */
function resolveLinkedTasks(taskIds: readonly string[]): TeamLinkedTask[] {
  const items: TeamLinkedTask[] = [];
  for (const taskId of taskIds) {
    const task = TASK_EXECUTION_MOCKS[taskId];
    if (!task) continue;
    items.push({
      id: task.id,
      title: task.title,
      status: task.status,
      stageSummary: task.stageSummary,
      taskPath: `/tasks/${task.id}`,
    });
  }
  return items;
}

function resolveWorkerExecutions(stageId: ExecutionWorkerStage): {
  linkedTasks: TeamLinkedTask[];
  activeCount: number;
  waitingCount: number;
  completedCount: number;
} {
  const linkedTasks: TeamLinkedTask[] = [];
  let activeCount = 0;
  let waitingCount = 0;
  let completedCount = 0;

  for (const task of Object.values(TASK_EXECUTION_MOCKS)) {
    const node = task.nodes.find((entry) => entry.id === stageId);
    if (!node) continue;

    if (node.status === "running") activeCount += 1;
    if (node.status === "waiting_approval") waitingCount += 1;
    if (node.status === "completed") completedCount += 1;

    linkedTasks.push({
      id: task.id,
      title: task.title,
      status: task.status,
      stageSummary: task.stageSummary,
      taskPath: `/tasks/${task.id}`,
      nodeStatus: node.status,
      nodeProgress: node.progress,
    });
  }

  return { linkedTasks, activeCount, waitingCount, completedCount };
}

function formatWorkerStatusLabel(
  activeCount: number,
  waitingCount: number,
  completedCount: number,
): string {
  if (activeCount > 0 && waitingCount > 0) {
    return `${activeCount} running · ${waitingCount} awaiting approval`;
  }
  if (activeCount > 0) {
    return `${activeCount} active ${activeCount === 1 ? "run" : "runs"}`;
  }
  if (waitingCount > 0) {
    return `${waitingCount} awaiting approval`;
  }
  if (completedCount > 0) {
    return `Standby · ${completedCount} verified`;
  }
  return "Standby";
}

/**
 * Mock human organization members matching Stitch's directory layout and
 * RELAY's RBAC tiers (GET /api/v1/team/members awaiting backend integration).
 */
export const HUMAN_TEAM_MEMBERS_INITIAL: readonly HumanTeamMember[] = [
  {
    id: "usr-alex-kumar",
    entityKind: "human",
    initials: "AK",
    name: "Alex Kumar",
    email: "alex.kumar@relay-ops.io",
    role: "Admin",
    rbacTierLabel: "Organization Admin · Tier 0",
    department: "Revenue Operations",
    canApprove: true,
    authorityLabel: "Full Authority",
    status: "active",
    isOnline: true,
    lastActiveLabel: "Online now",
    capabilities: [
      "Approve or reject high-impact gated tool runs",
      "Manage organization roles and member invites",
      "Configure workspace policies and execution guardrails",
      "Inspect all organization tasks and verified reports",
    ],
    assignedTasks: resolveLinkedTasks(["RLY-104", "RLY-102"]),
  },
  {
    id: "usr-priya-sharma",
    entityKind: "human",
    initials: "PS",
    name: "Priya Sharma",
    email: "priya.sharma@relay-ops.io",
    role: "Lead Ops",
    rbacTierLabel: "Sales Manager · Tier 1",
    department: "Enterprise Sales",
    canApprove: true,
    authorityLabel: "Full Authority",
    status: "active",
    lastActiveLabel: "12m ago",
    capabilities: [
      "Delegate structured research workflows",
      "Authorize paused AI execution checkpoints",
      "Inspect team tasks, evidence trails, and reports",
    ],
    assignedTasks: resolveLinkedTasks(["RLY-103", "RLY-098"]),
  },
  {
    id: "usr-rohan-mehta",
    entityKind: "human",
    initials: "RM",
    name: "Rohan Mehta",
    email: "rohan.mehta@relay-ops.io",
    role: "Lead Ops",
    rbacTierLabel: "Sales Manager · Tier 1",
    department: "Strategic Accounts",
    canApprove: true,
    authorityLabel: "Full Authority",
    status: "active",
    lastActiveLabel: "41m ago",
    capabilities: [
      "Delegate structured research workflows",
      "Authorize paused AI execution checkpoints",
      "Inspect team tasks, evidence trails, and reports",
    ],
    assignedTasks: resolveLinkedTasks(["RLY-101"]),
  },
  {
    id: "usr-ananya-nair",
    entityKind: "human",
    initials: "AN",
    name: "Ananya Nair",
    email: "ananya.nair@relay-ops.io",
    role: "Analyst",
    rbacTierLabel: "Sales Employee · Tier 2",
    department: "Prospect Intelligence",
    canApprove: false,
    authorityLabel: "Delegate Only",
    status: "active",
    lastActiveLabel: "1h ago",
    capabilities: [
      "Submit briefs in AI Workspace",
      "Monitor own assigned task execution graphs",
      "Review evidence citations and export completed reports",
    ],
    assignedTasks: resolveLinkedTasks(["RLY-104", "RLY-099"]),
  },
  {
    id: "usr-vikram-kulkarni",
    entityKind: "human",
    initials: "VK",
    name: "Vikram Kulkarni",
    email: "vikram.k@relay-ops.io",
    role: "Analyst",
    rbacTierLabel: "Sales Employee · Tier 2",
    department: "Prospect Intelligence",
    canApprove: false,
    authorityLabel: "Delegate Only",
    status: "active",
    lastActiveLabel: "3h ago",
    capabilities: [
      "Submit briefs in AI Workspace",
      "Monitor own assigned task execution graphs",
      "Review evidence citations and export completed reports",
    ],
    assignedTasks: resolveLinkedTasks(["RLY-103", "RLY-101"]),
  },
  {
    id: "usr-divya-rao",
    entityKind: "human",
    initials: "DR",
    name: "Divya Rao",
    email: "divya.rao@relay-ops.io",
    role: "Invited",
    rbacTierLabel: "Sales Employee · Invite Pending",
    department: "Enterprise Sales",
    canApprove: false,
    authorityLabel: "Pending",
    status: "invited",
    lastActiveLabel: "Invite sent 1d ago",
    capabilities: [
      "Access remains suspended until invite acceptance",
      "Will default to Sales Employee (Tier 2) on activation",
    ],
    assignedTasks: [],
  },
];

export const WORKSPACE_ACCESS_TIERS: readonly WorkspaceAccessTier[] = [
  {
    id: "admin",
    name: "Admin",
    tierBadge: "TIER 0",
    rbacMapping: "Organization Admin",
    description:
      "Full workspace configuration, policy thresholds, approvals, and member role management.",
  },
  {
    id: "lead_ops",
    name: "Lead Ops",
    tierBadge: "TIER 1",
    rbacMapping: "Sales Manager",
    description:
      "Delegate workflows, approve paused AI checkpoints, and inspect all team reports.",
  },
  {
    id: "analyst",
    name: "Analyst",
    tierBadge: "TIER 2",
    rbacMapping: "Sales Employee",
    description:
      "Submit briefs in AI Workspace, monitor assigned executions, and export verified reports.",
  },
];

interface AiWorkerBlueprintSeed {
  id: string;
  stageId: ExecutionWorkerStage;
  stageCode: string;
  name: string;
  specialization: string;
  architectureRole: string;
  allowedTools: readonly string[];
  guardrailNote: string;
}

const AI_WORKER_SEEDS: readonly AiWorkerBlueprintSeed[] = [
  {
    id: "agent-supervisor",
    stageId: "supervisor",
    stageCode: "SUPERVISOR",
    name: "Supervisor & Planner",
    specialization: "LangGraph StateGraph decomposition, routing & checkpoint recovery",
    architectureRole: "Central orchestrator — owns task lifecycle without direct external tool calls",
    allowedTools: [],
    guardrailNote:
      "Cannot alter organization permissions or bypass PostgreSQL checkpoint and approval gates.",
  },
  {
    id: "agent-discovery",
    stageId: "discovery",
    stageCode: "STAGE 01",
    name: "Company Discovery Worker",
    specialization: "Identifies candidate B2B software companies matching ICP criteria",
    architectureRole: "Sales MVP Worker Template · Firmographic Screening",
    allowedTools: ["crustdata_search_companies"],
    guardrailNote:
      "Read-only Crustdata screening scoped to task execution_context via centralized Tool Executor.",
  },
  {
    id: "agent-enrichment",
    stageId: "enrichment",
    stageCode: "STAGE 02",
    name: "Company Enrichment Worker",
    specialization: "Collects funding history, headcount velocity & leadership metadata",
    architectureRole: "Sales MVP Worker Template · Parallel Enrichment Batch",
    allowedTools: [
      "crustdata_enrich_company",
      "crustdata_search_people",
      "crustdata_enrich_person",
    ],
    guardrailNote:
      "Subject to subtask batch caps and explicit human approval above configured quota thresholds.",
  },
  {
    id: "agent-research",
    stageId: "research",
    stageCode: "STAGE 03",
    name: "Web Research Worker",
    specialization: "Gathers public product announcements, pricing signals & hiring news",
    architectureRole: "Sales MVP Worker Template · Public Web Evidence Collector",
    allowedTools: ["olostep_search_web", "olostep_scrape_page"],
    guardrailNote:
      "Treats external web content strictly as untrusted data; deep-crawls require manager approval.",
  },
  {
    id: "agent-analysis",
    stageId: "analysis",
    stageCode: "STAGE 04",
    name: "Comparison Analyst",
    specialization: "Evaluates enriched candidates against the documented prospect-fit rubric",
    architectureRole: "Sales MVP Worker Template · Rubric Scoring Engine",
    allowedTools: [],
    guardrailNote:
      "No external network tools allowed — operates purely on collected evidence payloads.",
  },
  {
    id: "agent-verification",
    stageId: "verification",
    stageCode: "STAGE 05",
    name: "Verification & Report Generator",
    specialization: "Audits verified facts vs. AI assessments and compiles 9-section reports",
    architectureRole: "Verification Engine & Result Synthesizer",
    allowedTools: [],
    guardrailNote:
      "Flags unsupported claims into Information Gaps instead of fabricating missing data.",
  },
];

/**
 * Specialized non-human AI worker units seeded from the Sales MVP architecture
 * and linked to active/recent task executions in TASK_EXECUTION_MOCKS.
 */
export const AI_WORKFORCE_UNITS: readonly AiWorkerUnit[] = AI_WORKER_SEEDS.map(
  (seed) => {
    const resolved = resolveWorkerExecutions(seed.stageId);
    return {
      ...seed,
      entityKind: "ai_worker",
      statusLabel: formatWorkerStatusLabel(
        resolved.activeCount,
        resolved.waitingCount,
        resolved.completedCount,
      ),
      isActiveNow: resolved.activeCount > 0,
      hasWaitingApproval: resolved.waitingCount > 0,
      completedRunsCount: resolved.completedCount,
      linkedTasks: resolved.linkedTasks,
    };
  },
);
