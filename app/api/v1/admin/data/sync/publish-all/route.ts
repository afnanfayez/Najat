import { createClient } from '@/lib/supabase/server'
import { publishAllApprovedRequests } from '@/lib/api-handlers/adminDataHandlers'

export async function POST() {
  const supabase = await createClient()
  return publishAllApprovedRequests(supabase)
}
