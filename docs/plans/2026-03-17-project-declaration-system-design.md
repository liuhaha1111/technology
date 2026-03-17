# Project Declaration System Design

## Context

The current `frontend/src/pages/ProjectDeclaration.tsx` in the active feature worktree is still a static demonstration page. The newer declaration CRUD flow already exists in the main workspace, but it only supports a compact draft form and does not provide the full in-page declaration system experience required by `submit.tsx`.

The backend test baseline in this worktree is also incomplete: declaration flow tests expect `/api/v1/captcha`, `/api/v1/public/*`, and `/api/v1/admin/*` endpoints, but the corresponding routers are not mounted in the current `admin-system/admin-backend/src/app.ts`.

## Goals

- Keep users on the existing `/app/declaration` page.
- Replace the compact editor with an embedded declaration system visually modeled on `submit.tsx`.
- Preserve existing declaration CRUD and PDF download semantics.
- Generate a PDF from submitted content through the backend download endpoint.
- Show all declarations in `我的申报书`, with `draft` records editable/deletable and submitted records viewable only.
- Fix the backend declaration-flow baseline in this worktree so the required public/admin declaration APIs are reachable.

## Non-Goals

- No new frontend route for declaration editing.
- No client-side PDF generation.
- No redesign of unrelated portal pages.
- No schema redesign beyond what current declaration `content` can already store.

## UI Design

### Main Page Structure

`ProjectDeclaration` remains the route entry page and keeps the four existing tabs:

- `填报申报书`
- `我的申报书`
- `提交申报书`
- `打印申报书`

Inside the `填报申报书` tab:

1. Default view shows the template list.
2. Clicking `填报` switches the page into an embedded declaration editor.
3. Clicking `编辑` on a draft from `我的申报书` opens the same editor in edit mode.

### Embedded Declaration Editor

The editor mirrors `submit.tsx` structurally:

- Left step navigation
- Top stepper bar
- Large central white form surface
- Bottom sticky action bar with:
  - `返回列表`
  - `上一步`
  - `暂存草稿`
  - `下一步`
  - final-step `提交审核`

The editor is rendered inside the current page, not as a separate route.

### My Declarations Behavior

`我的申报书` lists all declarations:

- `draft`: `编辑`, `删除`
- `submitted`, `accepted`, `rejected`: `查看PDF`

`提交申报书` remains a filtered draft list and `打印申报书` remains a filtered submitted/non-draft list for convenience.

## Data Model

Declaration payload stays inside the existing `content` JSON shape and expands to:

- `meta`
  - `currentStep`
  - `savedAt`
- `form`
  - `basicInfo`
  - `unitInfo`
  - `personnel`
  - `overview`
  - `research`
  - `schedule`
  - `performance`
  - `budget`
- `templateSnapshot`

Older compact declarations are still supported. Missing sections are defaulted when the editor loads legacy data.

## Save and Submit Flow

### Save Draft

- `暂存草稿` creates or updates a declaration with `status: draft`.
- Entire multi-step form state is persisted into `content`.

### Submit for Review

- Final-step `提交审核` first saves the latest content.
- The declaration status is then updated to `submitted`.
- Submitted declarations are no longer deletable from the UI.

## PDF Strategy

PDF generation remains server-driven:

- frontend calls `GET /api/v1/public/declarations/:id/download`
- backend flattens stored declaration content and returns a PDF payload

This keeps existing admin-side viewing and download semantics intact.

## Backend Baseline Root Cause

The current worktree backend fails declaration-flow tests because the declaration routers are not exposed from `app.ts`, and supporting portal-auth plumbing is incomplete in this branch. The failure is route availability, not declaration business logic.

## Testing Strategy

### Backend

Primary regression file:

- `admin-system/admin-backend/tests/management-flow.test.ts`

Coverage required:

1. captcha endpoint is reachable
2. organization registration and review flow works
3. template publish/public query works
4. declaration CRUD works
5. non-draft declarations cannot be deleted
6. PDF download still returns `application/pdf`

### Frontend

Portal verification focuses on:

1. `/app/declaration` still builds cleanly
2. template list can enter embedded editor mode
3. draft save/edit roundtrip works
4. submit moves records into submitted view
5. `我的申报书` enforces `draft` delete only and submitted `查看PDF` only

## Files Expected To Change

Frontend:

- `frontend/src/pages/ProjectDeclaration.tsx`
- `frontend/src/pages/project-declaration/*`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/session.ts`
- `frontend/src/components/RequirePortalAuth.tsx`
- possibly `frontend/src/App.tsx`

Backend:

- `admin-system/admin-backend/src/app.ts`
- `admin-system/admin-backend/src/middleware/auth.ts`
- `admin-system/admin-backend/src/middleware/rbac.ts`
- `admin-system/admin-backend/src/routes/captcha.ts`
- `admin-system/admin-backend/src/routes/public.ts`
- `admin-system/admin-backend/src/routes/admin-management.ts`
- `admin-system/admin-backend/src/lib/runtime.ts`
- `admin-system/admin-backend/src/services/management-service.ts`
- `admin-system/admin-backend/tests/management-flow.test.ts`
