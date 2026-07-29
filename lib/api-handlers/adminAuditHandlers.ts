import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope } from './envelope'
import { toCamelCase } from './caseMapping'

export async function getAuditDashboard(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('admin_audit_dashboard')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}

export async function listAuditReports(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('audit_reports')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return errorEnvelope(error.message, 500)
  return envelope((data ?? []).map((row) => toCamelCase(row)))
}

/**
 * PATCH /v1/admin/audit/reports/:id — the frontend (lib/api/adminAudit.ts)
 * sends `{title, description}` regardless of what the user actually edited
 * (title = facilityName ?? issueType; description = targetLocation ??
 * reporter) — a known field-mapping inconsistency flagged in
 * docs/BACKEND_API_SPEC.md §6. Accept both the generic camelCase names and
 * this title/description shape.
 */
export async function updateAuditReport(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {}
  if (body.facilityName !== undefined) updates.facility_name = body.facilityName
  else if (body.title !== undefined) updates.facility_name = body.title
  if (body.targetLocation !== undefined) updates.target_location = body.targetLocation
  else if (body.description !== undefined) updates.target_location = body.description
  if (body.issueType !== undefined) updates.issue_type = body.issueType
  if (body.reporter !== undefined) updates.reporter = body.reporter
  if (body.region !== undefined) updates.region = body.region
  if (body.isUrgent !== undefined) updates.is_urgent = body.isUrgent
  if (body.status !== undefined) updates.status = body.status

  const { data, error } = await supabase
    .from('audit_reports')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function rejectAuditReport(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('audit_reports')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function getAuditCompare(supabase: SupabaseClient, id: string) {
  const { data: report, error } = await supabase.from('audit_reports').select('*').eq('id', id).single()
  if (error || !report) return errorEnvelope('العنصر غير موجود', 404)

  const { data: versions } = await supabase
    .from('audit_report_versions')
    .select('*')
    .eq('audit_report_id', id)
    .order('created_at', { ascending: false })

  return envelope({
    id: `compare-${id}`,
    reportId: id,
    title: 'مقارنة الإصدارات',
    subtitle: report.facility_name ?? '',
    changes: [],
    recoveryBullets: [],
    recoveryWarning: '',
    versions: (versions ?? []).map((v) => ({
      id: v.id,
      snapshot: v.snapshot,
      createdAt: v.created_at,
    })),
  })
}

export async function restoreAuditVersion(supabase: SupabaseClient, reportId: string, versionId: string) {
  const { data: version, error: versionError } = await supabase
    .from('audit_report_versions')
    .select('snapshot')
    .eq('id', versionId)
    .eq('audit_report_id', reportId)
    .single()
  if (versionError || !version) return errorEnvelope('الإصدار غير موجود', 404)

  const { data, error } = await supabase
    .from('audit_reports')
    .update(version.snapshot as Record<string, unknown>)
    .eq('id', reportId)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
  }
  return lines.join('\n')
}

export async function exportAuditReport(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('audit_reports').select('*').eq('id', id).single()
  if (error || !data) return new Response('Not found', { status: 404 })
  return new Response(toCsv([data]), {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="audit-${id}.csv"` },
  })
}

export async function exportAllAuditReports(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('audit_reports').select('*').order('created_at', { ascending: false })
  if (error) return new Response(error.message, { status: 500 })
  return new Response(toCsv(data ?? []), {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="audit-reports.csv"' },
  })
}
