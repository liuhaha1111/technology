# Admin System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fully isolated production-grade admin system (`admin-system/`) with React frontend, Express backend, and local Supabase persistence, covering full business-module administration, RBAC, org isolation, analytics, and deployment docs.

**Architecture:** Use a strict three-layer flow: `admin-frontend (3100) -> admin-backend (3200) -> local Supabase`. Backend owns auth verification, RBAC checks, org-unit filtering, and audit logging; Supabase enforces RLS as defense-in-depth. Frontend never directly touches Supabase in v1.

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS, Express + TypeScript, Supabase JS SDK, Vitest + Supertest, Playwright (E2E), npm workspaces.

---

### Task 1: Scaffold Isolated Admin Workspace

**Files:**
- Create: `admin-system/package.json`
- Create: `admin-system/tsconfig.base.json`
- Create: `admin-system/.gitignore`
- Create: `admin-system/README.md`
- Create: `admin-system/admin-frontend/package.json`
- Create: `admin-system/admin-backend/package.json`
- Test: `admin-system/admin-backend/tests/smoke.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";

describe("workspace smoke", () => {
  it("has isolated package roots", () => {
    expect(process.env.npm_package_name).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/smoke.test.ts`  
Expected: FAIL because package/test runner is not configured.

**Step 3: Write minimal implementation**

- Add npm workspaces at `admin-system/package.json`
- Add backend/frontend package scripts (`dev`, `build`, `test`, `lint`)
- Add minimal Vitest config in backend

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/smoke.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/package.json admin-system/tsconfig.base.json admin-system/.gitignore admin-system/README.md admin-system/admin-frontend/package.json admin-system/admin-backend/package.json admin-system/admin-backend/tests/smoke.test.ts
git commit -m "chore(admin-system): scaffold isolated workspace"
```

### Task 2: Create Backend App Skeleton and Health Endpoint

**Files:**
- Create: `admin-system/admin-backend/src/app.ts`
- Create: `admin-system/admin-backend/src/server.ts`
- Create: `admin-system/admin-backend/src/routes/health.ts`
- Create: `admin-system/admin-backend/tests/health.test.ts`

**Step 1: Write the failing test**

```ts
import request from "supertest";
import { app } from "../src/app";
import { describe, it, expect } from "vitest";

