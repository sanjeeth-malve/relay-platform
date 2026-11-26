# RELAY — Master Development Blueprint

> **Product:** RELAY — Enterprise AI Workforce Platform  
> **Tagline:** *"Work moves. Results happen."*  
> **Status:** Architecture Specification (Pre-Implementation). Decisions in this document are labeled as **Established**, **Proposed**, or **Pending Validation**.

---

## A. Product Vision

### Purpose
**RELAY** is an enterprise AI workforce platform where employees delegate business tasks through a unified workspace. Rather than leaving users with unverified conversational text, RELAY authenticates employees, resolves their organization and permissions, interprets requests, plans multi-step work, routes subtasks to specialized AI workers, executes authorized tools, verifies results against collected evidence, and delivers completed business outputs with full execution history.

### Positioning
> **"From AI conversations to AI-powered business execution."**

### Conversational AI vs. Governed Business Workflow Execution
While modern conversational AI tools can invoke tools and perform agentic tasks in general-purpose contexts, enterprise business execution imposes stricter operational requirements:

| Dimension | Ad-Hoc AI Conversations | RELAY Governed Business Execution |
| :--- | :--- | :--- |
| **Identity & Tenancy** | Single-user session context | Verified employee identity, active organization resolution, RBAC, and tenant isolation |
| **Tool Authorization** | Broad or user-configured tool access | Least-privilege, task-scoped worker permissions enforced by a centralized backend Tool Executor |
| **Execution Model** | Ephemeral chat turns | Durable, asynchronous, checkpointed state graphs with persisted task events and cancellation/retry support |
| **Output Standard** | Free-form text responses | Structured business deliverables separating verified facts from AI-generated assessments, backed by linked evidence |
| **Governance & Audit** | Minimal operational auditability | Human-in-the-loop approvals, immutable audit logs, and usage/credit tracking |

---

## B. MVP Scope *(Established)*

RELAY adopts a **Sales-first MVP** to validate the end-to-end platform on a high-value, read-only external research workflow before introducing write-heavy or multi-department operations.

### Flagship Workflow: Sales Prospect Research
**Example Request:**
> *"Find five promising software companies in India that could be potential customers for our enterprise software product. Research them and prepare a comparison report."*

### End-to-End 10-Step Workflow
1. **Employee submits request** in the AI Workspace.
2. **Request Understanding Engine** extracts structured intent, target geography/industry, count, and deliverable requirements.
3. **Supervisor** creates an execution plan and decomposes the task into subtasks.
4. **Company Discovery Worker** uses **Crustdata** to identify candidate software companies matching criteria.
5. **Company Enrichment Worker** uses **Crustdata** to enrich firmographic, headcount, funding, and leadership signals for each candidate.
6. **Web Research Worker** uses **Olostep** to search and scrape public web pages (company sites, news, product announcements, hiring/tech signals).
7. **Comparison Analyst** evaluates all enriched findings against a documented prospect-fit rubric.
8. **Verification Engine** cross-checks claims against collected evidence, flags unsupported statements, and records information gaps.
9. **Report Generator** compiles the verified findings and analysis into the standardized report structure.
10. **Employee receives the result** with live task history, inspectable evidence, and export options.

### Standardized Report Sections
Every Sales Prospect Research report must include the following nine sections:
1. **Executive Summary**
2. **Company Profile**
3. **Company Information**
4. **Business Overview**
5. **Potential Fit**
6. **Comparison**
7. **Research Evidence**
8. **Information Gaps**
9. **Final Analysis**

### Scoring & Epistemic Rigor
- **Rubric-Based Scoring:** Prospect-fit scores must be computed using a **documented, transparent rubric** (e.g., weighted criteria such as company size, growth signals, technology/product alignment, and market presence) rather than arbitrary LLM-invented numbers.
- **Fact vs. Assessment Separation:** Reports must explicitly distinguish **verified facts** (directly supported by Crustdata or Olostep evidence with source references) from **AI-generated assessments** (inferences, fit rationale, and recommendations). Missing data must be surfaced in **Information Gaps** rather than guessed.

