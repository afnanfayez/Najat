import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateBackupSchedule } from '@/lib/api-handlers/adminSecurityHandlers'

export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return updateBackupSchedule(supabase, body)
}
