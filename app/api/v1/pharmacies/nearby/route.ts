import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const pharmacies = createSupabaseCrudHandlers({
  table: 'pharmacies',
  softDelete: true,
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return pharmacies.nearby(supabase, req.nextUrl.searchParams)
}
