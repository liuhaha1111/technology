create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  unit_admin_auth_user_id uuid not null unique,
  unit_admin_email text not null,
  name text not null,
  social_credit_code text,
  contact_name text not null,
  contact_phone text not null,
  province_code text not null,
  province_name text not null,
  city_code text not null,
  city_name text not null,
  district_code text not null,
  district_name text not null,
  address text,
  department_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_comment text,
  reviewed_by uuid references public.admin_users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_status_idx on public.organizations(status);

create table if not exists public.principal_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  full_name text not null,
  id_type text not null,
  id_number text not null,
  phone text not null,
  is_unit_leader boolean not null default false,
  is_legal_representative boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists principal_profiles_org_idx on public.principal_profiles(organization_id);

create table if not exists public.captchas (
  id uuid primary key default gen_random_uuid(),
  captcha_id text not null unique,
  code text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists captchas_expires_idx on public.captchas(expires_at);

create table if not exists public.application_templates (
  id uuid primary key default gen_random_uuid(),
  plan_category text not null,
  project_category text not null,
  title text not null,
  source_name text,
  guide_unit text,
  contact_phone text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  file_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists application_templates_status_idx on public.application_templates(status);
create index if not exists application_templates_plan_idx on public.application_templates(plan_category);

create table if not exists public.declaration_forms (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  principal_profile_id uuid references public.principal_profiles(id),
  organization_id uuid references public.organizations(id),
  template_id uuid not null references public.application_templates(id),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'accepted', 'rejected')),
  form_data jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists declaration_forms_auth_idx on public.declaration_forms(auth_user_id);
create index if not exists declaration_forms_template_idx on public.declaration_forms(template_id);

create table if not exists public.region_catalog (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('province', 'city', 'district')),
  code text not null unique,
  name text not null,
  parent_code text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists region_catalog_level_parent_idx on public.region_catalog(level, parent_code);
