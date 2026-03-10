# Unified Workflow Portal Design

**Date:** 2026-03-10  
**Scope:** Replace portal static module data with a unified workflow engine backed by Supabase, with role-based permissions and attachment storage.

## Goal
Build a production-grade, unified workflow backend + frontend for all `/app` modules, using Supabase for data storage and Storage for attachments. Unit users can submit and view their own records; principal users can review and approve/reject/archivize.

## Architecture
- **Backend:** Extend `admin-system/admin-backend` with workflow services and routes. Keep existing portal auth flows and admin routes intact.
- **Database:** New migration in `admin-system/database/supabase/migrations/` adding workflow tables and Storage bucket config.
- **Storage:** Supabase Storage bucket `workflow-attachments` (private). Backend generates signed URLs for downloads.
- **Frontend (portal):** Replace module pages in `frontend/src/pages/*` with a unified workflow UI that fetches data via the new API. The `/login` page will use the portal login API with captcha.

## Data Model (Supabase)
### workflow_modules
- `module_key` (PK, text)
- `name` (text)
- `sort_order` (int)
- `is_active` (boolean)

### workflow_records
- `id` (uuid PK)
- `module_key` (FK to workflow_modules)
- `title` (text)
- `project_code` (text)
- `owner_org_id` (FK to organizations)
- `owner_org_name` (text, denormalized snapshot)
- `contact_person` (text)
- `contact_phone` (text)
- `amount` (numeric(12,2))
- `status` (text, check: `draft`, `submitted`, `under_review`, `approved`, `rejected`, `archived`)
- `submitted_at`, `reviewed_at`, `decided_at`, `archived_at` (timestamptz)
- `created_by_auth_user_id` (uuid)
- `created_by_account_type` (`unit` or `principal`)
- `created_at`, `updated_at`
- `extra_data` (jsonb, reserved for future extensions)

### workflow_attachments
- `id` (uuid PK)
- `record_id` (FK to workflow_records)
- `file_name`, `mime_type`, `size_bytes`
- `storage_path` (bucket key)
- `uploaded_by_auth_user_id`
- `created_at`

### workflow_status_events
- `id` (uuid PK)
- `record_id` (FK)
- `from_status`, `to_status`
- `actor_auth_user_id`
- `actor_account_type`
- `note`
- `created_at`

Notes:
- Existing `application_templates` remains for Project Declaration.
- `ProjectDeclaration` will store its `template_id` inside `workflow_records.extra_data`.
- Existing `declaration_forms` can remain for backward compatibility, but the new UI reads/writes `workflow_records`.

## API Design
### Portal auth (existing)
- `POST /api/v1/portal/captcha`
- `POST /api/v1/portal/unit/register`
- `POST /api/v1/portal/unit/login`
- `POST /api/v1/portal/principal/register`
- `POST /api/v1/portal/principal/login`
- `GET /api/v1/portal/profile`

### Workflow modules
- `GET /api/v1/portal/workflow/modules`

### Workflow records
- `GET /api/v1/portal/workflow/records?module_key=&status=&mine=`
- `POST /api/v1/portal/workflow/records` (unit create draft)
- `PATCH /api/v1/portal/workflow/records/:id` (unit edit draft)
- `POST /api/v1/portal/workflow/records/:id/submit` (unit)
- `POST /api/v1/portal/workflow/records/:id/review` (principal)
- `POST /api/v1/portal/workflow/records/:id/approve` (principal)
- `POST /api/v1/portal/workflow/records/:id/reject` (principal)
- `POST /api/v1/portal/workflow/records/:id/archive` (principal)

### Attachments
- `POST /api/v1/portal/workflow/records/:id/attachments`
- `GET /api/v1/portal/workflow/records/:id/attachments`
- `DELETE /api/v1/portal/workflow/attachments/:id`

### Admin (back-office)
- `GET /api/v1/admin/workflow/modules`
- `PATCH /api/v1/admin/workflow/modules` (enable/disable, reorder)

## Frontend/UI Design
- All `/app/*` pages use a shared workflow UI:
  - Summary cards by status
  - Table columns: `title`, `project_code`, `owner_org`, `contact_person`, `contact_phone`, `amount`, `submitted_at`, `status`
  - Actions: view, edit, submit, download, delete (unit); review, approve, reject, archive, download (principal)
- Unified create/edit modal with required fields + attachment upload section.
- Unified detail drawer with status history and attachments.
- `/login` uses portal login API and captcha.

## Permissions & Status Transitions
- Unit:
  - Create/edit draft
  - Submit draft
  - View only own org records
- Principal:
  - View all records
  - Review, approve/reject, archive
- Valid transitions:
  - `draft -> submitted` (unit)
  - `submitted -> under_review` (principal/system)
  - `under_review -> approved|rejected` (principal)
  - `approved -> archived` (principal/system)

## Error Handling
Use consistent `{ code, message }` errors. Return `409` on invalid status transitions. Frontend shows toast and inline errors.

## Testing
- Backend unit tests for workflows, permissions, and transitions.
- Frontend tests for permission visibility and API integration.

## Deployment Notes
- Run new Supabase migration.
- Create Storage bucket `workflow-attachments` (private).
- Update portal env `VITE_PORTAL_API_BASE_URL` if needed.

## Non-Goals
- Module-specific schema beyond `extra_data`.
- New business logic outside unified workflow and existing portal flows.
