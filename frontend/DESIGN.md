# RELAY — Frontend Design Specification

> **Product:** RELAY — Enterprise AI Workforce Platform  
> **Tagline:** *"Work moves. Results happen."*  
> **Owner:** Member 1 — Frontend Developer (`feature/frontend`)  
> **Status:** Reconciled Frontend Design Specification (Pre-Implementation).  
> **Baseline Sources:** `AGENTS.md`, `docs/MASTER_DEVELOPMENT_BLUEPRINT.md`, `docs/API_INTEGRATION_CONTRACTS.md`, `docs/TEAM_TASKBOOK.md`, and the Google Stitch export (`stitch_relay_enterprise_login`).

---

## 1. Product Identity & Visual Direction

**RELAY** (*"From AI conversations to AI-powered business execution"*) is an enterprise AI workforce platform where employees delegate structured business tasks, inspect live multi-agent execution, review human-in-the-loop approvals, and consume evidence-backed deliverables.

### Visual Direction *(Approved)*
- **Aesthetic:** Dark enterprise operational control room—calm authority, surgical precision, high-density data management.
- **Hierarchy:** Flat surface layering separated by crisp `1px` structural borders rather than drop shadows, ambient blurs, or floating translucent cards.
- **Color Discipline:** Deep navy/charcoal canvas (`#0B0E14`), restrained slate surfaces (`#11161F`, `#18202C`), electric cyan (`#06B6D4`) reserved strictly for primary CTAs, active focus rings, and active execution states; emerald (`#10B981`) for verified/completed states; amber (`#F59E0B`) for pending/waiting states; red (`#EF4444`) for failed/rejected/error states.

---

## 2. Recommended Token System & Stitch Reconciliation

### Reconciliation Note: Stitch YAML vs. Stitch Prose & HTML
The Stitch export contained internal inconsistencies between its Material-style YAML frontmatter (`surface: '#10131a'`, `primary: '#6cd3f7'`, `on-surface: '#e1e2eb'`, `tertiary: '#ffb873'`, `error: '#ffb4ab'`) and its own `DESIGN.md` prose + exported HTML screens (`#0B0E14`, `#11161F`, `#18202C`, `#1E293B`, `#2D3B4E`, `#F1F5F9`, `#94A3B8`, `#64748B`, `#06B6D4`, `#10B981`, `#F59E0B`).

**Decision *(Recommended Standard)*:** Adopt the unified `#0B0E14` / `#11161F` / `#18202C` / `#1E293B` / `#06B6D4` token system below. The Material-style YAML palette (`#10131a`, `#6cd3f7`, etc.) is superseded to prevent two-palette drift across screens.

### Core Color Tokens

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#0B0E14` | Primary viewport canvas, deepest background layer |
| `--bg-surface-1` | `#11161F` | Sidebar, topbar, primary cards, table containers, drawers |
| `--bg-surface-2` | `#18202C` | Inputs, nested wells, table hover rows, active nav items |
| `--border-default` | `#1E293B` | `1px` structural borders, dividers, table gridlines |
| `--border-interactive` | `#2D3B4E` | Hover borders, interactive containers, secondary button borders |
| `--text-primary` | `#F1F5F9` | Headings, primary data values, active labels |
| `--text-secondary` | `#94A3B8` | Body copy, descriptions, table headers, secondary metadata |
| `--text-metadata` | `#64748B` | Captions, muted timestamps, placeholders, disabled states |
| `--accent-cyan` | `#06B6D4` | Primary CTAs, active focus rings, active execution states |
| `--accent-emerald` | `#10B981` | Completed tasks, verified claims, approved state |
| `--accent-amber` | `#F59E0B` | `waiting_approval`, `waiting_input`, unverified gaps, warnings |
| `--accent-danger` | `#EF4444` | `failed` status, rejected approvals, destructive actions, API errors |

### Semantic Task Status Mapping (Backend-Owned)

