# Project Declaration System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an embedded project declaration system on `/app/declaration`, preserve draft/submission/PDF workflows, and restore the backend declaration-flow baseline required by the portal APIs.

**Architecture:** First restore the newer declaration-management backend/frontend baseline already present in the main workspace into the isolated worktree. Then add a dedicated declaration editor module under the portal frontend that stores a richer multi-step `content` payload while continuing to use the existing declaration CRUD and PDF download endpoints.

**Tech Stack:** React + Vite + TypeScript, Express + TypeScript, Vitest + Supertest.

---

### Task 1: Restore backend declaration-flow baseline

**Files:**
- Modify: `admin-system/admin-backend/src/app.ts`
- Modify: `admin-system/admin-backend/src/middleware/auth.ts`
- Modify: `admin-system/admin-backend/src/middleware/rbac.ts`
- Create: `admin-system/admin-backend/src/routes/captcha.ts`
- Create: `admin-system/admin-backend/src/routes/public.ts`
- Create: `admin-system/admin-backend/src/routes/admin-management.ts`
- Create: `admin-system/admin-backend/src/lib/runtime.ts`
- Modify: `admin-system/admin-backend/src/services/management-service.ts`
- Modify: `admin-system/admin-backend/src/services/users-service.ts`
- Test: `admin-system/admin-backend/tests/management-flow.test.ts`

TDD steps:
1. Run `npm test -- tests/management-flow.test.ts` in `admin-system/admin-backend` and confirm current 404 failures.
2. Add only the missing router/auth/runtime plumbing needed for the declared endpoints to exist.
3. Re-run `npm test -- tests/management-flow.test.ts`.
4. If failures remain, make the minimal service-layer fix required by the failing assertion.
5. Re-run until the declaration flow baseline is green.

### Task 2: Restore portal API/session baseline in frontend

**Files:**
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/lib/session.ts`
- Create: `frontend/src/components/RequirePortalAuth.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/AuthModal.tsx`
- Modify: `frontend/src/components/Header.tsx`
- Modify: `frontend/src/components/Sidebar.tsx`
- Modify: `frontend/src/components/UnitAuthModal.tsx`

TDD steps:
1. Run `npm run build` in `frontend` to keep a clean baseline.
2. Add the minimal portal API/session/auth-guard files required by the newer declaration page.
3. Re-run `npm run build`.
4. Fix only build-time integration errors introduced by the restored portal flow.

### Task 3: Add failing declaration editor regression coverage

**Files:**
- Create: `frontend/src/pages/project-declaration/declaration-editor.types.ts`
- Create: `frontend/src/pages/project-declaration/declaration-editor.utils.ts`
- Create: `frontend/src/pages/project-declaration/ProjectDeclarationEditor.tsx`
- Modify: `frontend/src/pages/ProjectDeclaration.tsx`

TDD steps:
1. Add a lightweight test harness or targeted validation utility tests for:
   - legacy declaration content parsing
   - editor payload serialization
   - action visibility rules in `我的申报书`
2. Run the targeted test and confirm failure.
3. Implement the minimal parser/serializer/action helpers.
4. Re-run the targeted test and confirm pass.

### Task 4: Implement embedded project declaration system UI

**Files:**
- Modify: `frontend/src/pages/ProjectDeclaration.tsx`
- Create: `frontend/src/pages/project-declaration/ProjectDeclarationEditor.tsx`
- Create: `frontend/src/pages/project-declaration/declaration-editor.types.ts`
- Create: `frontend/src/pages/project-declaration/declaration-editor.utils.ts`

TDD steps:
1. Add the editor entry-state expectation in the targeted tests or utility coverage.
2. Implement the embedded editor shell:
   - left step nav
   - top stepper
   - sticky footer actions
   - return to list behavior
3. Implement the multi-step state shape and form sections.
4. Wire draft save and submit actions to existing portal APIs.
5. Re-run targeted tests and `npm run build`.

### Task 5: Enforce declaration action rules and PDF viewing behavior

**Files:**
- Modify: `frontend/src/pages/ProjectDeclaration.tsx`
- Modify: `admin-system/admin-backend/src/services/management-service.ts`
- Test: `admin-system/admin-backend/tests/management-flow.test.ts`

TDD steps:
1. Add a backend regression asserting non-draft delete is rejected.
2. Run `npm test -- tests/management-flow.test.ts` and verify fail.
3. Implement the minimal service-layer restriction.
4. Update frontend row actions so:
   - `draft` => edit/delete
   - non-draft => view PDF only
5. Re-run backend test and frontend build.

### Task 6: Full verification

Run:
- `npm test -- tests/management-flow.test.ts`
- `npm run build` in `admin-system/admin-backend`
- `npm run build` in `frontend`

Expected:
- declaration management backend regression passes
- portal frontend builds cleanly
- embedded declaration editor compiles and declaration list actions match the approved behavior
