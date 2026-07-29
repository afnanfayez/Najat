import { createClient } from '@/lib/supabase/server'
import { listAuditReports } from '@/lib/api-handlers/adminAuditHandlers'

export async function GET() {
  const supabase = await createClient()
  return listAuditReports(supabase)
}
