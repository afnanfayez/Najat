import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'
import { parseRequestBody } from '@/lib/api-handlers/parseRequestBody'
import { errorEnvelope } from '@/lib/api-handlers/envelope'

const labs = createSupabaseCrudHandlers({
  table: 'labs',
  softDelete: true,
  nearbyEnabled: true,
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return labs.getById(supabase, id)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  try {
    const body = await parseRequestBody(req, supabase, { bucket: 'facility-images', pathPrefix: 'labs' })
    return labs.update(supabase, id, body)
  } catch (err) {
    return errorEnvelope(err instanceof Error ? err.message : 'تعذّر رفع الصورة', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return labs.remove(supabase, id)
}
