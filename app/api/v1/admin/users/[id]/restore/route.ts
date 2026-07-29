import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { restoreUser } from '@/lib/api-handlers/adminUsersHandlers'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return restoreUser(supabase, id)
}
