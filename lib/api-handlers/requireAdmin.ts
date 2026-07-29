import type { SupabaseClient } from '@supabase/supabase-js'
import { errorEnvelope } from './envelope'

/**
 * Confirms the caller is an authenticated admin before a Route Handler does
 * anything that needs the service-role client (which bypasses RLS entirely
 * — e.g. supabase.auth.admin.* calls). Plain table reads/writes don't need
 * this: RLS's is_admin() already enforces it. This is only for the small
 * set of admin operations that have no RLS-governed table to fall back on.
 */
export async function requireAdmin(
  supabase: SupabaseClient,
): Promise<{ ok: true; userId: string } | { ok: false; response: ReturnType<typeof errorEnvelope> }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { ok: false, response: errorEnvelope('غير مصرح', 401) }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profileError || profile?.role !== 'admin') {
    return { ok: false, response: errorEnvelope('ليس لديك صلاحيات المسؤول', 403) }
  }

  return { ok: true, userId: user.id }
}
