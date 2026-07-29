/**
 * offlineLogin.ts
 *
 * Caches the current user's profile for offline viewing only. Real sign-in
 * always goes through Supabase Auth (requires connectivity); this module no
 * longer restores a session while offline — Supabase's own persisted session
 * cookie already keeps an already-logged-in user logged in offline. See
 * docs/BACKEND_API_SPEC.md migration plan, Phase 2.
 */

import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import type { UserProfile } from '@/schemas/userProfile'
import {
  putAuthSnapshot as idbPutAuthSnapshot,
  getLatestAuthSnapshot as idbGetLatestAuthSnapshot,
} from '@/lib/offline/db'

type CachedProfileSnapshot = {
  email: string
  role: UserRole
  profile: UserProfile | null
}

/** Cache the current session's profile so it can be shown while offline. */
export async function cacheProfileForOffline(profile: UserProfile): Promise<void> {
  if (typeof window === 'undefined') return
  const role = normalizeUserRole(profile.role) ?? 'resident'
  await idbPutAuthSnapshot({
    email: (profile.email ?? '').trim().toLowerCase(),
    role,
    profile,
  })
}

/**
 * Get the cached profile for the most recently logged-in user.
 * Used when loading the app while offline (e.g. from AuthContext).
 */
export async function getOfflineCachedProfile(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null
  try {
    const snapshot = (await idbGetLatestAuthSnapshot()) as CachedProfileSnapshot | null
    if (!snapshot?.profile) return null
    return { ...snapshot.profile, role: snapshot.role }
  } catch {
    return null
  }
}
