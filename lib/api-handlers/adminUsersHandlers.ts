import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope, listEnvelope } from './envelope'
import { parsePagination, buildMeta } from './pagination'
import { toCamelCase } from './caseMapping'
import { createServiceRoleClient } from '@/lib/supabase/serviceRole'

/** GET /v1/admin/users/stats */
export async function getUsersStats(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('admin_users_stats')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}

/** GET /v1/admin/users — excludes soft-deleted, supports search/role/isActive/isVerified filters. */
export async function listUsers(supabase: SupabaseClient, searchParams: URLSearchParams) {
  const { page, limit, from, to } = parsePagination(searchParams, 10)
  let query = supabase.from('profiles').select('*', { count: 'exact' }).is('deleted_at', null)

  const search = searchParams.get('search')
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`)
  }
  const role = searchParams.get('role')
  if (role) query = query.eq('role', role)
  const isActive = searchParams.get('isActive')
  if (isActive != null) query = query.eq('is_active', isActive === 'true')
  const isVerified = searchParams.get('isVerified')
  if (isVerified != null) query = query.eq('is_verified', isVerified === 'true')

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) return errorEnvelope(error.message, 500)
  const meta = buildMeta(page, limit, count ?? 0)
  return listEnvelope((data ?? []).map((row) => toCamelCase(row)), meta)
}

/** GET /v1/users?since= — same table, but INCLUDING soft-deleted rows. */
export async function listUsersWithDeleted(supabase: SupabaseClient, searchParams: URLSearchParams) {
  const { page, limit, from, to } = parsePagination(searchParams, 10)
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) return errorEnvelope(error.message, 500)
  const meta = buildMeta(page, limit, count ?? 0)
  return listEnvelope((data ?? []).map((row) => toCamelCase(row)), meta)
}

export async function getUserById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

/** PUT /v1/admin/users/:id — general profile field update. */
export async function updateUser(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {}
  if (body.fullName !== undefined) updates.full_name = body.fullName
  if (body.email !== undefined) updates.email = body.email
  if (body.role !== undefined) updates.role = body.role
  if (body.region !== undefined) updates.region = body.region
  if (body.phoneNumber !== undefined) updates.phone_number = body.phoneNumber
  if (body.isActive !== undefined) updates.is_active = body.isActive
  if (body.isVerified !== undefined) updates.is_verified = body.isVerified

  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select('*').single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function setUserActive(supabase: SupabaseClient, id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function setUserVerified(supabase: SupabaseClient, id: string, isVerified: boolean) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_verified: isVerified })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function restoreUser(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ deleted_at: null })
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(toCamelCase(data))
}

export async function deleteUser(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope({ success: true })
}

/**
 * Admin-created accounts (POST /v1/users/volunteers, /v1/users/residents).
 * Uses the service-role client (bypasses RLS) since it must call
 * supabase.auth.admin.createUser() — the caller already had to pass
 * requireAdmin() before this runs. Mirrors scripts/seed-supabase.ts's user
 * creation: signup metadata feeds handle_new_user() (migration 0015), then a
 * follow-up update sets role/verified/active since those aren't read from
 * metadata.
 */
export async function createUserWithRole(
  body: Record<string, unknown>,
  role: 'volunteer' | 'resident',
) {
  const serviceClient = createServiceRoleClient()

  const { data: created, error } = await serviceClient.auth.admin.createUser({
    email: body.email as string,
    password: body.password as string,
    email_confirm: true,
    user_metadata: {
      full_name: body.fullName ?? null,
      phone_number: body.phoneNumber ?? null,
      gender: body.gender ?? null,
      age_group: body.ageGroup ?? null,
      marital_status: body.maritalStatus ?? null,
      health_status: body.healthStatus ?? null,
      national_id: body.nationalId ?? null,
      housing_status: body.housingStatus ?? null,
      family_members_count: body.familyMembersCount ?? null,
      females_count: body.femalesCount ?? null,
      males_count: body.malesCount ?? null,
      region: body.region ?? null,
    },
  })
  if (error || !created.user) {
    return errorEnvelope(error?.message ?? 'تعذّر إنشاء المستخدم', 400)
  }

  const { data: profile, error: updateError } = await serviceClient
    .from('profiles')
    .update({ role, is_verified: true, is_active: true })
    .eq('id', created.user.id)
    .select('*')
    .single()
  if (updateError || !profile) {
    return errorEnvelope(updateError?.message ?? 'تعذّر إعداد الملف الشخصي', 500)
  }

  return envelope(toCamelCase(profile), 201)
}
