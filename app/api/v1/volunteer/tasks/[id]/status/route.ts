/**
 * PATCH /api/v1/volunteer/tasks/:id/status — the only mutation a volunteer may
 * perform on a task. Every other column is pinned by a trigger in
 * supabase/migrations/0025_volunteer_tasks.sql.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateVolunteerTaskStatus } from '@/lib/api-handlers/volunteerHandlers'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return updateVolunteerTaskStatus(supabase, id, body)
}
