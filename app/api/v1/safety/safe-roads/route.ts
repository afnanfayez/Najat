import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSafeRoad } from '@/lib/api-handlers/safetyHandlers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return createSafeRoad(supabase, body)
}
