/** Persisted backend role for gating ADMIN/VOLUNTEER features (optional until login sends role). */
export const SESSION_ROLE_KEY = 'auth_role'

export function saveUserRole(role: string | null | undefined): void {
  if (typeof window === 'undefined') return
  if (!role) {
    localStorage.removeItem(SESSION_ROLE_KEY)
    return
  }
  localStorage.setItem(SESSION_ROLE_KEY, role)
}

export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_ROLE_KEY)
}

export function removeUserRole(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_ROLE_KEY)
}
