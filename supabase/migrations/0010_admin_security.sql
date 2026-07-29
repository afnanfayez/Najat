-- Admin security. See docs/BACKEND_API_SPEC.md §6 (Admin Security).
-- security_settings is a singleton row enforced by a `check (id)` on a
-- boolean primary key (classic Postgres one-row-table trick).

create table security_settings (
  id boolean primary key default true check (id),
  cron_expression text not null default '0 2 * * *',
  backup_enabled boolean not null default true,
  firewall_status text not null default 'active',
  ddos_protection text not null default 'active',
  ssl_status text not null default 'valid',
  active_sessions int not null default 0,
  updated_at timestamptz not null default now()
);
create trigger trg_security_settings_updated_at before update on security_settings
  for each row execute function set_updated_at();
insert into security_settings (id) values (true);

create table security_backups (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  size_bytes bigint,
  status text not null default 'completed',
  scheduled_cron text,
  created_at timestamptz not null default now()
);
