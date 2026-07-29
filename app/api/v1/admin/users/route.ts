import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listUsers } from '@/lib/api-handlers/adminUsersHandlers'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return listUsers(supabase, req.nextUrl.searchParams)
}
