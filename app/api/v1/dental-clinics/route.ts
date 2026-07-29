import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseCrudHandlers } from '@/lib/api-handlers/crudFactory'
import { parseRequestBody } from '@/lib/api-handlers/parseRequestBody'
import { errorEnvelope } from '@/lib/api-handlers/envelope'

const dentalClinics = createSupabaseCrudHandlers({
  table: 'dental_clinics',
  softDelete: true,
  nearbyEnabled: true,
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return dentalClinics.list(supabase, req.nextUrl.searchParams)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  try {
    const body = await parseRequestBody(req, supabase, { bucket: 'facility-images', pathPrefix: 'dental-clinics' })
    return dentalClinics.create(supabase, body)
  } catch (err) {
    return errorEnvelope(err instanceof Error ? err.message : 'تعذّر رفع الصورة', 500)
  }
}
