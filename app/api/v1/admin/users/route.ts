import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/serviceRole'
import { requireAdmin } from '@/lib/api-handlers/requireAdmin'
import { listUsers } from '@/lib/api-handlers/adminUsersHandlers'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return admin.response

  const serviceSupabase = createServiceRoleClient()
  return listUsers(serviceSupabase, req.nextUrl.searchParams)
}
