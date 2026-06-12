/**
 * offlineLogin.ts
 *
 * Handles storing and retrieving offline login credentials.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  تدفق الـ PWA:                                           │
 * │  1. Login أونلاين → saveOfflineLoginSnapshot()          │
 * │  2. انقطاع الإنترنت                                     │
 * │  3. tryOfflineLogin() ← يقرأ من IndexedDB              │
 * │  4. getOfflineCachedProfile() ← يُعيد الـ profile       │
 * │  5. عند عودة الإنترنت → مزامنة تلقائية عبر SW          │
 * └─────────────────────────────────────────────────────────┘
 *
 * ⚠️  IMPORTANT: clearOfflineLoginSnapshot() must NOT be called on logout.
 *     The snapshot must survive logout so the user can sign in offline.
 *     Only call it when a 401 confirms the token is permanently expired.
 */

import { saveToken } from '@/lib/api/auth'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { getUserIdFromToken } from '@/lib/auth/tokenIdentity'
import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import type { UserProfile } from '@/schemas/userProfile'
import {
  putAuthSnapshot as idbPutAuthSnapshot,
  getAuthSnapshot as idbGetAuthSnapshot,
  getLatestAuthSnapshot as idbGetLatestAuthSnapshot,
  updateAuthProfile as idbUpdateAuthProfile,
  deleteAuthSnapshot as idbDeleteAuthSnapshot,
} from '@/lib/offline/db'

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type OfflineLoginSnapshot = {
  email: string
  passwordHash: string
  token: string
  role: UserRole
  profile: UserProfile | null
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function buildProfileFromSnapshot(snapshot: OfflineLoginSnapshot): UserProfile {
  if (snapshot.profile) {
    return { ...snapshot.profile, role: snapshot.role }
  }
  const localPart = snapshot.email.split('@')[0] || 'مستخدم'
  return {
    id: getUserIdFromToken(snapshot.token) ?? `offline-${snapshot.email}`,
    email: snapshot.email,
    fullName: localPart,
    role: snapshot.role,
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────────────

export function createOfflineProfile(
  email: string,
  role: UserRole | null,
  token: string,
  profile: UserProfile | null,
): UserProfile {
  if (profile) {
    const normalizedRole = normalizeUserRole(role) ?? profile.role ?? 'resident'
    return { ...profile, role: normalizedRole }
  }
  const normalizedRole = normalizeUserRole(role) ?? 'resident'
  const localPart = email.trim().split('@')[0] || 'مستخدم'
  return {
    id: getUserIdFromToken(token) ?? `offline-${email.trim().toLowerCase()}`,
    email: email.trim().toLowerCase(),
    fullName: localPart,
    role: normalizedRole,
  }
}

/**
 * Save offline login snapshot to IndexedDB after a successful online login.
 * This allows the user to log in again even without internet.
 */
export async function saveOfflineLoginSnapshot(
  email: string,
  password: string,
  token: string,
  role: UserRole | null,
  profile: UserProfile | null,
): Promise<void> {
  if (typeof window === 'undefined') return
  const normalizedRole = normalizeUserRole(role) ?? 'resident'
  const resolvedProfile = createOfflineProfile(email, normalizedRole, token, profile)
  const snapshot: Omit<OfflineLoginSnapshot, never> = {
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    token,
    role: normalizedRole,
    profile: resolvedProfile,
  }
  await idbPutAuthSnapshot(snapshot)
}

/**
 * ⚠️ Only call this when a 401 confirms the token is permanently expired,
 * or when the user explicitly wants to remove offline access.
 * Do NOT call this on regular logout — the snapshot must survive logout
 * so the user can sign in offline.
 */
export async function clearOfflineLoginSnapshot(email?: string): Promise<void> {
  if (typeof window === 'undefined') return
  if (email) {
    await idbDeleteAuthSnapshot(email)
  }
}

/**
 * Get the cached profile for the most recently logged-in user.
 * Used when loading the app while offline (e.g. from AuthContext).
 */
export async function getOfflineCachedProfile(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null
  try {
    const snapshot = (await idbGetLatestAuthSnapshot()) as OfflineLoginSnapshot | null
    if (!snapshot) return null
    return buildProfileFromSnapshot(snapshot)
  } catch {
    return null
  }
}

/**
 * Update the stored profile for a user after a successful online sync.
 * Keeps the snapshot current without needing re-login.
 */
export async function updateOfflineLoginProfile(profile: UserProfile): Promise<void> {
  if (typeof window === 'undefined') return
  await idbUpdateAuthProfile(profile.email ?? '', profile).catch(() => {
    // ignore — profile update is best-effort
  })
}

/**
 * Attempt an offline login by matching email + password against stored snapshot.
 *
 * @returns {token, role, profile} on success, null on failure
 */
export async function tryOfflineLogin(
  email: string,
  password: string,
): Promise<{ token: string; role: UserRole; profile: UserProfile } | null> {
  if (typeof window === 'undefined') return null

  const key = email.trim().toLowerCase()

  let snapshot: OfflineLoginSnapshot | null = null
  try {
    snapshot = (await idbGetAuthSnapshot(key)) as OfflineLoginSnapshot | null
  } catch {
    snapshot = null
  }

  if (!snapshot) {
    console.warn('[offlineLogin] لم يتم إيجاد بيانات محفوظة للمستخدم:', key)
    return null
  }

  // 3. Verify password hash
  const passwordHash = await hashPassword(password)
  if (passwordHash !== snapshot.passwordHash) {
    console.warn('[offlineLogin] كلمة المرور غير صحيحة في وضع أوفلاين')
    return null
  }

  // 4. Restore session
  saveToken(snapshot.token)
  saveUserRole(snapshot.role)

  const profile = buildProfileFromSnapshot(snapshot)

  return {
    token: snapshot.token,
    role: snapshot.role,
    profile,
  }
}
