import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Privileged, server-only client that bypasses RLS entirely. No cookie
// handling — never use this to answer a request on behalf of a specific user.
// Reserved for admin aggregate queries and the one-off seed script. Never
// import this file from anything that runs in the browser.
export function createServiceRoleClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createServiceRoleClient() must never be called from the browser')
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
