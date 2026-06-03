import { getToken } from '@/lib/api/auth'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as Record<string, unknown>
  } catch {
    return null
  }
}

function readId(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return null
}

export function getUserIdFromToken(token?: string | null): string | null {
  const value = token ?? getToken()
  if (!value) return null
  const json = decodeJwtPayload(value)
  if (!json) return null
  return readId(json.sub) ?? readId(json.id) ?? readId(json.userId)
}

/** Stable React Query key per login session — survives JWT field differences. */
export function getSessionCacheKey(token?: string | null): string {
  const value = token ?? getToken()
  if (!value) return 'none'
  const userId = getUserIdFromToken(value)
  if (userId) return userId
  return `tok_${value.slice(-24)}`
}

export function getProfileQueryKey(token?: string | null) {
  return ['profile', 'me', getSessionCacheKey(token)] as const
}
