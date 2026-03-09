create or replace function public.is_super_admin(p_auth_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    join public.user_roles ur on ur.user_id = au.id
    join public.roles r on r.id = ur.role_id
    where au.auth_user_id = p_auth_user_id
      and au.status = 'active'
      and r.key = 'super_admin'
  );
$$;

create or replace function public.same_org(p_auth_user_id uuid, p_org_unit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_super_admin(p_auth_user_id)
    or exists (
      select 1
      from public.admin_users au
      where au.auth_user_id = p_auth_user_id
        and au.status = 'active'
        and au.org_unit_id = p_org_unit_id
    );
$$;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.project_reviews enable row level security;
alter table public.audit_logs enable row level security;
alter table public.daily_metrics enable row level security;

drop policy if exists admin_users_select_policy on public.admin_users;
create policy admin_users_select_policy on public.admin_users
for select
using (public.same_org(auth.uid(), org_unit_id));

drop policy if exists admin_users_update_policy on public.admin_users;
create policy admin_users_update_policy on public.admin_users
for update
using (public.same_org(auth.uid(), org_unit_id))
with check (public.same_org(auth.uid(), org_unit_id));

drop policy if exists projects_select_policy on public.projects;
create policy projects_select_policy on public.projects
for select
using (public.same_org(auth.uid(), org_unit_id));

drop policy if exists projects_write_policy on public.projects;
create policy projects_write_policy on public.projects
for all
using (public.same_org(auth.uid(), org_unit_id))
with check (public.same_org(auth.uid(), org_unit_id));

drop policy if exists stages_select_policy on public.project_stages;
create policy stages_select_policy on public.project_stages
for select
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_id
      and public.same_org(auth.uid(), p.org_unit_id)
  )
);

drop policy if exists reviews_select_policy on public.project_reviews;
create policy reviews_select_policy on public.project_reviews
for select
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_id
      and public.same_org(auth.uid(), p.org_unit_id)
  )
);

drop policy if exists audit_select_policy on public.audit_logs;
create policy audit_select_policy on public.audit_logs
for select
using (public.same_org(auth.uid(), org_unit_id));

drop policy if exists metrics_select_policy on public.daily_metrics;
create policy metrics_select_policy on public.daily_metrics
for select
using (public.same_org(auth.uid(), org_unit_id));
