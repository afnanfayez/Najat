import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const hospitals = createSupabaseCrudHandlers({
  table: 'hospitals',
  softDelete: true,
  nearbyEnabled: true,
})

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return hospitals.updateStatus(supabase, id, body)
}
