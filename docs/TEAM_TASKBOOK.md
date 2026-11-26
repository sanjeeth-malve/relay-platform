# RELAY — Team Taskbook

> **Product:** RELAY — Enterprise AI Workforce Platform  
> **Status:** Team Operating Model & Phased Execution Plan

This taskbook defines the four-member development ownership model, Git workflow, collaboration practices, and phased implementation sequence.

---

## 1. Team Roles & Responsibilities

### Member 1 — Frontend (`feature/frontend`)
**Scope:** `frontend/` and frontend tests.
- Initialize React + TypeScript + Vite + Tailwind CSS application.
- Build the dark enterprise design system (deep navy/charcoal, electric cyan/teal, restrained blue, Inter typography, `prefers-reduced-motion` support).
- Implement Supabase Auth frontend integration and session management.
- Build the **9 primary screens**: Login, Dashboard, AI Workspace, Task Execution, My Tasks, Reports, Approvals, Team, Profile & Settings.
- Implement sidebar navigation (Workspace / Management / Personal).
- Integrate **Spline** 3D scenes (Login identity scene, compact Dashboard visualization).
- Implement **React Flow** live task execution graph.
- Integrate `/api/v1` REST endpoints via **TanStack Query** and authenticated `fetch`-based **SSE** progress streaming.
- Ensure responsive design, lazy loading, and frontend unit/component testing.

### Member 2 — Backend, Database & Security (`feature/backend`)
**Scope:** `backend/api/`, `backend/auth/`, `backend/db/`, `backend/core/`, `backend/tools/`, `backend/schemas/`, `supabase/migrations/`, `tests/security/`.
- Initialize FastAPI modular monolith (`backend/main.py`).
- Author Supabase PostgreSQL schema migrations and **Row Level Security (RLS)** policies.
- Implement Supabase JWT verification, active organization resolution, and **RBAC** enforcement.
- Build all `/api/v1` REST endpoints and authenticated SSE streaming endpoint backed by persisted `task_events`.
- Implement durable task management, approvals workflow, and immutable `audit_events`.
- Define the LangGraph integration boundary (`execute_task`) and PostgreSQL checkpointing setup.
- Implement the **centralized, secure Tool Executor** (`backend/tools/`) enforcing permissions, limits, and audit logging.
- Write security and tenant-isolation tests in `tests/security/`.

### Member 3 — AI & Orchestration (`feature/agents`)
**Scope:** `backend/agents/`, `backend/workflows/`, `tests/workflows/`, `tests/evaluation/` (agent evaluation).
- Integrate **Gemini API** via LangChain *(pending API model ID and access verification for Gemini 4 Hydrogen)*.
- Build the single main **LangGraph `StateGraph`** workflow with PostgreSQL-backed checkpointing.
- Implement Request Understanding Engine, Supervisor, Planner, and Workflow Router.
- Implement Worker Factory, Shared Agent Runtime, and the **5 Sales MVP Worker Templates**:
  - Company Discovery Worker
  - Company Enrichment Worker
  - Web Research Worker
  - Comparison Analyst
  - Report Generator
- Implement controlled parallel execution and sequential dependency handling.
- Implement the Verification Engine (fact vs. assessment separation, gap detection) and Result Synthesizer (9-section report + documented scoring rubric).
- Configure **LangSmith** tracing and build agent/workflow evaluation tests.

### Member 4 — Integrations & Testing (`feature/integrations`)
**Scope:** `backend/integrations/`, tool schemas (coordinated with Member 3), `tests/integrations/`, `tests/evaluation/` (scenarios).
- Verify actual **Crustdata** and **Olostep** API endpoints, auth, payloads, and rate limits against provider docs and account access.
- Build **Olostep** adapter (`olostep_search_web`, `olostep_scrape_page`) and **Crustdata** adapter (`crustdata_search_companies`, `crustdata_enrich_company`, `crustdata_search_people`, `crustdata_enrich_person`).
- Define Pydantic tool input/output schemas in coordination with **Member 3**.
- Implement secure API credential handling in coordination with **Member 2**.
- Implement usage/credit tracking (`integration_usage`), provider error handling, and retry/backoff logic.
- Build integration tests (`tests/integrations/`) and end-to-end evaluation scenarios (`tests/evaluation/`).

---

## 2. Ownership Boundaries *(Established)*

