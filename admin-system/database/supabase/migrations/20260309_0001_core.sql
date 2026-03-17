create extension if not exists "pgcrypto";

create table if not exists public.org_units (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  parent_id uuid references public.org_units(id),
  created_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  org_unit_id uuid not null references public.org_units(id),
  email text not null,
  display_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references public.admin_users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists public.feature_modules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_unit_id uuid not null references public.org_units(id),
  module_key text not null references public.feature_modules(key),
  title text not null,
  status text not null default 'draft',
  submitted_by uuid references public.admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_key text not null,
  stage_status text not null,
  reviewed_by uuid references public.admin_users(id),
  reviewed_at timestamptz,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reviewer_id uuid references public.admin_users(id),
  decision text not null,
  comments text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_unit_id uuid references public.org_units(id),
  actor_user_id uuid references public.admin_users(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  org_unit_id uuid references public.org_units(id),
  metric_date date not null,
  dimension text not null,
  name text not null,
  value numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (org_unit_id, metric_date, dimension, name)
);
