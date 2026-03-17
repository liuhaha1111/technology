# Address Manual Entry + Admin Module Loading Reliability Design

## Scope

This design covers two user-facing issues:

1. Unit registration address cannot be completed when region options are incomplete.
2. Admin system pages show generic "load failed" for multiple modules in local development.

## Goals

- Keep current province/city/district cascading selects, but allow manual fallback input.
- Ensure local development does not depend on live Supabase by default.
- Make admin frontend errors actionable instead of generic failures.

## Non-Goals

- No redesign of page layout.
- No replacement of existing API contracts.
- No production behavior change for auth mode defaults.

## Design

### 1) Unit Address Input: Select + Manual Toggle

Component: `frontend/src/components/UnitAuthModal.tsx`

- Add address mode state: `select` and `manual`.
- Default mode: `select` (existing behavior preserved).
- Add toggle control: "Manual address entry".
- In `manual` mode:
  - show text fields: `provinceName`, `cityName`, `districtName`.
  - skip region API dependence for submission.
- Submission mapping:
  - `select`: keep existing `provinceCode/cityCode/districtCode` and names from selected options.
  - `manual`: send text values in both `*Code` and `*Name` fields so backend required fields are satisfied.

Validation:

- `select`: all three selected codes required.
- `manual`: all three manual text values required.

### 2) Backend Runtime Mode for Local Reliability

Files:
- `admin-system/admin-backend/src/lib/runtime.ts`
- `admin-system/admin-backend/src/routes/auth.ts`
- `admin-system/admin-backend/src/routes/captcha.ts`
- `admin-system/admin-backend/src/routes/public.ts`

Rules:

- `test` => mock enabled.
- `production` => mock disabled.
- `development` default => mock enabled.
- Explicit override via `ADMIN_BACKEND_MOCK_MODE=true/false`.

Expected outcome:

- Captcha and region endpoints are available in local dev without Supabase dependency.
- Admin login can return deterministic mock tokens in local dev.

### 3) Admin Frontend Error Handling Hardening

File: `admin-system/admin-frontend/src/lib/api-client.ts`

- Parse backend envelope on non-2xx and throw an error containing `status`, `code`, `message`.
- On 401/403:
  - clear local session keys,
  - trigger redirect to `/login`.
- Keep existing API surface unchanged for page components.

Expected outcome:

- Pages no longer silently fail with opaque errors.
- Session expiry/unauthorized states recover predictably.

## Test Plan

Backend:
- `mock-mode-dev.test.ts` validates dev default mock behavior and auth/captcha availability.
- full backend test suite and build must pass.

Frontend:
- add tests for UnitAuthModal manual mode validation and payload mapping.
- add tests for api-client 401/403 behavior and message extraction.
- frontend build must pass.

## Rollout Notes

- This is backward-compatible for production.
- Local developers can still force real mode with `ADMIN_BACKEND_MOCK_MODE=false`.
