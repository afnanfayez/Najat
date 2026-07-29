import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listUsersWithDeleted } from '@/lib/api-handlers/adminUsersHandlers'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return listUsersWithDeleted(supabase, req.nextUrl.searchParams)
}
