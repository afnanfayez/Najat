export type UserRole = 'admin' | 'volunteer' | 'resident'

const USER_ROLES: UserRole[] = ['admin', 'volunteer', 'resident']

export function normalizeUserRole(raw: unknown): UserRole | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim().toLowerCase()
  if (value === 'admin' || value === 'administrator') return 'admin'
  if (value === 'volunteer') return 'volunteer'
  if (value === 'resident' || value === 'user') return 'resident'
  return USER_ROLES.includes(value as UserRole) ? (value as UserRole) : null
}

export function getRoleFromJwt(token: string | null | undefined): UserRole | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(atob(base64)) as { role?: unknown }
    return normalizeUserRole(json.role)
  } catch {
    return null
  }
}

/** Prefer API role, then JWT (current session), then saved role. */
export function resolveAuthRole(
  apiRole: unknown,
  options?: { storedRole?: unknown; token?: string | null },
): UserRole | null {
  const fromApi = normalizeUserRole(apiRole)
  if (fromApi) return fromApi

  const fromJwt = getRoleFromJwt(options?.token)
  if (fromJwt) return fromJwt

  return normalizeUserRole(options?.storedRole)
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير',
  volunteer: 'متطوع',
  resident: 'مستفيد',
}

export const ROLE_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  admin:     { bg: 'bg-purple-100', text: 'text-purple-700' },
  volunteer: { bg: 'bg-green-100',  text: 'text-green-700'  },
  resident:  { bg: 'bg-orange-100', text: 'text-orange-600' },
}

export const isAdmin = (role?: string | null): boolean => role === 'admin'
export const isVolunteerOrAdmin = (role?: string | null): boolean =>
  role === 'admin' || role === 'volunteer'

export function roleLabel(role?: string | null): string {
  return role ? (ROLE_LABELS[role] ?? role) : 'مستفيد'
}

export function roleBadgeStyle(role?: string | null): { bg: string; text: string } {
  return (role ? ROLE_BADGE_STYLES[role] : undefined) ?? ROLE_BADGE_STYLES.resident
}
