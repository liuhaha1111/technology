# Admin Management Correctness Design (Org Register -> Review -> Login)

## Context

This design targets business correctness for the management backend flow:

1. Unit organization registration
2. Admin organization review
3. Unit login gate by organization status

The current code already implements this flow in `admin-system/admin-backend`, but it lacks strict state-transition semantics, stable error-code behavior for frontends, and explicit coverage for several edge cases.

## Goals

- Enforce explicit and deterministic organization status transitions.
- Ensure review operations are state-safe and idempotency-safe.
- Ensure login behavior is strictly bound to review outcome.
- Standardize API error codes for frontend-safe branching.
- Add test coverage for all key correctness and boundary scenarios.

## Non-Goals

- No UI redesign.
- No broad refactor of unrelated admin modules.
- No full migration to database triggers in this iteration.

## Domain Model Decisions

### Organization Status State Machine

- Allowed states: `pending`, `approved`, `rejected`.
- Registration always creates `pending`.
- Review only operates on `pending`.
- `pending -> approved` and `pending -> rejected` are allowed.
- Re-review on `approved` or `rejected` is rejected as invalid state.

### Review Write Semantics

A valid review must atomically update:

- `status`
- `review_comment`
- `reviewed_by`
- `reviewed_at`
- `updated_at`

No partial-review state is allowed.

### Login Gate Semantics

Unit login must pass two checks:

1. Credentials are valid.
2. Related organization exists and is `approved`.

If check #2 fails, login is blocked with stable business error codes:

- `ORG_NOT_FOUND`
- `ORG_PENDING`
- `ORG_REJECTED`

## Data Flow Design

### 1) Register Organization

Endpoint: `POST /api/v1/public/organizations/register`

Flow:

1. Validate payload.
2. Validate and consume captcha once.
3. Create auth user.
4. Insert organization record as `pending`.
5. If step 4 fails, delete the created auth user (compensation).

Expected behavior:

- Duplicate email returns conflict.
- Captcha cannot be reused.
- Captcha expiration is enforced.

### 2) Review Organization

Endpoint: `POST /api/v1/admin/organizations/:id/review`

Flow:

1. Require authenticated admin with `organizations.review`.
2. Validate decision payload.
3. Execute conditional update with `id=:id AND status='pending'`.
4. If no row updated, distinguish not-found vs invalid-state and return deterministic error code.

Expected behavior:

- Review is one-shot for a pending organization.
- Repeat review cannot silently overwrite an already reviewed decision.

### 3) Unit Login

Endpoint: `POST /api/v1/public/auth/unit/login`

Flow:

1. Validate and consume captcha.
2. Validate credentials.
3. Resolve organization by account.
4. Enforce organization status gate.
5. Return session tokens only if organization is `approved`.

Expected behavior:

- `pending` and `rejected` both block login, with distinct codes.

## Error Contract

All business errors in this flow return stable `code` values:

- `CAPTCHA_INVALID`
- `CAPTCHA_EXPIRED`
- `CAPTCHA_MISMATCH`
- `CONFLICT`
- `NOT_FOUND`
- `INVALID_STATE`
- `ORG_NOT_FOUND`
- `ORG_PENDING`
- `ORG_REJECTED`
- `UNAUTHORIZED`

Frontend behavior must branch on `code`, not localized message text.

## Persistence Guardrails

This iteration keeps most transition logic in service layer, with minimal DB hardening:

- Keep existing status `CHECK` constraints.
- Add/update indexes needed for review and login lookups.
- Add minimal consistency guardrails where low-risk (for example review-field consistency checks) without introducing heavy trigger logic.

## Testing Strategy

Primary test file: `admin-system/admin-backend/tests/management-flow.test.ts`

Required correctness scenarios:

1. Captcha can be issued and consumed once.
2. Organization registration creates `pending`.
3. Admin review allows `pending -> approved/rejected`.
4. Re-review on non-pending organization returns `INVALID_STATE`.
5. Unit login blocks with `ORG_PENDING`, `ORG_REJECTED`, and `ORG_NOT_FOUND`.
6. Unit login succeeds after approved review.
7. Conflict and rollback paths are covered (duplicate email, insert failure compensation behavior where testable in mock mode).

Verification commands:

- `npm --prefix admin-system/admin-backend test -- management-flow.test.ts`
- `npm --prefix admin-system/admin-backend test`
- `npm --prefix admin-system/admin-backend run build`

## Rollout Notes

- Deploy migration changes first, then backend.
- Monitor frequency of `INVALID_STATE`, `ORG_PENDING`, and `ORG_REJECTED` after release.
- If repeated invalid-state attempts are common, follow-up can add explicit re-review workflow with separate permission and audit reason requirements.
