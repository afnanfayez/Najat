/**
 * Profile — GET/PATCH /api/profile, proxied from `/v1/auth/me` by
 * lib/api/api.ts's request(). Backed directly by the `profiles` table under
 * RLS (own-row read/write — see supabase/migrations/0012_rls_policies.sql).
 *
 * Every field UserProfile exposes — including what used to be "local-only"
 * in the mock layer (avatar, assistance*, emergencyContacts, sosMessage,
 * bloodType) — is now a real column and persisted server-side for real. See
 * docs/BACKEND_API_SPEC.md migration plan, Phase 1 §1 & Phase 4.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadDataUrlImage } from '@/lib/supabase/uploadImage'
import { mapProfileRow } from '@/lib/supabase/mapProfileRow'
import { envelope, errorEnvelope } from '@/lib/api-handlers/envelope'
import { updateUserProfileSchema } from '@/schemas/userProfile'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return errorEnvelope('غير مصرح', 401)
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error || !data) {
    return errorEnvelope('تعذّر تحميل الملف الشخصي', 404)
  }

  return envelope(mapProfileRow(data, user.email ?? ''))
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return errorEnvelope('غير مصرح', 401)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorEnvelope('JSON غير صالح', 400)
  }

  const parsed = updateUserProfileSchema.safeParse(body)
  if (!parsed.success) {
    return errorEnvelope(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة', 422)
  }
  const { avatarDataUrl, ...fields } = parsed.data

  const updates: Record<string, unknown> = {
    full_name: fields.fullName,
    phone_number: fields.phoneNumber,
    gender: fields.gender,
    age_group: fields.ageGroup,
    marital_status: fields.maritalStatus,
    health_status: fields.healthStatus,
    national_id: fields.nationalId,
    housing_status: fields.housingStatus,
    family_members_count: fields.familyMembersCount,
    females_count: fields.femalesCount,
    males_count: fields.malesCount,
    region: fields.region,
    assistance_preferences: fields.assistancePreferences,
    assistance_location: fields.assistanceLocation,
    assistance_radius: fields.assistanceRadius,
    emergency_contacts: fields.emergencyContacts,
    sos_message: fields.sosMessage,
    blood_type: fields.bloodType,
  }
  // Only touch columns the caller actually sent.
  for (const key of Object.keys(updates)) {
    if (updates[key] === undefined) delete updates[key]
  }

  if (avatarDataUrl) {
    try {
      updates.avatar_url = await uploadDataUrlImage(supabase, 'avatars', user.id, avatarDataUrl)
    } catch (err) {
      return errorEnvelope(err instanceof Error ? err.message : 'تعذّر رفع الصورة', 500)
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    return errorEnvelope('تعذّر حفظ التعديلات', 500)
  }

  return envelope(mapProfileRow(data, user.email ?? ''))
}
