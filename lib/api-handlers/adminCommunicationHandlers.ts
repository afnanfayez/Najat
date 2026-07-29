import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope } from './envelope'
import { toCamelCase } from './caseMapping'

export async function getCommunicationDashboard(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('admin_communication_dashboard')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}

export async function createCommunicationTask(supabase: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('communication_tasks')
    .insert({
      title: body.title,
      description: body.description ?? null,
      volunteer_id: body.volunteerId ?? null,
      priority: body.priority ?? null,
      due_date: body.dueDate ?? null,
      due_time: body.dueTime ?? null,
    })
    .select('*')
    .single()
  if (error) return errorEnvelope(error.message, 400)
  return envelope(toCamelCase(data), 201)
}

export async function createBroadcast(supabase: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('communication_broadcasts')
    .insert({
      alert_type: body.alertType,
      title: body.title,
      description: body.description ?? null,
      geographic_scope: body.geographicScope ?? null,
      beneficiary_segment: body.beneficiarySegment ?? null,
    })
    .select('*')
    .single()
  if (error) return errorEnvelope(error.message, 400)

  // Best-effort counter bump — a lost increment under concurrent writes isn't
  // worth a dedicated SQL function for this low-frequency admin action.
  const { data: counters } = await supabase
    .from('communication_counters')
    .select('total_broadcasts')
    .eq('id', true)
    .single()
  if (counters) {
    await supabase
      .from('communication_counters')
      .update({ total_broadcasts: (counters.total_broadcasts ?? 0) + 1 })
      .eq('id', true)
  }

  return envelope(toCamelCase(data), 201)
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

export async function exportBroadcasts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('communication_broadcasts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return new Response(error.message, { status: 500 })
  return new Response(toCsv(data ?? []), {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="broadcasts.csv"' },
  })
}

export async function exportFeedback() {
  // No feedback table exists yet (spec §6: only the numeric counter is live) —
  // return an empty CSV rather than fabricating rows.
  return new Response('id,message,rating,createdAt\n', {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="feedback.csv"' },
  })
}
