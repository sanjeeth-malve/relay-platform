# RELAY — Enterprise AI Workforce Platform

> **"Work moves. Results happen."**

RELAY is an Enterprise AI Workforce Platform where employees delegate structured business tasks through a unified, governed workspace. Rather than stopping at conversational replies, RELAY authenticates employees, resolves organization and role permissions, plans multi-step work, dispatches specialized AI workers through authorized tools, verifies evidence, and delivers completed business outputs with full execution history.

> **Repository Status:** Planning & Initial Skeleton Stage.  
> This repository currently contains the initial directory structure and shared architecture documentation. Application source code, database migrations, and package dependencies have not yet been initialized or installed.

---

## Table of Contents

- [Product Overview](#product-overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Core Product Capabilities](#core-product-capabilities)
- [Sales-First MVP: Sales Prospect Research](#sales-first-mvp-sales-prospect-research)
- [Technology Stack](#technology-stack)
- [High-Level Architecture](#high-level-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Four-Member Team Overview](#four-member-team-overview)
- [Development Workflow](#development-workflow)
- [Local Setup Status & Instructions](#local-setup-status--instructions)
- [Architecture Documentation](#architecture-documentation)

---

## Product Overview

**RELAY** (*From AI conversations to AI-powered business execution*) is designed as a multi-tenant enterprise platform that coordinates specialized AI workers to complete real business workflows under strict organizational governance. Employees submit high-level business requests in natural language, monitor live execution progress, review human-in-the-loop approvals where required, and receive structured, evidence-backed deliverables.

## Problem Statement

Modern organizations increasingly experiment with AI chat interfaces, yet enterprise adoption stalls when teams try to turn ad-hoc prompts into repeatable business operations:

1. **Unstructured outputs:** Conversational responses often lack consistent formatting, verifiable citations, or clear separation between observed facts and AI-generated assessments.
2. **Governance & security gaps:** Consumer chat tools do not natively enforce organization boundaries, role-based access control (RBAC), centralized tool authorization, or audit trails.
3. **Fragmented execution:** Researching prospects, enriching company records, and synthesizing comparison reports still requires manual switching across multiple SaaS tools and spreadsheets.
4. **Lack of operational visibility:** Teams cannot easily track task state, inspect intermediate worker steps, or resume interrupted workflows reliably.

## Proposed Solution

RELAY provides a single governed execution layer for enterprise AI workflows:

- **Authenticated Multi-Tenant Workspace:** Every request is tied to a verified user, organization membership, and role resolved by the backend.
- **Supervisor-Orchestrated Multi-Agent Execution:** A central Supervisor and Planner decompose requests into a structured execution graph, dispatching task-scoped workers with least-privilege tool access.
- **Centralized Tool Execution:** All external data fetches (e.g., company intelligence and web research) pass through a single backend-enforced Tool Executor.
- **Evidence & Verification:** A dedicated Verification Engine validates outputs against collected evidence and separates verified facts from analytical assessments before final delivery.
- **Live Observability:** Real-time Server-Sent Events (SSE) stream task progress to an interactive execution graph in the frontend.

## Core Product Capabilities *(Planned)*

- **AI Workspace:** Conversational task submission paired with structured task tracking.
- **Live Task Execution Graph:** Visual representation of planning, parallel/sequential worker execution, tool calls, and verification steps.
- **Evidence-Backed Reports:** Structured deliverables with linked source evidence, documented scoring rubrics, and explicit information gaps.
- **Human-in-the-Loop Approvals:** Governance queue for actions or checkpoints requiring manager or admin review.
- **Multi-Tenant Access Control:** Organization isolation via Supabase Auth, backend RBAC, and PostgreSQL Row Level Security (RLS).
- **Durable Execution & Checkpointing:** Persistent task state and PostgreSQL-backed LangGraph checkpointing.

## Sales-First MVP: Sales Prospect Research

To validate the platform end-to-end with high business value and bounded risk, RELAY's MVP focuses on a single flagship workflow: **Sales Prospect Research**.

**Example Request:**
> *"Find five promising software companies in India that could be potential customers for our enterprise software product. Research them and prepare a comparison report."*

**End-to-End MVP Flow:**
1. Employee submits the request in the AI Workspace.
2. Request Understanding Engine extracts target criteria, constraints, and deliverable expectations.
3. Supervisor plans the workflow and creates subtasks.
4. **Company Discovery Worker** queries Crustdata for candidate companies.
5. **Company Enrichment Worker** enriches candidate profiles via Crustdata.
6. **Web Research Worker** gathers recent news, product signals, and public context via Olostep.
7. **Comparison Analyst** evaluates candidates using a documented prospect-fit rubric.
8. **Verification Engine** validates claims against collected evidence and flags information gaps.
9. **Report Generator** compiles the final structured report.
10. Employee views, inspects evidence for, and exports the completed report.

## Technology Stack *(Established / Proposed)*

| Layer | Technologies | Status |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Framer Motion, Spline, React Flow | Established (not yet initialized) |
| **Backend** | Python, FastAPI, Pydantic, LangChain, LangGraph, Gemini API *(intended: Gemini 4 Hydrogen, pending API model ID & access verification)* | Established (not yet initialized) |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, PostgreSQL Row Level Security (RLS), PostgreSQL-backed LangGraph checkpointing | Established (schema proposed) |
| **External Integrations** | Crustdata (company/people intelligence), Olostep (web search & scraping) | Established (contracts pending provider verification) |
| **Observability** | LangSmith | Established |
| **Hosting Targets** | Vercel (Frontend), Render (Backend), Supabase (DB/Auth/Storage) | Proposed |

## High-Level Architecture

```text
+-------------------------------------------------------------------+
|                        Frontend (React/Vite)                      |
|   Login | Dashboard | AI Workspace | Task Execution (React Flow)  |
|   My Tasks | Reports | Approvals | Team | Profile & Settings      |
+---------------------------------+---------------------------------+
                                  | HTTPS (REST /api/v1 + Auth SSE)
                                  v
+-------------------------------------------------------------------+
|                   Backend Modular Monolith (FastAPI)              |
|  API -> Auth & RBAC -> Task/Approval Services -> Tool Executor    |
|                                  |                                |
|          LangGraph Supervisor & Worker Runtime (Gemini)           |
+----------------+---------------------------------+----------------+
                 |                                 |
                 v                                 v
+---------------------------------+ +-------------------------------+
|    Supabase (Postgres + RLS)    | |     External Integrations     |
|  App Tables | Auth | Checkpoints| |  Crustdata API | Olostep API  |
+---------------------------------+ +-------------------------------+
```

## Project Directory Structure

```text
relay-platform/
├── README.md
├── AGENTS.md                       # Reserved for future AI coding agent instructions
├── .gitignore
├── .env.example
├── docs/
│   ├── MASTER_DEVELOPMENT_BLUEPRINT.md
│   ├── API_INTEGRATION_CONTRACTS.md
│   └── TEAM_TASKBOOK.md
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── backend/
│   ├── api/
│   ├── auth/
│   ├── core/
│   ├── db/
│   ├── agents/
│   ├── workflows/
│   ├── integrations/
│   ├── schemas/
│   ├── tools/
│   └── main.py
├── supabase/
│   └── migrations/
└── tests/
    ├── evaluation/
    ├── integrations/
    ├── security/
    └── workflows/
```

## Four-Member Team Overview

| Role | Branch | Primary Ownership |
| :--- | :--- | :--- |
| **Member 1 — Frontend** | `feature/frontend` | React UI, design system, 9 primary screens, Spline 3D scenes, React Flow task graph, API/SSE consumption, frontend tests |
| **Member 2 — Backend, DB & Security** | `feature/backend` | FastAPI modular monolith, Supabase schema & RLS migrations, JWT/RBAC, API endpoints, persistence, centralized Tool Executor, security tests |
| **Member 3 — AI & Orchestration** | `feature/agents` | Gemini integration, LangChain/LangGraph `StateGraph`, Supervisor, Planner, Worker Factory, 5 Sales worker templates, Verification Engine, evaluation |
| **Member 4 — Integrations & Testing** | `feature/integrations` | Olostep & Crustdata adapters, Pydantic tool schemas (with Member 3), credential handling (with Member 2), usage tracking, integration & evaluation tests |

## Development Workflow

- **Protected Branches:** `main` (stable releases) and `develop` (integration branch). Direct pushes to `main` or `develop` are prohibited.
- **Feature Branches:** `feature/frontend`, `feature/backend`, `feature/agents`, `feature/integrations` submit Pull Requests into `develop`.
- **Coordination:** Daily 15-minute syncs, GitHub Issues & Projects for task tracking, Discord for day-to-day communication, and strict adherence to shared architecture docs.

## Local Setup Status & Instructions

> **Current Status:** This repository is in its **initial structure and documentation phase**. No dependencies are installed, no virtual environments or `node_modules` exist, and neither `frontend/` nor `backend/` has been initialized yet.

Once framework initialization begins in subsequent tasks:
1. **Prerequisites (planned):** Node.js (LTS), Python 3.11+, Git, a Supabase project, and API credentials for Gemini, Crustdata, Olostep, and LangSmith.
2. **Environment Variables:** Copy `.env.example` to `.env` (once populated) and configure secrets outside source control.
3. **Frontend & Backend Setup:** Initialization commands (`npm install`, Python virtual environment setup, Supabase migrations) will be added here as each module is scaffolded.

## Architecture Documentation

All technical decisions, contracts, and team responsibilities live in `docs/`:

- [**Master Development Blueprint**](docs/MASTER_DEVELOPMENT_BLUEPRINT.md) — Product vision, MVP scope, user roles, tech stack, frontend/backend/database/agent/API architectures, security, task lifecycle, and deferred features.
- [**API & Integration Contracts**](docs/API_INTEGRATION_CONTRACTS.md) — REST conventions, auth flow, task creation & SSE event contracts, internal agent interfaces, external tool contracts, error formats, and ownership boundaries.
- [**Team Taskbook**](docs/TEAM_TASKBOOK.md) — Role assignments, ownership boundaries, Git workflow, collaboration practices, and phased development plan.
