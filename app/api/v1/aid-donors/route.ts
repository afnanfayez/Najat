/**
 * GET/POST /api/v1/aid-donors — backed by the `aid_donors` table under RLS
 * (public read, admin-only write — see supabase/migrations/0012_rls_policies.sql).
 * Replaces the old `/api/mock/aid-donors` JSON-file route for the admin Aid
 * "donors" tab. See docs/BACKEND_API_SPEC.md §2.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const aidDonors = createSupabaseCrudHandlers({
  table: 'aid_donors',
  defaultLimit: 100,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return aidDonors.list(supabase, req.nextUrl.searchParams)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return aidDonors.create(supabase, body)
}
