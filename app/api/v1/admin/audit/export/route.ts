import { createClient } from '@/lib/supabase/server'
import { exportAllAuditReports } from '@/lib/api-handlers/adminAuditHandlers'

export async function GET() {
  const supabase = await createClient()
  return exportAllAuditReports(supabase)
}