---

## C. User Types *(Established)*

| User Type | Scope | Core Responsibilities | Initial Permission Boundaries |
| :--- | :--- | :--- | :--- |
| **Sales Employee** | Organization (Own/Shared) | Submit research requests, monitor own tasks, view/export own reports, manage personal profile/settings | Cannot approve gated actions for others, cannot manage team roles, cannot view other organizations' data |
| **Sales Manager** | Organization (Team) | All Sales Employee capabilities plus reviewing/approving gated requests in the Approvals queue and viewing team-level visibility as permitted | Scoped to their organization; cannot alter platform-wide settings or cross-tenant data |
| **Organization Admin** | Organization (Full) | Manage organization members, role assignments, and organization-level settings/integration configs | Scoped strictly to their organization; cannot access other tenants or platform-level operations |
| **Platform Admin** | Platform-Wide | Platform-level operations, system health, cross-organization support/governance outside normal organization workflows | Outside normal organization operations; does not participate in standard tenant sales workflows without explicit administrative need |

---

## D. Technology Architecture

### Technology Stack Overview

| Category | Technology | Purpose & Role | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React + TypeScript** | Component-based UI with static type safety | Established |
| **Frontend** | **Vite** | Fast local dev server and production bundling | Established |
| **Frontend** | **Tailwind CSS** | Utility-first styling for the dark enterprise design system | Established |
| **Frontend** | **React Router** | Client-side routing across the 9 primary screens | Established |
| **Frontend** | **TanStack Query** | Server-state caching, background refetching, and mutations | Established |
| **Frontend** | **Framer Motion** | Purposeful micro-interactions and transitions (with reduced-motion support) | Established |
| **Frontend** | **Spline** | Selected 3D scenes (Login identity scene, compact dashboard visualization) | Established |
| **Frontend** | **React Flow** | Interactive node-edge visualization for live task execution graphs | Established |
| **Backend** | **Python + FastAPI** | High-performance async REST & SSE API modular monolith | Established |
| **Backend** | **Pydantic** | Strict request/response, tool schema, and worker output validation | Established |
| **Backend** | **LangChain + LangGraph** | Agent abstractions and stateful `StateGraph` workflow orchestration | Established |
| **Backend** | **Gemini API** | Primary LLM provider for reasoning, planning, analysis, and synthesis | Established |
| **Database & Auth** | **Supabase PostgreSQL** | Primary relational database for application state | Established |
| **Database & Auth** | **Supabase Auth** | User authentication and JWT issuance | Established |
| **Database & Auth** | **PostgreSQL RLS** | Database-level tenant isolation enforcement | Established |
| **Database & Auth** | **PostgreSQL Checkpointing** | Durable LangGraph state persistence across async execution | Established |
| **Integrations** | **Crustdata** | B2B company discovery and firmographic/people enrichment | Established |
| **Integrations** | **Olostep** | Web search and page scraping for unstructured public evidence | Established |
| **Observability** | **LangSmith** | LLM/agent trace inspection, debugging, and evaluation telemetry | Established |

### Important Architectural Constraints & Notes
- **Gemini Model Selection *(Pending Validation)*:** **Gemini 4 Hydrogen** is the currently intended model, subject to confirming its exact API model identifier and API access availability.
- **API Billing:** A consumer Google subscription does **not** include Gemini API credits; API billing/quota must be provisioned separately via Google AI / Cloud API credentials.
- **No Unapproved Stack Additions:** Do not introduce additional frameworks or libraries (e.g., **do not** introduce React Three Fiber into the initial stack).
- **Deferred Capabilities:** `pgvector` and advanced enterprise RAG are future capabilities and are **not** MVP requirements.

---

## E. Frontend Architecture

