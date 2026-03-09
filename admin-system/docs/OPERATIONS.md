# Admin System Operations

## Routine Operations

- Check backend health: `GET /api/v1/health`
- Check frontend availability: open `http://localhost:3100`
- Review audit log API: `GET /api/v1/audits`

## Data Backup

- Database backup strategy: use Supabase/Postgres dump on schedule
- Backup minimum scope:
  - `admin_users`
  - `user_roles`
  - `projects`
  - `project_reviews`
  - `audit_logs`
  - `daily_metrics`

## Incident Troubleshooting

### 1. Frontend cannot login

- Verify backend is running on `3200`
- Verify `VITE_ADMIN_API_BASE_URL`
- Verify Supabase Auth service is healthy

### 2. API returns `401/403`

- Confirm token exists in browser storage
- Confirm role permissions include requested action
- Confirm org scope restrictions are expected

### 3. Missing business data

- Check if migration/seed scripts were applied
- Confirm module key exists in `feature_modules`
- Confirm records match caller `org_unit_id`

## Log and Audit Handling

- Keep API logs and `audit_logs` aligned with `requestId`
- Store error events with action/resource metadata
- Retain minimum 180 days for production
