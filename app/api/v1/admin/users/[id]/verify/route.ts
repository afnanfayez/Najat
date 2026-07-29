import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setUserVerified } from '@/lib/api-handlers/adminUsersHandlers'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return setUserVerified(supabase, id, Boolean(body.isVerified))
}
