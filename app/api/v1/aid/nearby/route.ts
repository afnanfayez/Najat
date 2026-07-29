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
  return aidPoints.nearby(supabase, req.nextUrl.searchParams)
}