### Primary Screens (9 Screens) *(Established)*
1. **Login** — Supabase Auth sign-in with purposeful Spline 3D identity scene.
2. **Dashboard** — Workspace overview, recent tasks, key metrics, and compact Spline workforce visualization.
3. **AI Workspace** — Primary conversational interface for submitting business requests and viewing live task progress.
4. **Task Execution** — Detailed task view featuring the **React Flow** live execution graph, subtask timeline, tool calls, and logs.
5. **My Tasks** — Filterable list/table of submitted, running, waiting, and completed tasks.
6. **Reports** — Structured report viewer (9 standardized sections), inspectable evidence drawer, and export actions.
7. **Approvals** — Governance queue for reviewing, approving, or rejecting pending approval requests.
8. **Team** — Organization member directory and role visibility.
9. **Profile & Settings** — Personal user profile and workspace/account preferences.

### Sidebar Navigation Structure *(Established)*
- **Workspace**
  - Overview *(Dashboard)*
  - AI Workspace
  - My Tasks
  - Reports
- **Management**
  - Approvals
  - Team
- **Personal**
  - Profile
  - Settings

### Frontend Technical & Visual Guidelines
- **Routing & State:** React Router handles navigation; TanStack Query manages all REST state and cache invalidation; Supabase Auth JS client manages user sessions and JWT refresh.
- **Visual Direction:** Dark enterprise interface using **deep navy and charcoal** surfaces, **electric cyan/teal** primary accents, **restrained blue** secondary accents, **Inter** typography, subtle 1px borders, and moderate corner radii. **No generic purple AI gradients.**
- **Purposeful 3D & Visualization:**
  - **Spline** is reserved strictly for the Login identity scene and a compact Dashboard workforce visualization.
  - **React Flow** renders actual backend-driven task execution graphs (plan nodes, worker nodes, tool status, verification).
- **Performance & Accessibility:** Responsive layout across desktop and tablet/mobile viewports; lazy-loaded heavy routes/3D scenes; full `prefers-reduced-motion` support for Framer Motion and animations.

---

## F. Backend Architecture

### Modular Monolith Pattern *(Established)*
For the MVP, the FastAPI backend is structured as a **single modular monolith** (`backend/`). Microservices are explicitly avoided at this stage to minimize operational complexity, network overhead, and deployment friction while preserving clean internal boundaries.

### Module Responsibilities
- **`api/`**: Versioned REST & SSE route handlers (`/api/v1`), dependency injection, request parsing, and response serialization.
- **`auth/`**: Supabase JWT verification, active organization resolution, RBAC permission checks, and execution context construction.
- **`db/`**: Database connection management, repository/data-access helpers, and Supabase client/SQL integration.
- **`agents/`**: Request Understanding Engine, Supervisor, Planner, Worker Factory, Worker Templates, Shared Agent Runtime, Verification Engine, and Result Synthesizer.
- **`workflows/`**: LangGraph `StateGraph` definitions, state schemas, checkpointing configuration, and durable execution runner.
- **`integrations/`**: External provider adapters (Crustdata, Olostep) handling HTTP transport, auth headers, rate-limit backoff, and raw response normalization.
- **`tools/`**: Tool Registry and centralized, permission-enforcing **Tool Executor** that bridges agents and integrations.
- **`schemas/`**: Shared Pydantic v2 models for API payloads, internal agent contracts, tool arguments, and structured reports.
- **`core/`**: Application configuration, environment settings, structured logging, exception definitions, and security utilities.

---

## G. Database Architecture *(Proposed Logical Schema)*

> **Note:** The tables below represent a **proposed logical schema** awaiting final SQL migration design. Advanced document ingestion and `pgvector`-based RAG are deferred.

### Proposed Logical Table Groups

1. **Organization & Identity**
   - `organizations` — Tenant records and metadata.
   - `user_profiles` — Application user metadata linked to Supabase Auth (`auth.users`).
   - `departments` — Organizational units within a tenant.
   - `organization_memberships` — Join table linking users to organizations.
   - `roles` — Role definitions (e.g., Sales Employee, Sales Manager, Organization Admin).
