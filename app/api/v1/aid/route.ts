/**
 * GET/POST /api/v1/aid — aid points (distribution points). Backed by the
 * `aid_points` table under RLS (public read, admin-only write — see
 * supabase/migrations/0012_rls_policies.sql). See
 * docs/BACKEND_API_SPEC.md migration plan, Phase 4.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const aidPoints = createSupabaseCrudHandlers({
  table: 'aid_points',
  softDelete: true,
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return aidPoints.list(supabase, req.nextUrl.searchParams)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return aidPoints.create(supabase, body)
}
