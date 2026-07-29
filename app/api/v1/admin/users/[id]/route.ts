import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserById, updateUser, deleteUser } from '@/lib/api-handlers/adminUsersHandlers'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return getUserById(supabase, id)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return updateUser(supabase, id, body)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return deleteUser(supabase, id)
}
