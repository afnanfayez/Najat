import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope, listEnvelope } from './envelope'
import { parsePagination, buildMeta } from './pagination'
import { toSnakeCase, toCamelCase } from './caseMapping'

export interface CrudFactoryConfig {
  /** Postgres table name. */
  table: string
  /** Filter out soft-deleted rows on list/nearby (not on getById — see spec §12.3). */
  softDelete?: boolean
  /** Enables GET .../nearby via the nearby_geo() RPC (0017_nearby_rpc.sql). */
  nearbyEnabled?: boolean
  /** snake_case column patched by the lightweight status-only endpoint. */
  statusField?: string
  defaultLimit?: number
}

/** Internal-only columns never exposed over the API (not part of the documented contract). */
const INTERNAL_COLUMNS = ['geo']

function stripInternalColumns(row: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...row }
  for (const key of INTERNAL_COLUMNS) delete clone[key]
  return clone
}

/**
 * Generic Route Handler CRUD+nearby resource backed by Supabase, mirroring
 * lib/mocks/crud/createCrudResource.ts's public API against Postgres instead
 * of localStorage — the server-side counterpart used by every domain that
 * used registerCrudRoutes() in the mock router (aid points, the 5 health
 * facility types, articles, safety zones/roads/resource-points).
 */
export function createSupabaseCrudHandlers(config: CrudFactoryConfig) {
  const statusField = config.statusField ?? 'status'
  const defaultLimit = config.defaultLimit ?? 20

  async function list(supabase: SupabaseClient, searchParams: URLSearchParams) {
    const { page, limit, from, to } = parsePagination(searchParams, defaultLimit)
    let query = supabase.from(config.table).select('*', { count: 'exact' })
    if (config.softDelete) query = query.is('deleted_at', null)
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)
    if (error) return errorEnvelope(error.message, 500)
    const meta = buildMeta(page, limit, count ?? 0)
    return listEnvelope((data ?? []).map((row) => toCamelCase(stripInternalColumns(row))), meta)
  }

  async function nearby(supabase: SupabaseClient, searchParams: URLSearchParams) {
    if (!config.nearbyEnabled) return errorEnvelope('Not found', 404)
    const lat = Number(searchParams.get('latitude') ?? searchParams.get('lat') ?? '0')
    const lng = Number(searchParams.get('longitude') ?? searchParams.get('lng') ?? '0')
    const radius = Number(searchParams.get('radius') ?? '5000')
    const { page, limit, from, to } = parsePagination(searchParams, defaultLimit)

    // type_filter is only meaningful for the `providers` view (the only
    // nearby-enabled table/view with a `type` column) — harmless no-op
    // elsewhere since callers won't send ?type= for other resources.
    const { data, error } = await supabase.rpc('nearby_geo', {
      table_name: config.table,
      origin_lat: lat,
      origin_lng: lng,
      radius_m: radius,
      page_offset: from,
      page_size: to - from + 1,
      type_filter: searchParams.get('type'),
    })
    if (error) return errorEnvelope(error.message, 500)

    const rows = (data ?? []) as Array<{ row_data: Record<string, unknown>; distance: number; total_count: number }>
    const totalItems = rows[0]?.total_count ?? 0
    const items = rows.map((r) => ({
      ...toCamelCase(stripInternalColumns(r.row_data)),
      distance: r.distance,
    }))
    const meta = buildMeta(page, limit, Number(totalItems))
    return listEnvelope(items, meta)
  }

  async function getById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase.from(config.table).select('*').eq('id', id).single()
    if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
    return envelope(toCamelCase(stripInternalColumns(data)))
  }

  async function create(supabase: SupabaseClient, body: Record<string, unknown>) {
    const record = toSnakeCase(body)
    delete record.id
    delete record.created_at
    delete record.updated_at
    const { data, error } = await supabase.from(config.table).insert(record).select('*').single()
    if (error) return errorEnvelope(error.message, 400)
    return envelope(toCamelCase(stripInternalColumns(data)), 201)
  }

  async function update(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
    const record = toSnakeCase(body)
    delete record.id
    delete record.created_at
    const { data, error } = await supabase
      .from(config.table)
      .update(record)
      .eq('id', id)
      .select('*')
      .single()
    if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
    return envelope(toCamelCase(stripInternalColumns(data)))
  }

  async function updateStatus(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
    const value = body[statusField] ?? body.status
    const { data, error } = await supabase
      .from(config.table)
      .update({ [statusField]: value })
      .eq('id', id)
      .select('*')
      .single()
    if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
    return envelope(toCamelCase(stripInternalColumns(data)))
  }

  async function remove(supabase: SupabaseClient, id: string) {
    if (config.softDelete) {
      const { data, error } = await supabase
        .from(config.table)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single()
      if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
      return envelope({ success: true })
    }
    const { error } = await supabase.from(config.table).delete().eq('id', id)
    if (error) return errorEnvelope(error.message, 400)
    return envelope({ success: true })
  }

  return { list, nearby, getById, create, update, updateStatus, remove }
}
