import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/api-handlers/requireAdmin'
import { createUserWithRole } from '@/lib/api-handlers/adminUsersHandlers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return admin.response
  const body = await req.json().catch(() => ({}))
  return createUserWithRole(body, 'resident')
}
