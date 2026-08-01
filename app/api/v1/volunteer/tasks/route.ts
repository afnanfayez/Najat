/**
 * GET /api/v1/volunteer/tasks — tasks the admin assigned to the signed-in
 * volunteer, from `communication_tasks` under RLS (see
 * supabase/migrations/0025_volunteer_tasks.sql).
 */
import { createClient } from '@/lib/supabase/server'
import { listVolunteerTasks } from '@/lib/api-handlers/volunteerHandlers'

export async function GET() {
  const supabase = await createClient()
  return listVolunteerTasks(supabase)
}
