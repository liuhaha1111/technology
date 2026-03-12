# Address Manual Entry + Admin Loading Reliability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix address selection dead-ends in unit registration and eliminate admin module load failures in local development.

**Architecture:** Keep existing APIs and UI structure. Add frontend dual-mode address entry, backend deterministic dev mock mode routing, and stronger admin API client error/session handling.

**Tech Stack:** React + Vite + TypeScript, Express + TypeScript, Vitest + Supertest.

---

### Task 1: Add failing frontend tests for manual address mode

- Modify: `frontend/src/components/UnitAuthModal.tsx`
- Create: `frontend/src/components/__tests__/UnitAuthModal.manual-address.test.tsx`

TDD steps:
1. Add test asserting manual mode fields render and submit validation requires province/city/district text.
2. Run targeted test to fail.
3. Implement minimal UI mode toggle + manual field validation.
4. Re-run target test to pass.

### Task 2: Add failing tests for admin api-client error semantics

- Create: `admin-system/admin-frontend/src/tests/api-client-auth-errors.test.ts`
- Modify: `admin-system/admin-frontend/src/lib/api-client.ts`

TDD steps:
1. Add tests for parsing backend error payload and 401/403 session clear behavior.
2. Run targeted test to fail.
3. Implement minimal requestJson error object + unauthorized handling.
4. Re-run test to pass.

### Task 3: Backend runtime mode regression coverage

- Modify: `admin-system/admin-backend/tests/mock-mode-dev.test.ts`
- Modify: `admin-system/admin-backend/src/lib/runtime.ts`

TDD steps:
1. Add regression test for development default mock mode.
2. Run target test and verify fail.
3. Implement runtime decision rule.
4. Re-run target test and verify pass.

### Task 4: Verify full suites

Run:
- `npm --prefix admin-system/admin-backend test`
- `npm --prefix admin-system/admin-backend run build`
- `npm --prefix admin-system/admin-frontend test`
- `npm --prefix admin-system/admin-frontend run build`
- `npm --prefix frontend run build`

Expected: all pass.
