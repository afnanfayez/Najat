import { createClient } from '@/lib/supabase/server'
import { getSecurityDashboard } from '@/lib/api-handlers/adminSecurityHandlers'

export async function GET() {
  const supabase = await createClient()
  return getSecurityDashboard(supabase)
}
