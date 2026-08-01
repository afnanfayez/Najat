import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope, listEnvelope } from './envelope'
import { toCamelCase } from './caseMapping'

const VALID_STATUSES = ['pending', 'in_progress', 'completed'] as const
type TaskStatus = (typeof VALID_STATUSES)[number]

/**
 * Confirms the caller is an authenticated volunteer (or admin, who can do
 * anything a volunteer can). Mirrors requireAdmin's shape.
 *
 * RLS is still the real boundary — communication_tasks_volunteer_select only
 * ever returns rows where volunteer_id = auth.uid(), and a trigger blocks
 * writes to any column but status (0025_volunteer_tasks.sql). This check just
 * turns "no rows" into an honest 403 instead of a silently empty list.
 */
async function requireVolunteer(
  supabase: SupabaseClient,
): Promise<{ ok: true; userId: string } | { ok: false; response: ReturnType<typeof errorEnvelope> }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { ok: false, response: errorEnvelope('غير مصرح', 401) }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || (profile?.role !== 'volunteer' && profile?.role !== 'admin')) {
    return { ok: false, response: errorEnvelope('هذه الصفحة مخصّصة للمتطوعين', 403) }
  }

  return { ok: true, userId: user.id }
}

export async function listVolunteerTasks(supabase: SupabaseClient) {
  const auth = await requireVolunteer(supabase)
  if (!auth.ok) return auth.response

  // Filter by volunteer_id explicitly rather than leaning on RLS alone: an
  // admin passes requireVolunteer and would otherwise receive every task in
  // the system on their own /volunteer page.
  const { data, error } = await supabase
    .from('communication_tasks')
    .select('*')
    .eq('volunteer_id', auth.userId)
    .order('created_at', { ascending: false })

  if (error) return errorEnvelope(error.message, 500)

  const rows = (data ?? []).map((row) => toCamelCase(row))
  return listEnvelope(rows, { totalItems: rows.length })
}

export async function updateVolunteerTaskStatus(
  supabase: SupabaseClient,
  id: string,
  body: Record<string, unknown>,
) {
  const auth = await requireVolunteer(supabase)
  if (!auth.ok) return auth.response

  const status = body.status
  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as TaskStatus)) {
    return errorEnvelope('حالة غير صالحة', 400)
  }

  const { data, error } = await supabase
    .from('communication_tasks')
    .update({ status })
    .eq('id', id)
    .eq('volunteer_id', auth.userId)
    .select('*')
    .single()

  if (error || !data) return errorEnvelope('المهمة غير موجودة', 404)
  return envelope(toCamelCase(data))
}
