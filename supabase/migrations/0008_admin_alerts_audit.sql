-- Admin alerts + audit reports. See docs/BACKEND_API_SPEC.md §5, §6 (Admin Audit).

create table alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null check (severity in ('critical', 'warning')),
  source text not null check (source in ('system', 'sync', 'user_report')),
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_alerts_updated_at before update on alerts
  for each row execute function set_updated_at();

create table audit_reports (
  id uuid primary key default gen_random_uuid(),
  facility_name text not null,
  issue_type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  target_location text,
  region text,
  reporter text,
  is_urgent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_audit_reports_updated_at before update on audit_reports
  for each row execute function set_updated_at();

-- Backs the version-compare/restore endpoints (spec §6: GET .../:id/compare,
-- POST .../:id/versions/:versionId/restore).
create table audit_report_versions (
  id uuid primary key default gen_random_uuid(),
  audit_report_id uuid not null references audit_reports (id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);
create index audit_report_versions_report_id_idx on audit_report_versions (audit_report_id);