| Area | Primary Owner | Coordination Rules |
| :--- | :--- | :--- |
| **Frontend UI** | Member 1 | Consumes `/api/v1` contracts only |
| **API Routes & Contracts** | Member 2 | Coordinates payload changes with Member 1 & Member 3 |
| **Database & Migrations** | Member 2 | Single source of truth for SQL migrations & RLS |
| **Supervisor & Worker Templates** | Member 3 | Consumes `execute_tool` interface from Member 2 |
| **External Provider Adapters** | Member 4 | Pure adapters in `backend/integrations/` |
| **Tool Schemas** | Member 4 + Member 3 | Jointly agreed Pydantic schemas |
| **Tool Authorization & Secure Tool Executor** | Member 2 | **Member 4 must NOT independently implement another Tool Executor** |
| **End-to-End Testing** | All Members | Coordinated across `develop` |

**Shared File Rule:** Shared interfaces and files (e.g., `backend/schemas/`, `docs/`) must be coordinated before editing, with **one primary owner per shared file at a time** to prevent merge conflicts.

---

## 3. Git Workflow

- **Branches:**
  - `main` — Stable, reviewed releases only.
  - `develop` — Shared integration branch.
  - `feature/frontend` — Member 1
  - `feature/backend` — Member 2
  - `feature/agents` — Member 3
  - `feature/integrations` — Member 4
- **Strict Rules:**
  - **No direct pushes** to `main` or `develop`.
  - All feature work enters `develop` via **Pull Requests (PRs)** with review and passing checks.
  - Sync feature branches with `develop` regularly.
  - Do not commit directly to another member's feature branch without explicit coordination.
  - Do not overwrite shared files without coordination.
  - `docs/` is the single source of truth for shared architecture decisions.

---

## 4. Team Collaboration

- **Daily Sync:** 15-minute daily standup to surface blockers and contract changes.
- **Task Tracking:** GitHub Issues for granular tasks; GitHub Projects for sprint/milestone tracking.
- **Communication:** Discord for async questions and PR review pings.
- **Technical Decisions:** Any contract or architecture change must be reflected in `docs/`.
- **Quality:** Continuous integration (CI) checks and regular integration testing on `develop`.

---

## 5. Phased Development Sequence & Initial Task Breakdown

### Phase 1: Foundation & Contracts Validation
*Goal: Establish runnable skeletons, database schema, auth, and verified external API access.*
- **Member 1:** Initialize Vite + React + TypeScript + Tailwind; set up routing, dark theme tokens, and Supabase Auth login screen.
- **Member 2:** Initialize FastAPI app, `.env` config, Supabase migrations + RLS policies, JWT/org resolution middleware, and health/auth endpoints.
- **Member 3:** Validate Gemini API access & model identifier; set up LangChain/LangGraph skeleton and LangSmith tracing.
- **Member 4:** Verify Crustdata & Olostep API credentials, endpoints, and rate limits; draft Pydantic tool schemas with Member 3.

### Phase 2: Core Execution & Adapters
*Goal: Connect API -> Task Persistence -> Tool Executor -> Provider Adapters -> LangGraph.*
- **Member 1:** Build AppShell/Sidebar, Dashboard, AI Workspace, and My Tasks views wired to `/api/v1/conversations` and `/api/v1/tasks`.
- **Member 2:** Implement `tasks`, `subtasks`, `task_events` persistence, SSE endpoint, and the centralized `Tool Executor`.
- **Member 3:** Implement Request Understanding, Supervisor, Planner, Worker Factory, and initial Sales Worker Templates calling `execute_tool`.
- **Member 4:** Implement Crustdata and Olostep adapters with retries, error normalization, and `integration_usage` tracking; write `tests/integrations/`.

### Phase 3: Verification, Reports & Visualization
*Goal: Complete the Sales Prospect Research workflow end-to-end.*
- **Member 1:** Build Task Execution view with **React Flow** graph, authenticated SSE client, Reports viewer (9 sections + evidence), and Approvals/Team/Settings screens.
- **Member 2:** Implement `reports`, `report_evidence`, `approvals`, `audit_events` endpoints and `tests/security/`.
- **Member 3:** Implement Comparison Analyst (documented rubric), Verification Engine, and Report Generator (9-section output).
- **Member 4:** Build end-to-end evaluation scenarios in `tests/evaluation/` using realistic Indian software prospect queries.

### Phase 4: Integration Hardening & MVP Release
*Goal: End-to-end testing, security verification, and `develop` -> `main` release.*
- **All Members:** Run full E2E Sales Prospect Research tests, verify SSE reconnection, audit RLS & RBAC boundaries, and prepare deployment to Vercel (frontend) and Render (backend).
