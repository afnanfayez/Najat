import { createClient } from '@/lib/supabase/server'
import { listDataSyncRequests } from '@/lib/api-handlers/adminDataHandlers'

export async function GET() {
  const supabase = await createClient()
  return listDataSyncRequests(supabase)
}
