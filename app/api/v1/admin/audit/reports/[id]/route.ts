import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateAuditReport } from '@/lib/api-handlers/adminAuditHandlers'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return updateAuditReport(supabase, id, body)
}
