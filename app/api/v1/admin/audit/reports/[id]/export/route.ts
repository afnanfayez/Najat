import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exportAuditReport } from '@/lib/api-handlers/adminAuditHandlers'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return exportAuditReport(supabase, id)
}
