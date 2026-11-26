# RELAY — API & Integration Contracts

> **Product:** RELAY — Enterprise AI Workforce Platform  
> **Status:** Shared Technical Contract (Pre-Implementation). Endpoints, schemas, and tool names are **Proposed** and awaiting implementation validation unless marked **Established**.

This document is the single source of truth for interfaces between the **Frontend**, **Backend**, **AI Agents**, and **External Integrations**.

---

## A. API Conventions

- **Base Prefix:** `/api/v1`
- **Protocol & Format:** HTTP/REST with `application/json` request and response bodies (plus `text/event-stream` for SSE).
- **HTTP Methods:**
  - `GET` — Read resources (idempotent, no side effects)
  - `POST` — Create resources or trigger state-changing actions
  - `PATCH` — Partial resource updates
- **Authentication Header:** `Authorization: Bearer <supabase_access_token>` on all protected endpoints.
- **Validation:** All request and response payloads are validated using **Pydantic v2** schemas in FastAPI.
- **Pagination:** *(Pending Validation)* Exact cursor/offset query parameters (`limit`, `offset`, or `cursor`) and envelope metadata will be finalized during backend API scaffolding.
- **Idempotency:** `POST /api/v1/tasks` accepts an `idempotency_key` string to prevent duplicate task creation on network retries.
- **Error Format:** All `4xx`/`5xx` errors return the standardized JSON error envelope defined in [Section G](#g-error-contract).

---

## B. Authentication Contract

1. **Client Sign-In:** The frontend authenticates users via **Supabase Auth** and obtains a short-lived Supabase JWT (`access_token`).
2. **API Requests:** The frontend attaches `Authorization: Bearer <access_token>` to every `/api/v1/*` request.
3. **Backend Verification:** The FastAPI `auth/` module verifies the JWT signature, expiration, and claims.
4. **Identity & Organization Resolution:** The backend resolves `user_id`, active `organization_id`, and effective `roles`/`permissions` from `user_profiles`, `organization_memberships`, and RBAC tables.
5. **Security Invariant:** Client-supplied `user_id` or `organization_id` values in request bodies or query parameters are **never trusted** for authorization or tenant scoping.

---

## C. Task Creation Contract *(Proposed)*

### `POST /api/v1/tasks`

**Request Body:**
```json
{
  "conversation_id": "conversation-uuid",
  "message": "Find five promising software companies in India and prepare a prospect report.",
  "attachments": [],
  "idempotency_key": "unique-request-key"
}
```

**Response (`202 Accepted`):**
```json
{
  "task_id": "task-uuid",
  "conversation_id": "conversation-uuid",
  "status": "queued",
  "created_at": "2026-11-26T12:00:00Z",
  "message": "Your task has been submitted."
}
```

**Notes:**
- `user_id` and `organization_id` are resolved exclusively by the backend from the verified JWT and active organization membership.
- Submitting a duplicate `idempotency_key` within the same organization/user scope should return the existing task rather than spawning a duplicate execution.

---

## D. SSE Event Contracts *(Proposed)*

### Endpoint: `GET /api/v1/tasks/{id}/events`

**Client Authentication Requirement:**
- Native browser `EventSource` **cannot** attach arbitrary `Authorization` headers.
- The frontend **must** use an authenticated `fetch`-based SSE client (or an appropriately designed secure session mechanism) to send `Authorization: Bearer <access_token>`.
- **Never** pass access tokens in URL query parameters.

### Proposed SSE Event Names
- `task.status` — Top-level task status transitions (e.g., `queued` -> `planning` -> `running` -> `completed`).
- `plan.created` — Supervisor/Planner generated the execution plan and subtasks.
- `subtask.updated` — Subtask status or progress changed.
- `worker.started` — A task-scoped worker instance began execution.
- `worker.completed` — A worker instance finished and returned structured output.
- `tool.started` — Tool Executor began an authorized tool call.
- `tool.completed` — Tool Executor finished a tool call (success or handled error).
- `approval.required` — Execution paused (`waiting_approval`) pending human review.
- `verification.completed` — Verification Engine finished validating evidence and claims.
- `report.ready` — Final report persisted and ready for viewing.
- `task.failed` — Task terminated with an error.

### Persistence & Reconnection
- Every emitted event is persisted in `task_events` with a monotonic/unique `event_id` (`id:` field in SSE) and `created_at` timestamp.
- On reconnect, the client may supply `Last-Event-ID` to replay missed events, and/or refetch `GET /api/v1/tasks/{id}` and `GET /api/v1/tasks/{id}/subtasks` to reconcile full state.

---

## E. Internal Agent Interfaces *(Proposed)*

### 1. Task Execution Entrypoint (Backend -> LangGraph Workflow)
```python
async def execute_task(
    task_id,
    organization_id,
    user_id,
    request,
    conversation_id
):
    ...
```

### 2. Worker Instantiation (Supervisor -> Worker Factory)
```python
async def create_worker(
    task_id,
    template_name,
    objective,
    allowed_tools,
    input_data
):
    ...
```

### 3. Centralized Tool Execution (Worker Runtime -> Tool Executor)
```python
async def execute_tool(
    tool_name,
    arguments,
    execution_context
):
    ...
```

**Trusted Execution Context:**
- `execution_context` is **backend-generated, trusted metadata** containing `organization_id`, `user_id`, `task_id`, `worker_instance_id`, and `allowed_tools`.
- Workers cannot forge `execution_context` or invoke tools outside `allowed_tools`.

### 4. Proposed Structured Worker Output
```json
{
  "worker_name": "Company Discovery Worker",
  "status": "completed",
  "data": {
    "companies": []
  },
  "evidence": [],
  "errors": []
}
```

---

## F. External Integration Contracts *(Proposed Tool Names)*

External provider adapters live in `backend/integrations/` and are invoked exclusively by the centralized `Tool Executor` in `backend/tools/`.

### Crustdata Proposed Tool Names
- `crustdata_search_companies`
- `crustdata_enrich_company`
- `crustdata_search_people`
- `crustdata_enrich_person`

### Olostep Proposed Tool Names
- `olostep_search_web`
- `olostep_scrape_page`

> **Pending Validation:** Provider-specific HTTP endpoint paths, exact request fields, response payload schemas, authentication header formats, and rate-limit/credit rules are **not** invented here and **require verification against current Crustdata and Olostep documentation and actual account access**.

---

## G. Error Contract *(Proposed)*

All API error responses use a consistent JSON envelope:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested task could not be found.",
    "details": {}
  }
}
```

### Standard HTTP Status Codes

| Status Code | Meaning | Typical Use Case |
| :--- | :--- | :--- |
| `200` | OK | Successful `GET` or `PATCH` request |
| `201` | Created | Resource created synchronously (e.g., conversation, message) |
| `202` | Accepted | Asynchronous task accepted and queued (`POST /api/v1/tasks`) |
| `400` | Bad Request | Malformed request or invalid state transition |
| `401` | Unauthorized | Missing, expired, or invalid Supabase JWT |
| `403` | Forbidden | Authenticated user lacks required role/permission or organization access |
| `404` | Not Found | Requested task, report, approval, or conversation does not exist (or is outside tenant scope) |
| `409` | Conflict | Idempotency conflict or incompatible state transition |
| `422` | Unprocessable Entity | Pydantic schema validation failure |
| `429` | Too Many Requests | Rate limit or quota exceeded |
| `500` | Internal Server Error | Unexpected backend failure |
| `502` | Bad Gateway | Upstream external provider (Gemini, Crustdata, Olostep) returned an invalid/failed response |
| `503` | Service Unavailable | Dependent service temporarily unavailable |

---

## H. Integration and Ownership Boundaries *(Established)*

| Boundary | Primary Owner | Rules & Constraints |
| :--- | :--- | :--- |
| **Frontend API & SSE Consumption** | **Member 1** | Consumes `/api/v1/*` only. **No direct calls to Gemini, Crustdata, or Olostep from the frontend.** |
| **API Routes & Centralized Tool Executor** | **Member 2** | Owns all FastAPI routes, JWT/RBAC enforcement, persistence, and the single `Tool Executor`. |
| **Supervisor & Agent Orchestration** | **Member 3** | Owns LangGraph `StateGraph`, Supervisor, Planner, Worker Factory, Worker Templates, Verification, and Synthesis. |
| **External Provider Adapters** | **Member 4** | Owns Crustdata and Olostep HTTP adapters in `backend/integrations/` and coordinates Pydantic tool schemas with Member 3. |

- **No Duplicate Tool Executors:** Member 4 must implement pure provider adapters and must **not** independently implement another Tool Executor.
