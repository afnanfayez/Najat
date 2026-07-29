-- Shared helper functions reused across every table/migration.

-- Attach to any table with an `updated_at` column:
--   create trigger trg_<table>_updated_at before update on <table>
--     for each row execute function set_updated_at();
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Reads the `role` claim written into app_metadata by the Custom Access Token
-- Hook (see docs/BACKEND_API_SPEC.md / migration plan, Phase 2) — no round trip
-- to `profiles`. Used by every RLS policy below.
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create or replace function current_role_claim()
returns text
language sql
stable
as $$
  select auth.jwt() -> 'app_metadata' ->> 'role'
$$;
