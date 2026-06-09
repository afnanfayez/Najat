import { saveToken } from '@/lib/api/auth'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { getUserIdFromToken } from '@/lib/auth/tokenIdentity'
import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import type { UserProfile } from '@/schemas/userProfile'

const OFFLINE_LOGIN_KEY = 'najat_offline_login'

type OfflineLoginSnapshot = {
  email: string
  passwordHash: string
  token: string
  role: UserRole
  profile: UserProfile | null
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function readSnapshot(): OfflineLoginSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(OFFLINE_LOGIN_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OfflineLoginSnapshot
  } catch {
    return null
  }
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
  const snapshot: OfflineLoginSnapshot = {
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    token,
    role: normalizedRole,
    profile: resolvedProfile,
  }
  localStorage.setItem(OFFLINE_LOGIN_KEY, JSON.stringify(snapshot))
}

export function clearOfflineLoginSnapshot(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(OFFLINE_LOGIN_KEY)
}

export function getOfflineCachedProfile(): UserProfile | null {
  const snapshot = readSnapshot()
  if (!snapshot) return null
  return buildProfileFromSnapshot(snapshot)
}

export function updateOfflineLoginProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return
  const snapshot = readSnapshot()
  if (!snapshot) return
  snapshot.profile = profile
  snapshot.role = normalizeUserRole(profile.role) ?? snapshot.role
  localStorage.setItem(OFFLINE_LOGIN_KEY, JSON.stringify(snapshot))
}

export async function tryOfflineLogin(
  email: string,
  password: string,
): Promise<{ token: string; role: UserRole; profile: UserProfile } | null> {
  const snapshot = readSnapshot()
  if (!snapshot) return null
  if (snapshot.email !== email.trim().toLowerCase()) return null

  const passwordHash = await hashPassword(password)
  if (passwordHash !== snapshot.passwordHash) return null

  saveToken(snapshot.token)
  saveUserRole(snapshot.role)

  const profile = buildProfileFromSnapshot(snapshot)
  updateOfflineLoginProfile(profile)

  return {
    token: snapshot.token,
    role: snapshot.role,
    profile,
  }
}
