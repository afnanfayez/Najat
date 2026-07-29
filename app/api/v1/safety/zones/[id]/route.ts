import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDangerZone, updateDangerZone, removeDangerZone } from '@/lib/api-handlers/safetyHandlers'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return getDangerZone(supabase, id)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return updateDangerZone(supabase, id, body)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return removeDangerZone(supabase, id)
}
