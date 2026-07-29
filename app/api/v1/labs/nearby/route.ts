import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const labs = createSupabaseCrudHandlers({
  table: 'labs',
  softDelete: true,
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return labs.nearby(supabase, req.nextUrl.searchParams)
}
