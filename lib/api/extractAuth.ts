import { normalizeUserRole } from '@/lib/auth/roleUtils'

/** Normalize login/register-style responses: flat OpenAPI vs Nest-wrapped `{ data: ... }`. */

type AuthShape = {
  token: string | null
  role: string | undefined
}

function readToken(obj: Record<string, unknown>): string | null {
  const t = obj.token ?? obj.accessToken ?? obj.access_token
  return typeof t === 'string' && t.length > 0 ? t : null
}

function readRole(obj: Record<string, unknown>): string | undefined {
  const direct = normalizeUserRole(obj.role)
  if (direct) return direct

  const user = obj.user
  if (user && typeof user === 'object' && user !== null) {
    const fromUser = normalizeUserRole(
      (user as Record<string, unknown>).role,
    )
    if (fromUser) return fromUser
  }
  return undefined
}

export function extractAuthPayload(res: unknown): AuthShape {
  if (!res || typeof res !== 'object') {
    return { token: null, role: undefined }
  }
  const r = res as Record<string, unknown>

  const topToken = readToken(r)
  if (topToken) {
    return { token: topToken, role: readRole(r) }
  }

  const data = r.data
  if (data && typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    const token = readToken(d)
    if (token) {
      return { token, role: readRole(d) }
    }
  }

  return { token: null, role: undefined }
}
