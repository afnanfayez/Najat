import { createClient } from '@/lib/supabase/server'
import { triggerBackup } from '@/lib/api-handlers/adminSecurityHandlers'

export async function POST() {
  const supabase = await createClient()
  return triggerBackup(supabase)
}