describe("GET /api/v1/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("OK");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/health.test.ts`  
Expected: FAIL because app/route not defined.

**Step 3: Write minimal implementation**

```ts
// app.ts
app.use("/api/v1/health", healthRouter);
```

```ts
// health.ts
res.json({ code: "OK", message: "healthy", data: null, requestId: "local" });
```

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/health.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src admin-system/admin-backend/tests/health.test.ts
git commit -m "feat(admin-backend): add app skeleton and health endpoint"
```

### Task 3: Define Supabase Schema + Seed (RBAC + Org Isolation)

**Files:**
- Create: `admin-system/database/supabase/migrations/20260309_0001_core.sql`
- Create: `admin-system/database/supabase/migrations/20260309_0002_rls.sql`
- Create: `admin-system/database/supabase/seeds/seed_core.sql`
- Test: `admin-system/admin-backend/tests/schema-contract.test.ts`

**Step 1: Write the failing test**

```ts
it("exposes required core tables", async () => {
  const tables = await listTables();
  expect(tables).toEqual(
    expect.arrayContaining(["org_units", "admin_users", "roles", "permissions", "audit_logs"])
  );
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/schema-contract.test.ts`  
Expected: FAIL because tables do not exist.

**Step 3: Write minimal implementation**

- Create tables and constraints in `0001_core.sql`
- Add RLS policies by role/org in `0002_rls.sql`
- Seed default roles/permissions/admin org in `seed_core.sql`

**Step 4: Run test to verify it passes**

Run:
1. `npx supabase db reset --local` (from repo root, if local stack is up)  
2. `npm --prefix admin-system/admin-backend test -- tests/schema-contract.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/database/supabase/migrations admin-system/database/supabase/seeds admin-system/admin-backend/tests/schema-contract.test.ts
git commit -m "feat(database): add core schema rbac and rls"
```

### Task 4: Implement Auth Verification Middleware

**Files:**
- Create: `admin-system/admin-backend/src/lib/supabase.ts`
- Create: `admin-system/admin-backend/src/middleware/auth.ts`
- Create: `admin-system/admin-backend/src/routes/auth.ts`
- Create: `admin-system/admin-backend/tests/auth-me.test.ts`

**Step 1: Write the failing test**

```ts
it("rejects unauthenticated /auth/me", async () => {
  const res = await request(app).get("/api/v1/auth/me");
  expect(res.status).toBe(401);
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/auth-me.test.ts`  
Expected: FAIL because route/middleware missing.

**Step 3: Write minimal implementation**

- Add bearer token parser
- Verify token via Supabase Auth
- Return `401` with standard response on failure

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/auth-me.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src/lib/supabase.ts admin-system/admin-backend/src/middleware/auth.ts admin-system/admin-backend/src/routes/auth.ts admin-system/admin-backend/tests/auth-me.test.ts
git commit -m "feat(admin-backend): add supabase auth verification middleware"
```

### Task 5: Implement RBAC + Org Scope Guards

**Files:**
- Create: `admin-system/admin-backend/src/middleware/rbac.ts`
- Create: `admin-system/admin-backend/src/middleware/org-scope.ts`
- Create: `admin-system/admin-backend/tests/rbac-guard.test.ts`

**Step 1: Write the failing test**

```ts
it("returns 403 when role lacks permission", async () => {
  const res = await request(app).get("/api/v1/users").set("Authorization", "Bearer fake-viewer");
  expect(res.status).toBe(403);
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/rbac-guard.test.ts`  
Expected: FAIL because guard not implemented.

**Step 3: Write minimal implementation**

- Resolve user roles from `user_roles`
- Resolve required permissions from `role_permissions`
- Enforce org filter (`org_unit_id`) for non-super-admin

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/rbac-guard.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src/middleware/rbac.ts admin-system/admin-backend/src/middleware/org-scope.ts admin-system/admin-backend/tests/rbac-guard.test.ts
git commit -m "feat(admin-backend): enforce rbac and org scope guards"
```

### Task 6: Build Users/Roles/Permissions APIs

**Files:**
- Create: `admin-system/admin-backend/src/routes/users.ts`
- Create: `admin-system/admin-backend/src/routes/roles.ts`
- Create: `admin-system/admin-backend/src/services/users-service.ts`
- Create: `admin-system/admin-backend/tests/users-api.test.ts`

**Step 1: Write the failing test**

```ts
it("lists users with pagination", async () => {
  const res = await request(app).get("/api/v1/users?page=1&size=20").set("Authorization", "Bearer fake-admin");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.items)).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/users-api.test.ts`  
Expected: FAIL because route/service missing.

**Step 3: Write minimal implementation**

- Add `GET /users`, `POST /users`, `PUT /users/:id/roles`, `GET /roles`, `GET /permissions`
- Validate query/body with zod
- Enforce role-based access

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/users-api.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src/routes/users.ts admin-system/admin-backend/src/routes/roles.ts admin-system/admin-backend/src/services/users-service.ts admin-system/admin-backend/tests/users-api.test.ts
git commit -m "feat(admin-backend): add user role permission management apis"
```

### Task 7: Build Business Modules + Review Flow APIs

**Files:**
- Create: `admin-system/admin-backend/src/routes/modules.ts`
- Create: `admin-system/admin-backend/src/routes/projects.ts`
- Create: `admin-system/admin-backend/src/services/modules-service.ts`
- Create: `admin-system/admin-backend/tests/modules-api.test.ts`

**Step 1: Write the failing test**

```ts
it("returns records for declaration module", async () => {
  const res = await request(app).get("/api/v1/modules/declaration/records").set("Authorization", "Bearer fake-analyst");
  expect(res.status).toBe(200);
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/modules-api.test.ts`  
Expected: FAIL because route not implemented.

**Step 3: Write minimal implementation**

- Add `/modules/:moduleKey/records` generic list endpoint
- Add `/projects/:id/review` review transition endpoint
- Map all frontend business modules to `feature_modules`

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/modules-api.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src/routes/modules.ts admin-system/admin-backend/src/routes/projects.ts admin-system/admin-backend/src/services/modules-service.ts admin-system/admin-backend/tests/modules-api.test.ts
git commit -m "feat(admin-backend): add full business module management apis"
```

### Task 8: Build Analytics + Audit APIs

**Files:**
- Create: `admin-system/admin-backend/src/routes/analytics.ts`
- Create: `admin-system/admin-backend/src/routes/audits.ts`
- Create: `admin-system/admin-backend/src/services/analytics-service.ts`
- Create: `admin-system/admin-backend/tests/analytics-api.test.ts`

**Step 1: Write the failing test**

```ts
it("returns overview metrics", async () => {
  const res = await request(app).get("/api/v1/analytics/overview").set("Authorization", "Bearer fake-analyst");
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveProperty("usersTotal");
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/analytics-api.test.ts`  
Expected: FAIL because endpoints missing.

**Step 3: Write minimal implementation**

- Add `/analytics/overview`, `/analytics/trends`, `/analytics/funnel`
- Add `/audits` query endpoint
- Write audit event helper for critical operations

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/analytics-api.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-backend/src/routes/analytics.ts admin-system/admin-backend/src/routes/audits.ts admin-system/admin-backend/src/services/analytics-service.ts admin-system/admin-backend/tests/analytics-api.test.ts
git commit -m "feat(admin-backend): add analytics and audit apis"
```

### Task 9: Create Admin Frontend Shell + Auth Flow

**Files:**
- Create: `admin-system/admin-frontend/src/main.tsx`
- Create: `admin-system/admin-frontend/src/App.tsx`
- Create: `admin-system/admin-frontend/src/layout/AdminLayout.tsx`
- Create: `admin-system/admin-frontend/src/pages/LoginPage.tsx`
- Create: `admin-system/admin-frontend/src/lib/api-client.ts`
- Create: `admin-system/admin-frontend/src/tests/login-page.test.tsx`

**Step 1: Write the failing test**

```tsx
it("shows login form and validates required fields", async () => {
  render(<LoginPage />);
  await user.click(screen.getByRole("button", { name: /登录/i }));
  expect(screen.getByText(/请输入邮箱/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-frontend test -- src/tests/login-page.test.tsx`  
Expected: FAIL because app/test setup missing.

**Step 3: Write minimal implementation**

- Build login page and auth context
- Integrate `POST /api/v1/auth/login` + token storage
- Create header/sidebar/content shell with existing style language

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-frontend test -- src/tests/login-page.test.tsx`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-frontend/src admin-system/admin-frontend/package.json
git commit -m "feat(admin-frontend): add layout shell and auth flow"
```

### Task 10: Implement Frontend Management Pages (Users + Modules + Analytics + Audits)

**Files:**
- Create: `admin-system/admin-frontend/src/pages/UsersPage.tsx`
- Create: `admin-system/admin-frontend/src/pages/RolesPage.tsx`
- Create: `admin-system/admin-frontend/src/pages/BusinessModulesPage.tsx`
- Create: `admin-system/admin-frontend/src/pages/AnalyticsPage.tsx`
- Create: `admin-system/admin-frontend/src/pages/AuditsPage.tsx`
- Create: `admin-system/admin-frontend/src/tests/permission-visibility.test.tsx`

**Step 1: Write the failing test**

```tsx
it("hides user management menu for viewer role", () => {
  renderWithRole("viewer", <AdminLayout />);
  expect(screen.queryByText(/用户管理/i)).not.toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-frontend test -- src/tests/permission-visibility.test.tsx`  
Expected: FAIL because permission-driven menu not implemented.

**Step 3: Write minimal implementation**

- Implement page routes and tables/forms/charts
- Hook API calls for all modules
- Enforce menu/button-level permission visibility

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-frontend test -- src/tests/permission-visibility.test.tsx`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/admin-frontend/src/pages admin-system/admin-frontend/src/tests/permission-visibility.test.tsx
git commit -m "feat(admin-frontend): add full admin pages with permission visibility"
```

### Task 11: Add Deployment, Operations, and One-Click Scripts

**Files:**
- Create: `admin-system/docs/DEPLOYMENT.md`
- Create: `admin-system/docs/OPERATIONS.md`
- Create: `admin-system/scripts/dev-up.ps1`
- Create: `admin-system/scripts/verify.ps1`
- Test: `admin-system/admin-backend/tests/scripts-contract.test.ts`

**Step 1: Write the failing test**

```ts
it("verify script includes test build and lint", () => {
  const text = readFileSync("admin-system/scripts/verify.ps1", "utf8");
  expect(text).toMatch(/npm --prefix admin-backend test/);
  expect(text).toMatch(/npm --prefix admin-frontend run build/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix admin-system/admin-backend test -- tests/scripts-contract.test.ts`  
Expected: FAIL because scripts/docs missing.

**Step 3: Write minimal implementation**

- Provide startup sequence and env var docs
- Provide operations runbook and troubleshooting
- Implement `dev-up.ps1` and `verify.ps1`

**Step 4: Run test to verify it passes**

Run: `npm --prefix admin-system/admin-backend test -- tests/scripts-contract.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add admin-system/docs admin-system/scripts admin-system/admin-backend/tests/scripts-contract.test.ts
git commit -m "docs(admin-system): add deployment operations and verification scripts"
```

### Task 12: Final Verification Gate

**Files:**
- Verify only; no new files required

**Step 1: Run backend test suite**

Run: `npm --prefix admin-system/admin-backend test`  
Expected: PASS, 0 failures

**Step 2: Run frontend test suite**

Run: `npm --prefix admin-system/admin-frontend test`  
Expected: PASS, 0 failures

**Step 3: Run type-check/build**

Run:
1. `npm --prefix admin-system/admin-backend run build`
2. `npm --prefix admin-system/admin-frontend run build`

Expected: both exit code 0

**Step 4: Validate isolation**

Run: `git status --short`  
Expected: only files under `admin-system/` and `docs/plans/`

**Step 5: Commit**

```bash
git add admin-system docs/plans
git commit -m "feat(admin-system): deliver isolated production-grade admin platform"
```

