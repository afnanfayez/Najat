/**
 * GET /v1/admin/alerts — read-only per docs/BACKEND_API_SPEC.md §5 (no
 * create/update/resolve endpoint exists in the documented contract).
 */
import { createClient } from '@/lib/supabase/server'
import { envelope, errorEnvelope } from '@/lib/api-handlers/envelope'
import { toCamelCase } from '@/lib/api-handlers/caseMapping'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false })
  if (error) return errorEnvelope(error.message, 500)
  return envelope((data ?? []).map((row) => toCamelCase(row)))
}
