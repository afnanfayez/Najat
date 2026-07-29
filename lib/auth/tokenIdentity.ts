/**
 * Current Supabase user id, cached in localStorage so it can be read
 * synchronously by non-React code (React Query keys, offline sync) without
 * an async `supabase.auth.getSession()` round trip on every call site.
 * AuthContext is the only writer — it updates this on every auth state change.
 */

const CURRENT_USER_ID_KEY = 'najat_current_user_id'

export function saveCurrentUserId(userId: string | null | undefined): void {
  if (typeof window === 'undefined') return
  if (!userId) {
    localStorage.removeItem(CURRENT_USER_ID_KEY)
    return
  }
  localStorage.setItem(CURRENT_USER_ID_KEY, userId)
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_ID_KEY)
}

/** Stable React Query key per login session. */
export function getSessionCacheKey(): string {
  return getCurrentUserId() ?? 'none'
}

export function getProfileQueryKey() {
  return ['profile', 'me', getSessionCacheKey()] as const
}
