export type ReportVerificationState = "verified" | "unverified";

export type ReportPublishStatus = "verified" | "verified_with_gaps";

export type EpistemicCategory = "verified_fact" | "ai_assessment";

export type EvidenceSourceTag =
  | "CRUSTDATA"
  | "OLOSTEP"
  | "VERIFIER"
  | "UNVERIFIED";

export type ReportSectionId =
  | "summary"
  | "company-profile"
  | "company-information"
  | "business-overview"
  | "potential-fit"
  | "comparison"
  | "research-evidence"
  | "information-gaps"
  | "final-analysis";

export interface ReportTocItem {
  id: ReportSectionId;
  number: string;
  label: string;
}

export interface ReportCitation {
  id: string;
  code: string;
  companyId: string | "all";
  companyName: string;
  sourceTag: EvidenceSourceTag;
  sourceName: string;
  url: string;
  summary: string;
  verificationState: ReportVerificationState;
  collectedAt: string;
  sectionIds: readonly ReportSectionId[];
}

export interface ReportCompanyProfile {
  id: string;
  rank: string;
  name: string;
  category: string;
  stage: string;
  hq: string;
  targetIcp: string;
  keySignal: string;
  fundingTotal: string;
  estimatedArr: string;
  headcount: string;
  hiringGrowth: string;
  businessSummary: string;
  fitRationale: string;
  fitScore: number;
  verificationState: ReportVerificationState;
  citationIds: readonly string[];
}

export interface ReportRubricCriterion {
  id: string;
  criterion: string;
  weightPct: number;
  measurementBasis: string;
  topLeaderScore: string;
}

export interface ReportInformationGap {
  id: string;
  topic: string;
  companyName: string;
  reason: string;
  impact: string;
  relatedCitationId?: string;
}

export interface ReportRecommendationItem {
  id: string;
  title: string;
  detail: string;
  category: EpistemicCategory;
  citationIds: readonly string[];
}

export interface ReportDetailRecord {
  id: string;
  taskId: string;
  title: string;
  workflowName: string;
  publishStatus: ReportPublishStatus;
  completedLabel: string;
  entitiesCount: number;
  sourcesCheckedCount: number;
  verifiedCount: number;
  unverifiedCount: number;
  confidenceScoreLabel: string;
  executiveSummaryFacts: string;
  executiveSummaryAssessment: string;
  recommendations: readonly ReportRecommendationItem[];
  companies: readonly ReportCompanyProfile[];
  rubricCriteria: readonly ReportRubricCriterion[];
  citations: readonly ReportCitation[];
  informationGaps: readonly ReportInformationGap[];
  finalAnalysisVerdict: string;
  nextSteps: readonly string[];
}

export interface ReportSummaryItem {
  id: string;
  taskId: string;
  title: string;
  workflowName: string;
  publishStatus: ReportPublishStatus;
  entitiesCount: number;
  sourcesCheckedCount: number;
  confidenceScoreLabel: string;
  completedLabel: string;
  hasLinkedTaskExecution: boolean;
}
