import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listDangerZones, createDangerZone } from '@/lib/api-handlers/safetyHandlers'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return listDangerZones(supabase, req.nextUrl.searchParams)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return createDangerZone(supabase, body)
}
