-- Enable RLS on every table and apply the policy pattern from
-- docs/BACKEND_API_SPEC.md / the migration plan Phase 1 "RLS" section.
-- Categories:
--   A) public/authenticated read (excl. soft-deleted), admin-only write
--   B) own-row read/write (profiles)
--   C) resident-creates / admin-updates-status (aid_requests)
--   D) admin-only, full (internal admin-ops tables)

-- ---------- Category A: facilities, aid_points, articles, safety, aid_donors ----------

alter table hospitals enable row level security;
create policy hospitals_select on hospitals for select using (deleted_at is null or is_admin());
create policy hospitals_write on hospitals for all using (is_admin()) with check (is_admin());

alter table pharmacies enable row level security;
create policy pharmacies_select on pharmacies for select using (deleted_at is null or is_admin());
create policy pharmacies_write on pharmacies for all using (is_admin()) with check (is_admin());

alter table labs enable row level security;
create policy labs_select on labs for select using (deleted_at is null or is_admin());
create policy labs_write on labs for all using (is_admin()) with check (is_admin());

alter table clinics enable row level security;
create policy clinics_select on clinics for select using (deleted_at is null or is_admin());
create policy clinics_write on clinics for all using (is_admin()) with check (is_admin());

alter table dental_clinics enable row level security;
create policy dental_clinics_select on dental_clinics for select using (deleted_at is null or is_admin());
create policy dental_clinics_write on dental_clinics for all using (is_admin()) with check (is_admin());

alter table aid_points enable row level security;
create policy aid_points_select on aid_points for select using (deleted_at is null or is_admin());
create policy aid_points_write on aid_points for all using (is_admin()) with check (is_admin());

alter table aid_donors enable row level security;
create policy aid_donors_select on aid_donors for select using (true);
create policy aid_donors_write on aid_donors for all using (is_admin()) with check (is_admin());

alter table articles enable row level security;
create policy articles_select on articles for select using (deleted_at is null or is_admin());
create policy articles_write on articles for all using (is_admin()) with check (is_admin());

alter table danger_zones enable row level security;
create policy danger_zones_select on danger_zones for select using (deleted_at is null or is_admin());
create policy danger_zones_write on danger_zones for all using (is_admin()) with check (is_admin());

alter table safe_roads enable row level security;
create policy safe_roads_select on safe_roads for select using (deleted_at is null or is_admin());
create policy safe_roads_write on safe_roads for all using (is_admin()) with check (is_admin());

alter table resource_points enable row level security;
create policy resource_points_select on resource_points for select using (deleted_at is null or is_admin());
create policy resource_points_write on resource_points for all using (is_admin()) with check (is_admin());

-- ---------- Category B: profiles (own-row) ----------

alter table profiles enable row level security;
create policy profiles_select on profiles
  for select using (auth.uid() = id or is_admin());
create policy profiles_update on profiles
  for update using (auth.uid() = id or is_admin()) with check (auth.uid() = id or is_admin());
-- No public insert policy: rows are created only via the handle_new_user() trigger
-- (security definer), never directly by a client.
create policy profiles_delete on profiles
  for delete using (is_admin());

-- ---------- Category C: aid_requests ----------

alter table aid_requests enable row level security;
create policy aid_requests_select on aid_requests
  for select using (auth.uid() = user_id or is_admin());
create policy aid_requests_insert on aid_requests
  for insert with check (auth.uid() = user_id);
create policy aid_requests_update on aid_requests
  for update using (is_admin()) with check (is_admin());

-- ---------- Category D: admin-only, full ----------

alter table alerts enable row level security;
create policy alerts_admin_only on alerts for all using (is_admin()) with check (is_admin());

alter table audit_reports enable row level security;
create policy audit_reports_admin_only on audit_reports for all using (is_admin()) with check (is_admin());

alter table audit_report_versions enable row level security;
create policy audit_report_versions_admin_only on audit_report_versions for all using (is_admin()) with check (is_admin());

alter table data_sync_requests enable row level security;
create policy data_sync_requests_admin_only on data_sync_requests for all using (is_admin()) with check (is_admin());

alter table security_settings enable row level security;
create policy security_settings_admin_only on security_settings for all using (is_admin()) with check (is_admin());

alter table security_backups enable row level security;
create policy security_backups_admin_only on security_backups for all using (is_admin()) with check (is_admin());

alter table communication_counters enable row level security;
create policy communication_counters_admin_only on communication_counters for all using (is_admin()) with check (is_admin());

alter table communication_tasks enable row level security;
create policy communication_tasks_admin_only on communication_tasks for all using (is_admin()) with check (is_admin());

alter table communication_broadcasts enable row level security;
create policy communication_broadcasts_admin_only on communication_broadcasts for all using (is_admin()) with check (is_admin());
