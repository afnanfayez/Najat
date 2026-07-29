import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const providers = createSupabaseCrudHandlers({
  table: 'providers',
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return providers.nearby(supabase, req.nextUrl.searchParams)
}
