/**
 * GET /api/v1/providers — composed read-only view across all 5 health
 * facility types, backed by the `providers` Postgres view (UNION ALL, see
 * supabase/migrations/0004_health_facilities.sql). Optional `?type=` filter.
 * See docs/BACKEND_API_SPEC.md migration plan, Phase 4.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listEnvelope, errorEnvelope } from '@/lib/api-handlers/envelope'
import { parsePagination, buildMeta } from '@/lib/api-handlers/pagination'
import { toCamelCase } from '@/lib/api-handlers/caseMapping'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const searchParams = req.nextUrl.searchParams
  const { page, limit, from, to } = parsePagination(searchParams)
  const type = searchParams.get('type')

  let query = supabase.from('providers').select('*', { count: 'exact' }).is('deleted_at', null)
  if (type) query = query.eq('type', type)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) return errorEnvelope(error.message, 500)

  const meta = buildMeta(page, limit, count ?? 0)
  const items = (data ?? []).map((row) => {
    const { geo: _geo, ...rest } = row as Record<string, unknown>
    return toCamelCase(rest)
  })
  return listEnvelope(items, meta)
}
