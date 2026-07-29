import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { removeSafeRoad } from '@/lib/api-handlers/safetyHandlers'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return removeSafeRoad(supabase, id)
}
