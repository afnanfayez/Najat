import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDataRequestReview, submitDataRequestReview } from '@/lib/api-handlers/adminDataHandlers'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return getDataRequestReview(supabase, id)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json().catch(() => ({}))
  return submitDataRequestReview(supabase, id, body)
}
