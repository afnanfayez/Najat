/**
 * Mints a well-formed-but-unsigned JWT for mock auth.
 *
 * Every consumer in this codebase (middleware.ts, lib/auth/roleUtils.ts::getRoleFromJwt,
 * and the local decoders in app/api/profile/route.ts / app/api/aid-requests/route.ts)
 * only base64-decodes the payload segment — none verify a signature — so this is safe
 * to use as a drop-in replacement for a real backend-issued token.
 */

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7

function base64UrlEncode(value: unknown): string {
  const json = JSON.stringify(value)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  const base64 =
    typeof btoa !== 'undefined'
      ? btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomSegment(length = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

export function mintFakeJwt(payload: {
  sub: string
  role: string
  email: string
  exp?: number
}): string {
  const header = { alg: 'none', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = {
    sub: payload.sub,
    role: payload.role,
    email: payload.email,
    iat: now,
    exp: payload.exp ?? now + SEVEN_DAYS_SECONDS,
  }
  return `${base64UrlEncode(header)}.${base64UrlEncode(fullPayload)}.${randomSegment()}`
}
