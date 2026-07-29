import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { approveDataRequest } from '@/lib/api-handlers/adminDataHandlers'

type Params = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return approveDataRequest(supabase, id)
}