2. **Authorization**
   - `permissions` — Granular capability identifiers.
   - `membership_roles` — Assigns roles to organization memberships.
   - `role_permissions` — Maps roles to permissions.
3. **Conversations**
   - `conversations` — Workspace conversation threads scoped to organization and user.
   - `messages` — User prompts and assistant/system responses within a conversation.
4. **Task Management**
   - `tasks` — Top-level delegated tasks, status, idempotency key, and lifecycle timestamps.
   - `subtasks` — Planned execution steps assigned to workers.
   - `task_events` — Persisted, ordered event log powering SSE streaming and replay.
5. **Agent**
   - `worker_templates` — Definitions of available worker archetypes and default tool allowances.
   - `worker_instances` — Task-scoped worker configurations instantiated for a specific run.
   - `worker_executions` — Execution records, inputs, outputs, and token/timing metrics.
6. **Tool & Integrations**
   - `tool_definitions` — Registered tools, schemas, and permission requirements.
   - `tool_executions` — Audit log of every Tool Executor invocation, arguments, status, and duration.
   - `integration_configs` — Non-secret organization-level integration settings.
   - `integration_usage` — Provider credit, call count, and quota tracking.
7. **Reports & Evidence**
   - `reports` — Final structured deliverables linked to tasks and conversations.
   - `report_evidence` — Normalized source citations, URLs, and snippets linked to report claims.
8. **Governance**
   - `approvals` — Human-in-the-loop approval requests, decisions, and reviewer metadata.
   - `audit_events` — Immutable security and administrative audit trail.
9. **Knowledge *(Schema Reserved / Deferred for MVP)***
   - `documents` — Metadata for uploaded files (actual binaries stored in **Supabase Storage**).
   - `document_chunks` — Reserved for future chunking/RAG capabilities.

### Schema Design Principles
- **Primary Keys & Integrity:** UUID primary keys across all tables, explicit foreign keys, and indexes on `(organization_id, created_at)` and foreign key columns.
- **Tenant Isolation:** Every tenant-owned table carries `organization_id` and enforces **PostgreSQL Row Level Security (RLS)**.
- **Auth Linkage:** `user_profiles` references Supabase Auth user IDs (`auth.users.id`).
- **Flexibility & Auditing:** `JSONB` columns for structured configurations, rubrics, and metadata; `created_at` and `updated_at` timestamps throughout.
- **Storage & Secrets:** Uploaded files live in **Supabase Storage**; API keys and secrets are managed via environment/secret managers **outside database tables**.
- **Checkpointing Separation:** LangGraph PostgreSQL checkpoint tables are kept **separate** from application domain tables.

---

## H. AI Agent Architecture *(Established / Proposed)*

RELAY uses a **Supervisor-orchestrated hybrid multi-agent architecture** running on a **single main LangGraph `StateGraph` workflow** initially—avoiding separate autonomous agent systems per worker.

### Core Orchestration Components (11 Components)
1. **Request Understanding Engine** — Parses user input into structured objectives, constraints, and target entities.
2. **Supervisor** — Owns the overall task lifecycle, delegates subtasks, monitors progress, and handles escalations/retries.
3. **Planner** — Produces the DAG/step plan of subtasks and dependencies.
4. **Workflow Router** — Routes state transitions between planning, worker execution, approval waits, verification, and synthesis.
5. **Worker Factory** — Instantiates task-scoped **Worker Instances** from **Worker Templates** with explicit, least-privilege tool allowlists.
6. **Worker Templates** — Reusable blueprints defining system instructions, input/output Pydantic schemas, and eligible tools.
7. **Shared Agent Runtime** — Common execution loop invoking Gemini via LangChain, enforcing token/step limits, and routing tool calls to the Tool Executor.
8. **Tool Registry** — Catalog of available tools and their Pydantic schemas.
9. **Tool Executor** — Centralized backend gatekeeper that validates permissions, execution context, rate/call limits, and invokes integration adapters. **Workers cannot grant themselves permissions or bypass the Tool Executor.**
10. **Verification Engine** — Audits worker outputs against collected evidence, flags unsupported claims, and identifies information gaps.
11. **Result Synthesizer** — Merges verified findings and analytical outputs into the final deliverable.

