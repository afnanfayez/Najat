import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { decodeRoleClaim } from './decodeRoleClaim'

// The @supabase/ssr documented middleware pattern: refreshes the auth cookie
// on every navigation (if expired) and hands back the response carrying the
// refreshed cookies, the verified current user, and their role.
//
// `role` is read by decoding the just-verified session's access token, NOT
// from `user.app_metadata` — the Custom Access Token Hook
// (supabase/migrations/0014_auth_hook.sql) injects `role` into the issued
// JWT's claims, but that does not propagate into the `user` object GoTrue
// returns (verified empirically — see lib/supabase/decodeRoleClaim.ts).
// getUser() (not getSession()) is used to authenticate the request, per
// @supabase/ssr's guidance — it revalidates against the Auth server instead
// of trusting the cookie as-is. The token decoded for `role` is the same
// token getUser() just verified, so this isn't a "trust an unverified
// cookie" shortcut.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    role = decodeRoleClaim(session?.access_token)
  }

  return { response, user, role }
}