| Backend Status | Label | Accent Color | Badge / Indicator Style |
| :--- | :--- | :--- | :--- |
| `queued` | Queued | `#64748B` | `#18202C` fill, `1px solid #1E293B`, static dot |
| `planning` | Planning | `#06B6D4` | Cyan text/border tint, subtle pulse dot |
| `running` | Running | `#06B6D4` | Cyan text/border tint, active pulse dot |
| `waiting_input` | Waiting Input | `#F59E0B` | Amber text/border tint, static dot |
| `waiting_approval` | Waiting Approval | `#F59E0B` | Amber text/border tint, attention icon |
| `verifying` | Verifying | `#06B6D4` | Cyan text/border tint, shield/check icon |
| `completed` | Completed | `#10B981` | Emerald text/border tint, check icon |
| `failed` | Failed | `#EF4444` | Red text/border tint, alert icon |
| `cancelled` | Cancelled | `#64748B` | Muted slate, stop/cancelled icon |

---

## 3. Typography & Font Weights

### Font Stack
- **Primary UI & Prose (`--font-sans`):** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` *(Approved in `MASTER_DEVELOPMENT_BLUEPRINT.md`)*
- **Technical / Telemetry (`--font-mono`):** `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`
- **Display Headline Font (`Geist`):** *(Pending Approval)* The Stitch export pairs `Geist` (`600` weight) for `headline-lg`/`md`/`sm` with `Inter`. Because `MASTER_DEVELOPMENT_BLUEPRINT.md` specifies `Inter`, use `Inter` as the approved baseline and treat adding `Geist` for headings as pending team alignment.

### Type Scale & Rules

| Role | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `24px` / `32px` (mobile `20px`) | `600` | `-0.015em` | Top-level screen headings |
| **Section Heading** | `15px`–`18px` / `22px`–`26px` | `600` | `-0.01em` | Card headers, report section titles |
| **Body / UI** | `13px`–`14px` / `20px` | `400`–`500` | `0` | Navigation, descriptions, form labels, report prose |
| **Compact Label / Kicker** | `11px`–`12px` / `16px` | `500`–`600` | `+0.05em` | Table headers, sidebar group kickers (`uppercase`) |
| **Telemetry / Code** | `11px`–`12px` / `16px`–`18px` | `400`–`500` | `0` | `task_id` (`RLY-104`), `event_id`, timestamps, durations, tool names, rubric scores, SSE logs |

**Mandatory Rule:** Apply `font-variant-numeric: tabular-nums` on all monospace metrics, timestamps, counts, and table numbers.

---

## 4. Spacing, Borders, Radius & Surface Hierarchy

### Radius Reconciliation
The Stitch YAML listed `0.25rem`–`0.75rem`, Stitch prose listed `6px` (buttons/inputs), `8px` (cards), and `4px` (badges), while the exported Stitch HTML screens predominantly used `rounded-[6px]` for cards/buttons/inputs and `rounded-[4px]` for badges.
- **Recommended Standard:**
  - **`6px` (`rounded-[6px]`)** for all cards, panels, buttons, inputs, modals, and React Flow nodes.
  - **`4px` (`rounded-[4px]`)** for compact status badges, tags, and checkboxes.
  - **`9999px` (`rounded-full`)** only for small status indicator dots and user avatar circles.

### Borders & Spacing
- **Borders:** `1px solid #1E293B` for structural separation; `1px solid #2D3B4E` on hover/interactive states; `#06B6D4` on input focus (no outer glow).
- **Spacing Scale:** `4px` base unit (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`) with `16px` grid gutters and `20px`–`24px` desktop canvas padding.

---

## 5. Anti-AI-Slop & Visual Consistency Rules

- **No glassmorphism** (`backdrop-blur` translucent overlays).
- **No purple gradients** anywhere in backgrounds, buttons, borders, or 3D/SVG accents.
- **No neon glow shadows** (`box-shadow` glow effects).
- **No oversized chat interfaces** (AI Workspace is a structured delegation console, not a consumer chat bubble UI).
- **No unnecessary decorative animations.**
- **Text Wrapping Guard *(Observed in Stitch Screenshots)*:** Enforce `whitespace-nowrap` on action buttons (`Inspect`, `Review`, `Approve`) and status badges, and `min-w-0` / `truncate` on topbar search inputs so labels never wrap mid-word.
- **Iconography:** Stitch HTML uses **Material Symbols Outlined**. Package selection for React (e.g., `lucide-react` vs. `@fontsource` / Google Fonts Material Symbols) is **pending dependency approval** during Vite initialization.

---

## 6. AppShell Specification *(Verified Across All 9 Authenticated Stitch Screens)*

Note: Stitch prose mentioned `240px`, whereas **all 9 authenticated Stitch HTML screens** implement `w-[232px]` (`232px`) and `h-12` (`48px`). We standardize on the implemented `232px` / `48px` dimensions:
- **Left Sidebar (`232px` fixed width on desktop `>= 1024px`):**
  - Background `#11161F`, right border `1px solid #1E293B`.
  - Top brand header (`48px` height): **RELAY** logo mark + wordmark.
  - Scrollable 3-group navigation list.
  - Bottom footer: User avatar initials, name, and role/title.
- **Topbar (`48px` fixed height):**
  - Background `#11161F`, bottom border `1px solid #1E293B`.
  - Left: Mobile drawer toggle (`< 1024px`) + breadcrumb (`Workspace / Overview`, etc.).
  - Right: Compact search trigger (`⌘K Search tasks, reports...`, `whitespace-nowrap`), active worker status indicator, and quick action where applicable.
- **Main Content Area:**
  - Background `#0B0E14`, independent vertical scroll.

---

## 7. Sidebar Groups & Navigation *(Approved)*

| Group | Item | Route | Notes |
| :--- | :--- | :--- | :--- |
| **Workspace** | Overview | `/` | Dashboard |
| **Workspace** | AI Workspace | `/workspace` | Structured task delegation |
| **Workspace** | My Tasks | `/tasks` | Task history & filtering |
| **Workspace** | Reports | `/reports` | Generated reports list & detail |
| **Management** | Approvals | `/approvals` | Shows pending count badge (e.g., `3`) |
| **Management** | Team | `/team` | Organization members & roles |
| **Personal** | Profile | `/profile` | User profile & active org switcher |
| **Personal** | Settings | `/settings` | Workspace & motion preferences |

*Additional Routes:* `/login` (outside `AppShell`), `/tasks/:id` (Task Execution, highlights `My Tasks`), `/reports/:id` (Report Detail, highlights `Reports`).

---

## 8. Shared UI Component Specifications

All shared primitives live in `frontend/src/components/`:
- **`Button`:** `6px` radius, `whitespace-nowrap`, `13px`–`14px` Inter `500`. Variants: Primary (`#06B6D4` bg, `#0B0E14` text), Secondary (`#18202C` bg, `1px solid #2D3B4E`, `#F1F5F9` text), Ghost, Danger (`#EF4444`).
- **`StatusBadge`:** `4px` radius, `JetBrains Mono` `11px`, `whitespace-nowrap`, `1px` border, semantic color tint.
- **`MetricCard`:** `#11161F` bg, `1px solid #1E293B`, `6px` radius, uppercase `11px` `#64748B` label, `24px` `#F1F5F9` `tabular-nums` value, status/delta subtext.
- **`DataTable`:** `#11161F` container, `1px solid #1E293B` border, `6px` radius, `#18202C` row hover, `40px`–`48px` rows, monospace IDs and timestamps.
- **`Input` / `Textarea` / `Select`:** `#18202C` bg, `1px solid #1E293B` (`#06B6D4` focus), `6px` radius, `#F1F5F9` text, `#64748B` placeholder.
- **`Tabs` & `SplitPane`:** Border-bottom tab indicators (`#06B6D4` active) and `1px solid #1E293B` vertical split dividers (used in Task Execution and Reports).
- **`SlideOverDrawer`:** `#11161F` panel with `1px solid #1E293B` left border for inspecting Evidence or Subtask details.
- **`ErrorBanner` & `EmptyState`:** Standardized rendering for API errors (`{ error: { code, message, details } }`) and zero-data states.

---

## 9. All 10 Screen Layouts & Key Interactions

1. **Login (`/login` — `relay_enterprise_login`):**
   - Split 50/50 desktop layout: Left auth form (`#11161F` / `#0B0E14`, email, password with show/hide toggle, `Sign in` primary CTA, `Continue with Enterprise SSO` secondary button); Right 3D viewport over `#0B0E14` with bottom status bar (`SYSTEM OPERATIONAL | RELAY CORE`).
   - Interactions: Supabase Auth sign-in, validation/error display, redirect to `/` on session.
2. **Dashboard — Overview (`/`, `relay_overview_dashboard`):**
   - Header (`Overview` + `+ Delegate Task` CTA), 4-column `MetricCard` row, 2-column body: Left `Live Workforce Activity` table (`ID`, `TASK`, `ACTIVE STAGE`, `PROGRESS`, `ACTION`); Right stacked `Pending Approvals` quick-review cards + `Recent Deliverables` list.
3. **AI Workspace (`/workspace`, `relay_ai_workspace`):**
   - Centered structured delegation console (`max-w-[860px]`): `NEW DELEGATION BRIEF` composer with parameter chips (`Region`, `Entities`, `Depth`, `Sources`) and `Delegate Task ->` CTA; `SUPERVISOR PLAN PREVIEW` showing the 5 stages (`01 Discovery` -> `05 Verification / Report Generator`); `WORKFLOW TEMPLATES` section.
   - *MVP Scope Guard:* Only **Sales Prospect Research** is active for MVP; any additional preset cards shown in Stitch (`Competitor Pricing Matrix`, `Vendor Due Diligence`) must be omitted or clearly marked deferred/unavailable.
   - Interactions: `POST /api/v1/tasks` with `idempotency_key`, redirect/link to `/tasks/:id`.
4. **Task Execution (`/tasks/:id`, `relay_task_rly_104_observability`):**
   - Task header bar (`RLY-104`, title, live status badge, elapsed timer, `Cancel` button); split workspace: Left/center **React Flow** DAG canvas with dark zoom/fit controls and status legend; Right `SELECTED WORKER` inspector with `Live Logs` / `Evidence` / `Output JSON` tabs and bottom `SSE CONNECTED` indicator.
   - *Contract Guard:* Stitch shows a `Pause` button; `API_INTEGRATION_CONTRACTS.md` only defines `POST /api/v1/tasks/{id}/cancel`. Omit `Pause` unless Member 2 adds a pause endpoint.
5. **My Tasks (`/tasks`, `relay_my_tasks`):**
   - Filter bar (search + status tabs/select) and full-width `DataTable` of tasks with status badges, timestamps, durations, and row click -> `/tasks/:id`.
6. **Reports (`/reports` & `/reports/:id`, `relay_research_report_rly_104`):**
   - List view + 3-column Report Detail view: Left `CONTENTS` anchor nav + summary metrics (`Entities`, `Sources Checked`, `Confidence/Verification`); Center structured report body; Right `VERIFICATION EVIDENCE` panel (`[CRUSTDATA]`, `[OLOSTEP]`, `[VERIFIER]` cards with source links).
   - *MVP Report Completeness:* Center report body must render all **9 required sections**: Executive Summary, Company Profile, Company Information, Business Overview, Potential Fit (rubric breakdown), Comparison (matrix), Research Evidence, Information Gaps, Final Analysis—clearly distinguishing **Verified Facts** from **AI-Generated Assessments**.
   - Interactions: `GET /api/v1/reports/{id}`, `GET /api/v1/reports/{id}/evidence`, `GET /api/v1/reports/{id}/export`.
7. **Approvals (`/approvals`, `relay_approvals`):**
   - Split/queue layout: Pending & resolved approval items with task context, requester, and `Approve` / `Reject` actions (`POST /api/v1/approvals/{id}/approve|reject`).
8. **Team (`/team`, `relay_team`):**
   - Organization member directory `DataTable` (`GET /api/v1/team/members`) with role badges, department, and search/filter.
9. **Profile (`/profile`, `relay_profile`):**
   - User identity card (`GET /api/v1/profile`), editable profile form (`PATCH /api/v1/profile`), and active organization switcher (`GET /api/v1/auth/organizations`, `POST /api/v1/auth/active-organization`).
10. **Settings (`/settings`, `relay_settings`):**
    - Workspace & display preferences (`GET /api/v1/settings`, `PATCH /api/v1/settings`), reduced-motion toggle, and sign-out action.

---

## 10. 3D Visualization & React Flow Requirements

### React Flow (Task Execution Graph — *Approved*)
- Driven strictly by backend `GET /api/v1/tasks/{id}/subtasks` and persisted SSE events (`plan.created`, `subtask.updated`, `worker.*`, `tool.*`, `verification.completed`, `report.ready`, `task.failed`).
- Never invent decorative statuses or fake agent activity.
- Dark-styled nodes (`#11161F`/`#18202C`, `1px solid #1E293B`, `6px` radius, `JetBrains Mono` IDs/timings) and dark-styled React Flow controls/minimap.

### Login 3D Scene: Approved Baseline vs. Pending Proposal
- **Approved Baseline (`AGENTS.md` & `MASTER_DEVELOPMENT_BLUEPRINT.md`):** **Spline** (`@splinetool/react-spline`) is the currently approved 3D technology for the Login identity scene (and compact Dashboard visualization), and `AGENTS.md` currently prohibits React Three Fiber. Even the Stitch Login screenshot displays `[ 3D SPLINE VIEWPORT - DARK MATTE RELAY STRUCTURE ]`.
- **Pending Team Approval (Newer Proposal — React Three Fiber):** A newer frontend handoff proposes replacing Spline with **React Three Fiber** on the Login screen only:
  - Three-tier architectural relay stack (Supervisor top, 5 orbiting worker cubes middle, verification plinth bottom, 4 vertical conduits).
  - Slow downward cyan (`#06B6D4`) pulses, matte gunmetal material, no bloom, transparent canvas, damped mouse tilt.
  - Lazy-loaded (`React.lazy` + `Suspense`) with static SVG/CSS fallback.
- **Implementation Rule:** Do **not** install React Three Fiber until the team formally approves updating `AGENTS.md` and `MASTER_DEVELOPMENT_BLUEPRINT.md`. Build the Login 3D container with a clean lazy-loaded boundary + static fallback so either Spline (approved baseline) or R3F (if approved) can plug in cleanly.

---

## 11. Responsive, Accessibility, States & Backend Rules

- **Responsive:** Desktop (`>= 1024px`) persistent `232px` sidebar + multi-column grids; Tablet (`768px`–`1023px`) collapsible drawer sidebar + stacked split panes; Mobile (`< 768px`) off-canvas sidebar drawer, single-column cards, scrollable tables, static Login 3D fallback.
- **Accessibility & Reduced Motion:** WCAG 2.1 AA contrast; keyboard navigation with `2px solid #06B6D4` focus-visible rings; `MotionConfig reducedMotion="user"` for Framer Motion; static fallback for 3D and disabled pulse animations when `prefers-reduced-motion: reduce`.
- **Loading, Empty & Error States:** Flat `#18202C` skeleton blocks (`6px` radius); bordered `#11161F` empty states with primary action; standardized `{ error: { code, message, details } }` `ErrorBanner` handling `401`, `403`, `404`, `409`, `422`, `429`, `500`, `502`, `503`; non-blocking SSE connection indicator with `Last-Event-ID` + `GET /api/v1/tasks/{id}` reconciliation.
- **Backend-Driven Data:** All requests use `/api/v1/*` with `Authorization: Bearer <token>`; authenticated `fetch`-based SSE only (never tokens in URL query params); never trust client-supplied `user_id`/`organization_id`; never render raw untrusted HTML from scraped web evidence.

---

## 12. Practical React & TypeScript Implementation Guidance

- **Folder Structure (`frontend/src/`):** `assets/`, `components/`, `context/`, `hooks/`, `layouts/`, `pages/`, `services/`, `types/`, `utils/`.
- **Typing:** `strict: true`; mirror backend Pydantic schemas in `frontend/src/types/` (no `any` in domain/API types).
- **Data Fetching:** Centralize `fetch` wrapper in `services/apiClient.ts`, authenticated SSE reader in `services/sseClient.ts`, and TanStack Query hooks in `hooks/`.
- **Component Reuse:** Build `AppShell`, `StatusBadge`, `MetricCard`, `DataTable`, `SlideOverDrawer`, `ErrorBanner`, and `EmptyState` first so all 10 screens compose from a single set of primitives.
