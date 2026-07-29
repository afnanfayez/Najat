import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { restoreAuditVersion } from '@/lib/api-handlers/adminAuditHandlers'

type Params = { params: Promise<{ id: string; versionId: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const { id, versionId } = await params
  const supabase = await createClient()
  return restoreAuditVersion(supabase, id, versionId)
}
