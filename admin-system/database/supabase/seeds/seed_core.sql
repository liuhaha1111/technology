insert into public.org_units (code, name)
values ('default-org', 'Default Organization')
on conflict (code) do nothing;

insert into public.roles (key, name, description)
values
  ('super_admin', 'Super Admin', 'Global full access'),
  ('admin', 'Admin', 'Org full management'),
  ('analyst', 'Analyst', 'Org analysis and review'),
  ('viewer', 'Viewer', 'Org read only')
on conflict (key) do nothing;

insert into public.permissions (key, module, action, description)
values
  ('users.read', 'users', 'read', 'Read users'),
  ('users.write', 'users', 'write', 'Write users'),
  ('roles.read', 'roles', 'read', 'Read roles'),
  ('roles.write', 'roles', 'write', 'Write roles'),
  ('modules.read', 'modules', 'read', 'Read module records'),
  ('modules.review', 'modules', 'review', 'Review module records'),
  ('analytics.read', 'analytics', 'read', 'Read analytics'),
  ('audits.read', 'audits', 'read', 'Read audit logs')
on conflict (key) do nothing;

insert into public.feature_modules (key, name)
values
  ('declaration', 'Project Declaration'),
  ('approval', 'Project Approval'),
  ('midterm', 'Midterm Inspection'),
  ('tech-report', 'Tech Report'),
  ('acceptance', 'Project Acceptance'),
  ('evaluation', 'Achievement Evaluation'),
  ('integrity', 'Integrity Review'),
  ('experts', 'Expert Management'),
  ('contracts', 'Contract Management'),
  ('fund-adjustment', 'Fund Adjustment'),
  ('unit-adjustment', 'Unit Adjustment'),
  ('extension', 'Extension Application'),
  ('termination', 'Termination Revocation'),
  ('record', 'Record System')
on conflict (key) do nothing;

with rp as (
  select r.id as role_id, p.id as permission_id
  from public.roles r
  join public.permissions p on (
    r.key = 'super_admin'
    or (r.key = 'admin' and p.key in ('users.read', 'users.write', 'roles.read', 'roles.write', 'modules.read', 'modules.review', 'analytics.read', 'audits.read'))
    or (r.key = 'analyst' and p.key in ('modules.read', 'modules.review', 'analytics.read', 'audits.read'))
    or (r.key = 'viewer' and p.key in ('modules.read', 'analytics.read'))
  )
)
insert into public.role_permissions (role_id, permission_id)
select role_id, permission_id
from rp
on conflict (role_id, permission_id) do nothing;