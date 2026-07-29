import { createClient } from '@/lib/supabase/server'
import { getDataDashboard } from '@/lib/api-handlers/adminDataHandlers'

export async function GET() {
  const supabase = await createClient()
  return getDataDashboard(supabase)
}
