import { createClient } from '@/lib/supabase/server'
import { exportAllDataSyncRequests } from '@/lib/api-handlers/adminDataHandlers'

export async function GET() {
  const supabase = await createClient()
  return exportAllDataSyncRequests(supabase)
}
