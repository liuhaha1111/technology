create index if not exists organizations_review_pending_idx
  on public.organizations(status, created_at desc)
  where status = 'pending';

alter table public.organizations
  drop constraint if exists organizations_review_consistency_chk;

alter table public.organizations
  add constraint organizations_review_consistency_chk
  check (
    (
      status = 'pending'
      and reviewed_at is null
      and reviewed_by is null
    )
    or
    (
      status in ('approved', 'rejected')
      and reviewed_at is not null
    )
  );
