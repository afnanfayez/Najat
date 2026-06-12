const COOKIE_NAME = 'auth_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function saveToken(token: string): void {
  if (typeof document === 'undefined') return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; SameSite=Strict; path=/${secure}; Max-Age=${COOKIE_MAX_AGE}`
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function removeToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; SameSite=Strict; path=/; Max-Age=0`
}

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
