-- Admin data / sync review. See docs/BACKEND_API_SPEC.md §6 (Admin Data / Sync
-- Review). `payload`/`changes_data` address the spec's flagged gap: consumer
-- code references more fields than the mock currently returns.

create table data_sync_requests (
  id uuid primary key default gen_random_uuid(),
  entity_name text not null,
  action text not null,
  description text,
  area text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'published')),
  review_notes text,
  node_id text,
  request_type text,
  payload jsonb,
  changes_data jsonb,
  reviewed_at timestamptz,
  reviewed_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_data_sync_requests_updated_at before update on data_sync_requests
  for each row execute function set_updated_at();
