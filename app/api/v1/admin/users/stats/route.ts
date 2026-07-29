import { createClient } from '@/lib/supabase/server'
import { getUsersStats } from '@/lib/api-handlers/adminUsersHandlers'

export async function GET() {
  const supabase = await createClient()
  return getUsersStats(supabase)
}
