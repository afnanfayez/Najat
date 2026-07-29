import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkSafety } from '@/lib/api-handlers/safetyHandlers'
import { errorEnvelope } from '@/lib/api-handlers/envelope'

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'))
  const lng = Number(req.nextUrl.searchParams.get('lng'))
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return errorEnvelope('lat/lng مطلوبة', 400)
  }
  const supabase = await createClient()
  return checkSafety(supabase, lat, lng)
}
