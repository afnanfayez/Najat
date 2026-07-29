/**
 * Extracts `app_metadata.role` from a Supabase access token's JWT payload.
 *
 * This is necessary because the Custom Access Token Hook
 * (supabase/migrations/0014_auth_hook.sql) injects `role` into the *issued
 * JWT's claims* — which is what `auth.jwt()` reads server-side in every RLS
 * policy — but does NOT update the `session.user.app_metadata` object
 * supabase-js exposes (that object reflects the raw `auth.users` row as
 * returned by the GoTrue API, not the hook-decorated token). Verified this
 * empirically: after sign-in, `data.user.app_metadata.role` is undefined
 * while the decoded `data.session.access_token`'s payload has
 * `app_metadata.role` set correctly.
 *
 * Safe to decode without verifying the signature here: this is only ever
 * called on a token supabase-js already holds as the current session's
 * access token, which was itself obtained via a Supabase Auth call (sign-in,
 * token refresh, or a just-verified `getUser()` — see
 * lib/supabase/middleware.ts). Real authorization is enforced server-side by
 * RLS regardless of what this returns; this value is for UI routing only.
 */
export function decodeRoleClaim(accessToken: string | undefined | null): string | null {
  if (!accessToken) return null
  try {
    const payloadSegment = accessToken.split('.')[1]
    if (!payloadSegment) return null
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(atob(base64)) as { app_metadata?: { role?: unknown } }
    const role = json.app_metadata?.role
    return typeof role === 'string' ? role : null
  } catch {
    return null
  }
}
