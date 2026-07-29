import { createClient } from '@/lib/supabase/server'
import { getAuditDashboard } from '@/lib/api-handlers/adminAuditHandlers'

export async function GET() {
  const supabase = await createClient()
  return getAuditDashboard(supabase)
}