### Five Sales MVP Worker Templates
| Worker Template | Primary Responsibility | Key Inputs | Structured Output | Allowed Tools |
| :--- | :--- | :--- | :--- | :--- |
| **Company Discovery Worker** | Identify candidate companies matching ICP criteria | Target geography, industry, size, count | Candidate company list + discovery evidence | `crustdata_search_companies` |
| **Company Enrichment Worker** | Gather firmographics, funding, headcount, and leadership data | Candidate company identifiers/domains | Enriched company profiles + evidence | `crustdata_enrich_company`, `crustdata_search_people`, `crustdata_enrich_person` |
| **Web Research Worker** | Collect recent news, product details, and public signals | Company names, domains, research questions | Web findings + source URLs/snippets | `olostep_search_web`, `olostep_scrape_page` |
| **Comparison Analyst** | Score and compare prospects using documented rubric | Enriched profiles + web findings + rubric | Scored comparison matrix + rationale | None (analysis only) |
| **Report Generator** | Assemble the 9-section Sales Prospect Research report | Verified findings, comparison matrix, gaps | Final structured report payload | None (synthesis only) |

### Execution & Reliability Controls
- **Parallel & Sequential Control:** Independent enrichment and web research subtasks may run in controlled parallel batches; comparison, verification, and report generation execute sequentially after upstream dependencies complete.
- **Validation & Tracing:** All worker inputs/outputs use **Pydantic** validation; all LangGraph/Gemini runs emit traces to **LangSmith**.
- **Guardrails:** Configurable retry limits, max tool calls per worker/task, and graceful failure handling with persisted state via **PostgreSQL-backed LangGraph checkpointing**.

---

## I. API Architecture *(Proposed Contracts Awaiting Implementation Validation)*

- **Base Prefix:** `/api/v1`
- **Protocol & Format:** FastAPI REST (JSON) with OpenAPI documentation, Pydantic v2 validation, and **Server-Sent Events (SSE)** for real-time task progress.
- **Identity & Tenancy Rule:** User identity and active `organization_id` **must** be derived from verified Supabase JWTs and backend membership resolution—**never** trusted from client request bodies.
- **Durable Async Execution:** Long-running agent workflows must **not** rely on fragile in-process FastAPI `BackgroundTasks`. Tasks must execute via durable background/worker execution with persisted `task_events`, supporting authenticated SSE streaming and reconnection/state refetching.

### Proposed Endpoint Groups

- **Authentication**
  - `GET /api/v1/auth/me`
  - `GET /api/v1/auth/organizations`
  - `POST /api/v1/auth/active-organization`
- **Conversations**
  - `POST /api/v1/conversations`
  - `GET /api/v1/conversations`
  - `GET /api/v1/conversations/{id}`
  - `GET /api/v1/conversations/{id}/messages`
  - `POST /api/v1/conversations/{id}/messages`
- **Tasks**
  - `POST /api/v1/tasks`
  - `GET /api/v1/tasks`
  - `GET /api/v1/tasks/{id}`
  - `GET /api/v1/tasks/{id}/status`
  - `GET /api/v1/tasks/{id}/events` *(SSE stream)*
  - `POST /api/v1/tasks/{id}/cancel`
  - `GET /api/v1/tasks/{id}/subtasks`
- **Reports**
  - `GET /api/v1/reports`
  - `GET /api/v1/reports/{id}`
  - `GET /api/v1/reports/{id}/evidence`
  - `GET /api/v1/reports/{id}/export`
