import { getUserRole } from '@/lib/auth/sessionRole'
import { isAdmin, resolveAuthRole, type UserRole } from '@/lib/auth/roleUtils'

export const LOGIN_REDIRECT_KEY = 'najat_login_redirect'

export function saveLoginRedirect(path: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(LOGIN_REDIRECT_KEY, path)
}

export function consumeLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null
  const path = sessionStorage.getItem(LOGIN_REDIRECT_KEY)
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY)
  return path
}

export function routeForRole(role: UserRole | null | undefined): string {
  if (role === 'admin') return '/admin'
  if (role === 'volunteer') return '/volunteer'
  return '/dashboard'
}

/**
 * Resolves the current role from the live Supabase session (passed in as
 * `apiRole` by AuthContext, decoded from the access token's JWT claims — see
 * lib/supabase/decodeRoleClaim.ts) or else the locally cached role — a
 * last-resort instant-paint fallback for the brief window before the session
 * resolves on page load.
 */
export function getCurrentAuthRole(apiRole?: unknown): UserRole | null {
  if (typeof window === 'undefined') {
    return resolveAuthRole(apiRole, undefined)
  }
  return resolveAuthRole(apiRole, getUserRole())
}

export function canAccessAdmin(apiRole?: unknown): boolean {
  return isAdmin(getCurrentAuthRole(apiRole))
}
