/**
 * GET/POST/PUT /api/aid-requests — proxied from `/v1/aid/requests` and
 * `/v1/aid/:aidOrganizationId/requests` by lib/api/api.ts's request().
 * Backed by the `aid_requests` table under RLS: a resident sees/creates only
 * their own rows, an admin sees all and is the only one who can change
 * status — see supabase/migrations/0012_rls_policies.sql. Replaces the old
 * dual JSON-file store + Vercel-cookie-status-override workaround entirely;
 * Postgres removes the "filesystem unwritable on serverless" problem that
 * motivated it. See docs/BACKEND_API_SPEC.md migration plan, Phase 4.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decodeRoleClaim } from '@/lib/supabase/decodeRoleClaim'
import { envelope, errorEnvelope } from '@/lib/api-handlers/envelope'
import { toCamelCase } from '@/lib/api-handlers/caseMapping'

const AID_REQUEST_STATUSES = ['pending', 'in_progress', 'approved', 'rejected', 'fulfilled']

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return errorEnvelope('غير مصرح', 401)

  // RLS (aid_requests_select) already scopes this to the caller's own rows,
  // or every row if they're admin — no manual role branch needed.
  const { data, error } = await supabase
    .from('aid_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return errorEnvelope(error.message, 500)

  return envelope((data ?? []).map((row) => toCamelCase(row)))
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return errorEnvelope('غير مصرح', 401)

  const aidOrganizationId = req.nextUrl.searchParams.get('aidOrganizationId') || null

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return errorEnvelope('JSON غير صالح', 400)
  const b = body as Record<string, unknown>

  const record = {
    user_id: user.id,
    aid_point_id: aidOrganizationId,
    aid_organization_id: aidOrganizationId,
    aid_organization_name: typeof b.aidOrganizationName === 'string' ? b.aidOrganizationName : null,
    husband_name: typeof b.husbandName === 'string' ? b.husbandName : null,
    wife_name: typeof b.wifeName === 'string' ? b.wifeName : null,
    husband_id_number: typeof b.husbandIdNumber === 'string' ? b.husbandIdNumber : null,
    wife_id_number: typeof b.wifeIdNumber === 'string' ? b.wifeIdNumber : null,
    phone_number: typeof b.phoneNumber === 'string' ? b.phoneNumber : null,
    current_location: typeof b.currentLocation === 'string' ? b.currentLocation : 'غير محدد',
    female_children_count: typeof b.femaleChildrenCount === 'number' ? b.femaleChildrenCount : 0,
    male_children_count: typeof b.maleChildrenCount === 'number' ? b.maleChildrenCount : 0,
    notes: typeof b.additionalNotes === 'string' ? b.additionalNotes : null,
    requested_supplies: Array.isArray(b.requestedSupplies) ? b.requestedSupplies : [],
    status: 'pending',
  }

  const { data, error } = await supabase.from('aid_requests').insert(record).select('*').single()
  if (error) return errorEnvelope(error.message, 400)

  return envelope(toCamelCase(data), 201)
}

async function handleStatusUpdate(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return errorEnvelope('غير مصرح', 401)

  // Decoded from the access token, not user.app_metadata — see
  // lib/supabase/decodeRoleClaim.ts for why. RLS (aid_requests_update) also
  // enforces this at the database level regardless.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const role = decodeRoleClaim(session?.access_token)
  if (role !== 'admin') return errorEnvelope('غير مصرح', 403)

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const status = body?.status
  if (!id || !AID_REQUEST_STATUSES.includes(status)) {
    return errorEnvelope('بيانات غير مكتملة', 400)
  }

  const { data, error } = await supabase
    .from('aid_requests')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('الطلب غير موجود', 404)

  return envelope(toCamelCase(data))
}

export const PUT = handleStatusUpdate
export const PATCH = handleStatusUpdate
