import { createClient } from '@/lib/supabase/server'
import { getSafetyMapData } from '@/lib/api-handlers/safetyHandlers'

export async function GET() {
  const supabase = await createClient()
  return getSafetyMapData(supabase)
}
