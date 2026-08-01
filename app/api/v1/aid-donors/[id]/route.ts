import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'

const aidDonors = createSupabaseCrudHandlers({
  table: 'aid_donors',
  defaultLimit: 100,
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return aidDonors.getById(supabase, id)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return aidDonors.update(supabase, id, body)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return aidDonors.remove(supabase, id)
}
