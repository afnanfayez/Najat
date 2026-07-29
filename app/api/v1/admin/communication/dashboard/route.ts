import { createClient } from '@/lib/supabase/server'
import { getCommunicationDashboard } from '@/lib/api-handlers/adminCommunicationHandlers'

export async function GET() {
  const supabase = await createClient()
  return getCommunicationDashboard(supabase)
}
