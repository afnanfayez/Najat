-- Admin sub-system dashboard RPCs. See docs/BACKEND_API_SPEC.md §6 and the
-- migration plan Phase 4 (Admin sub-systems, lowest priority / last domain).
-- Each returns jsonb built from real table data where a real source exists;
-- fields with no natural DB source (e.g. UI-only "average response time")
-- are left as simple static placeholders rather than fabricated to look
-- more real than they are — matches how the mock layer itself treated them.

create or replace function admin_users_stats()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'totalUsers', (select count(*) from profiles where deleted_at is null),
    'activeUsers', (select count(*) from profiles where deleted_at is null and is_active),
    'verifiedUsers', (select count(*) from profiles where deleted_at is null and is_verified),
    'roleBreakdown', (
      select coalesce(jsonb_object_agg(role, cnt), '{}'::jsonb)
      from (select role, count(*) as cnt from profiles where deleted_at is null group by role) t
    ),
    'genderBreakdown', (
      select coalesce(jsonb_object_agg(gender, cnt), '{}'::jsonb)
      from (select gender, count(*) as cnt from profiles where deleted_at is null and gender is not null group by gender) t
    ),
    'healthStatusBreakdown', (
      select coalesce(jsonb_object_agg(health_status, cnt), '{}'::jsonb)
      from (select health_status, count(*) as cnt from profiles where deleted_at is null and health_status is not null group by health_status) t
    ),
    'regionBreakdown', (
      select coalesce(jsonb_object_agg(region, cnt), '{}'::jsonb)
      from (select region, count(*) as cnt from profiles where deleted_at is null and region is not null group by region) t
    )
  )
$$;

create or replace function admin_system_stats()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'responseTime', 8,
    'informationAccuracy', 94,
    'activeActivitiesCount', (select count(*) from communication_tasks where status <> 'completed'),
    'urgentAlertsCount', (select count(*) from alerts where severity = 'critical' and not is_resolved),
    'userStats', admin_users_stats(),
    'hospitalCount', (select count(*) from hospitals where deleted_at is null),
    'aidRequestCount', (select count(*) from aid_requests)
  )
$$;

create or replace function admin_audit_dashboard()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'approvedCount', (select count(*) from audit_reports where status = 'approved'),
    'pendingCount', (select count(*) from audit_reports where status = 'pending'),
    'rejectedCount', (select count(*) from audit_reports where status = 'rejected'),
    'complianceRating', (
      select case when count(*) filter (where status in ('approved','rejected')) = 0 then 100
             else round(100.0 * count(*) filter (where status = 'approved')
                        / count(*) filter (where status in ('approved','rejected')))
             end
      from audit_reports
    )
  )
$$;

create or replace function admin_data_dashboard()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'totalRequests', (select count(*) from data_sync_requests),
    'pendingRequests', (select count(*) from data_sync_requests where status = 'pending'),
    'approvedRequests', (select count(*) from data_sync_requests where status = 'approved'),
    'rejectedRequests', (select count(*) from data_sync_requests where status = 'rejected'),
    'publishedRequests', (select count(*) from data_sync_requests where status = 'published'),
    'syncHealth', (
      select case when count(*) = 0 then 100
             else round(100.0 * count(*) filter (where status = 'published') / count(*))
             end
      from data_sync_requests
    )
  )
$$;

create or replace function admin_security_dashboard()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'backupSchedule', jsonb_build_object(
      'cronExpression', s.cron_expression,
      'isEnabled', s.backup_enabled
    ),
    'backupStats', jsonb_build_object(
      'totalBackups', (select count(*) from security_backups),
      'lastBackupFile', (select filename from security_backups order by created_at desc limit 1),
      'lastBackupSize', (select size_bytes from security_backups order by created_at desc limit 1),
      'lastBackupDate', (select created_at from security_backups order by created_at desc limit 1)
    ),
    'securityStatus', jsonb_build_object(
      'firewallStatus', s.firewall_status,
      'ddosProtection', s.ddos_protection,
      'sslStatus', s.ssl_status,
      'activeSessions', s.active_sessions
    )
  )
  from security_settings s
  where s.id = true
$$;

create or replace function admin_communication_dashboard()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'tasks', jsonb_build_object(
      'total', (select count(*) from communication_tasks),
      'pending', (select count(*) from communication_tasks where status = 'pending'),
      'inProgress', (select count(*) from communication_tasks where status = 'in_progress'),
      'completed', (select count(*) from communication_tasks where status = 'completed')
    ),
    'totalBroadcasts', (select total_broadcasts from communication_counters where id = true),
    'totalFeedback', (select total_feedback from communication_counters where id = true)
  )
$$;

create or replace function admin_reports_dashboard()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'overview', jsonb_build_object(
      'totalVolunteers', (select count(*) from profiles where deleted_at is null and role = 'volunteer'),
      'totalResidents', (select count(*) from profiles where deleted_at is null and role = 'resident'),
      'totalHospitals', (select count(*) from hospitals where deleted_at is null),
      'totalDangerZones', (select count(*) from danger_zones where deleted_at is null),
      'totalAidPoints', (select count(*) from aid_points where deleted_at is null)
    ),
    'safetyStats', jsonb_build_object(
      'activeEscalations', (select count(*) from danger_zones where deleted_at is null and is_active and danger_level = 'critical'),
      'resolvedZones', (select count(*) from danger_zones where deleted_at is not null),
      'dangerousRoadsCount', 0
    ),
    'activitySummary', jsonb_build_object(
      'weeklySyncVolume', (select count(*) from data_sync_requests where created_at > now() - interval '7 days'),
      'avgResponseTime', 8,
      'medicalDispatches', (select count(*) from aid_requests where status in ('approved','fulfilled'))
    )
  )
$$;

grant execute on function admin_users_stats, admin_system_stats, admin_audit_dashboard,
  admin_data_dashboard, admin_security_dashboard, admin_communication_dashboard,
  admin_reports_dashboard to authenticated;
