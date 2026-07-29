import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createBroadcast } from '@/lib/api-handlers/adminCommunicationHandlers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return createBroadcast(supabase, body)
}
