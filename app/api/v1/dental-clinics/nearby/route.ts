import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const dentalClinics = createSupabaseCrudHandlers({
  table: 'dental_clinics',
  softDelete: true,
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return dentalClinics.nearby(supabase, req.nextUrl.searchParams)
}
