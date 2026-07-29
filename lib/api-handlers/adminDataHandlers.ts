import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope } from './envelope'
import { toCamelCase } from './caseMapping'

export async function getDataDashboard(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('admin_data_dashboard')
  if (error) return errorEnvelope(error.message, 500)
  // lib/api/adminData.ts parses syncHealth as a "NN%" string (calls .replace('%','')
  // on it) — the RPC returns a plain number, so stringify it here to match.
  const shaped = { ...data, syncHealth: `${data.syncHealth}%` }
  return envelope(shaped)
}

export async function listDataSyncRequests(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('data_sync_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return errorEnvelope(error.message, 500)
  return envelope((data ?? []).map((row) => toCamelCase(row)))
}

export async function getDataRequestReview(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('data_sync_requests').select('*').eq('id', id).single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

/** POST /v1/admin/data/requests/:id/review — body: {status: 'approved'|'rejected', reviewNotes} */
export async function submitDataRequestReview(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {
    status: body.status,
    review_notes: body.reviewNotes ?? null,
    reviewed_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('data_sync_requests')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function deleteDataRequest(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('data_sync_requests').delete().eq('id', id)
  if (error) return errorEnvelope(error.message, 400)
  return envelope({ success: true })
}

export async function approveDataRequest(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('data_sync_requests')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function publishDataSyncRequest(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('data_sync_requests')
    .update({ status: 'published' })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function publishAllApprovedRequests(supabase: SupabaseClient) {
  const { data: approved, error: fetchError } = await supabase
    .from('data_sync_requests')
    .select('id')
    .eq('status', 'approved')
  if (fetchError) return errorEnvelope(fetchError.message, 500)

  const details: Array<{ id: string; success: boolean; error?: string }> = []
  for (const row of approved ?? []) {
    const { error } = await supabase.from('data_sync_requests').update({ status: 'published' }).eq('id', row.id)
    details.push({ id: row.id, success: !error, ...(error ? { error: error.message } : {}) })
  }
  return envelope({ processed: details.length, details })
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

export async function exportDataRequestReport(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('data_sync_requests').select('*').eq('id', id).single()
  if (error || !data) return new Response('Not found', { status: 404 })
  return new Response(toCsv([data]), {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="sync-request-${id}.csv"` },
  })
}

export async function exportAllDataSyncRequests(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('data_sync_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return new Response(error.message, { status: 500 })
  return new Response(toCsv(data ?? []), {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="data-sync-requests.csv"' },
  })
}
