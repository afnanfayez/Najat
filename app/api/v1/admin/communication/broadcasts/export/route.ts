import { createClient } from '@/lib/supabase/server'
import { exportBroadcasts } from '@/lib/api-handlers/adminCommunicationHandlers'

export async function GET() {
  const supabase = await createClient()
  return exportBroadcasts(supabase)
}