- **Approvals**
  - `GET /api/v1/approvals`
  - `GET /api/v1/approvals/{id}`
  - `POST /api/v1/approvals/{id}/approve`
  - `POST /api/v1/approvals/{id}/reject`
- **Team**
  - `GET /api/v1/team/members`
- **Profile**
  - `GET /api/v1/profile`
  - `PATCH /api/v1/profile`
- **Settings**
  - `GET /api/v1/settings`
  - `PATCH /api/v1/settings`

---

## J. Security and Governance *(Established)*

1. **Authentication:** Supabase Auth issues JWTs; the FastAPI backend cryptographically verifies every token on protected routes.
2. **Backend-Enforced Authorization:** Frontend route guards are purely UX; **the backend enforces all RBAC and tenant isolation checks**.
3. **Multi-Tenancy & RLS:** Every database query is scoped to the resolved `organization_id` and backed by PostgreSQL Row Level Security (RLS).
4. **Least-Privilege Workers:** Workers receive only the tools explicitly granted by the Supervisor/Worker Factory for their subtask.
5. **Centralized Tool Executor:** All external API calls pass through the Tool Executor, which checks permissions, validates schemas, enforces rate/tool-call/retry limits, and logs `tool_executions`.
6. **Prompt Injection Defenses:** Untrusted web content scraped via Olostep is treated strictly as data—delimited and sanitized before entering reasoning prompts—and workers cannot escalate privileges or alter tool allowlists.
7. **Secret Management:** Gemini, Crustdata, Olostep, and Supabase service keys are stored in secure environment/secret managers, never exposed to the frontend or stored in application DB tables.
8. **Human-in-the-Loop & Audit Logs:** Sensitive actions route to `waiting_approval` and `approvals`; security-relevant actions write to `audit_events`.
9. **Data Privacy & Security Testing:** Dedicated `tests/security/` suite to validate tenant isolation, JWT enforcement, and RBAC boundaries.

---

## K. Task Status Lifecycle *(Proposed)*

The **backend exclusively owns all state transitions**; the frontend renders the current backend state.

| Status | Meaning |
| :--- | :--- |
| `queued` | Task accepted and persisted; awaiting execution pickup |
| `planning` | Request Understanding Engine and Planner are decomposing the task |
| `running` | Workers and tools are actively executing subtasks |
| `waiting_input` | Execution paused pending clarification or input from the user |
| `waiting_approval` | Execution paused pending a manager/admin approval decision |
| `verifying` | Verification Engine is validating outputs and evidence |
| `completed` | Report synthesized, verified, and ready for delivery |
| `failed` | Execution terminated due to an unrecoverable error or exceeded limits |
| `cancelled` | Execution stopped by user or system cancellation request |

---

## L. Development and Deployment

### Repository & Branching *(Established)*
- **Single GitHub Repository:** `relay-platform`
- **Protected Branches:** `main` (reviewed, stable releases) and `develop` (shared integration branch).
- **Four Feature Branches:** `feature/frontend`, `feature/backend`, `feature/agents`, `feature/integrations`.
- **Merge Policy:** Feature branches merge via reviewed Pull Requests into `develop`; `develop` merges into `main` for reviewed releases.

### Deployment Targets *(Proposed — Not Yet Provisioned)*
- **Frontend:** Vercel
- **Backend:** Render
- **Database, Auth & Storage:** Supabase

---

## M. Deferred Features *(Out of Scope for MVP)*

The following capabilities are intentionally deferred to post-MVP phases:
- Workflows for other departments (HR, Finance, Legal, Support, Engineering).
- Autonomous external email sending or outreach execution.
- Direct CRM read/write integrations or modifications (e.g., Salesforce, HubSpot).
- Complex multi-level organization administration and custom role builders.
- Advanced long-term cross-task agent memory.
- Enterprise-scale document ingestion and `pgvector` RAG pipelines.
- Dynamic multi-LLM routing across multiple model providers.
- Subscription billing, invoicing, and advanced executive analytics dashboards.
