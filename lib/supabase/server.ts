import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// For use in Server Components / Route Handlers. RLS is enforced using the
// calling user's own session — never bypasses row-level security.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll called from a Server Component — safe to ignore if
            // middleware.ts is already refreshing the session on every request.
          }
        },
      },
    },
  )
}
