import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope, listEnvelope } from './envelope'
import { parsePagination, buildMeta } from './pagination'
import { toCamelCase } from './caseMapping'

/**
 * Safety map domain — GeoJSON <-> geography conversion happens entirely in
 * SQL (supabase/migrations/0020_safety_geojson_rpcs.sql) since PostgREST's
 * default serialization of a `geography` column is not reliable GeoJSON.
 * Every handler here just calls the matching RPC and reshapes the result.
 * See docs/BACKEND_API_SPEC.md §8.
 */

function mapZoneRow(row: Record<string, unknown>) {
  return toCamelCase(row)
}

export async function listDangerZones(supabase: SupabaseClient, searchParams: URLSearchParams) {
  const { page, limit, from, to } = parsePagination(searchParams)
  const { data, error } = await supabase.rpc('list_danger_zones', {
    page_offset: from,
    page_size: to - from + 1,
  })
  if (error) return errorEnvelope(error.message, 500)
  const rows = (data ?? []) as Array<Record<string, unknown> & { total_count: number }>
  const totalItems = rows[0]?.total_count ?? 0
  const items = rows.map((r) => {
    const { total_count: _tc, ...rest } = r
    return mapZoneRow(rest)
  })
  const meta = buildMeta(page, limit, Number(totalItems))
  return listEnvelope(items, meta)
}

export async function getDangerZone(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.rpc('get_danger_zone', { zone_id: id })
  const row = Array.isArray(data) ? data[0] : null
  if (error || !row) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(mapZoneRow(row))
}

export async function createDangerZone(supabase: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('create_danger_zone', {
    p_description: body.description ?? '',
    p_danger_level: body.dangerLevel,
    p_area: body.area,
    p_is_active: body.isActive ?? true,
  })
  if (error) return errorEnvelope(error.message, 400)
  const row = Array.isArray(data) ? data[0] : null
  if (!row) return errorEnvelope('تعذّر إنشاء المنطقة', 500)
  return envelope(mapZoneRow(row), 201)
}

export async function updateDangerZone(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('update_danger_zone', {
    zone_id: id,
    p_description: body.description ?? null,
    p_danger_level: body.dangerLevel ?? null,
    p_area: body.area ?? null,
    p_is_active: body.isActive ?? null,
  })
  if (error) return errorEnvelope(error.message, 400)
  const row = Array.isArray(data) ? data[0] : null
  if (!row) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(mapZoneRow(row))
}

async function softDelete(supabase: SupabaseClient, table: string, id: string) {
  const { data, error } = await supabase
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope({ success: true })
}

export const removeDangerZone = (supabase: SupabaseClient, id: string) =>
  softDelete(supabase, 'danger_zones', id)
export const removeSafeRoad = (supabase: SupabaseClient, id: string) =>
  softDelete(supabase, 'safe_roads', id)
export const removeResourcePoint = (supabase: SupabaseClient, id: string) =>
  softDelete(supabase, 'resource_points', id)

export async function createSafeRoad(supabase: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('create_safe_road', {
    p_name: body.name,
    p_description: body.description ?? '',
    p_path: body.path,
    p_is_active: body.isActive ?? true,
  })
  if (error) return errorEnvelope(error.message, 400)
  const row = Array.isArray(data) ? data[0] : null
  if (!row) return errorEnvelope('تعذّر إنشاء الطريق', 500)
  return envelope(mapZoneRow(row), 201)
}

export async function createResourcePoint(supabase: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('create_resource_point', {
    p_name: body.name,
    p_type: body.type,
    p_location: body.location,
    p_is_active: body.isActive ?? true,
  })
  if (error) return errorEnvelope(error.message, 400)
  const row = Array.isArray(data) ? data[0] : null
  if (!row) return errorEnvelope('تعذّر إنشاء نقطة الموارد', 500)
  return envelope(mapZoneRow(row), 201)
}

export async function getSafetyMapData(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('safety_map_data')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}

export async function checkSafety(supabase: SupabaseClient, lat: number, lng: number) {
  const { data, error } = await supabase.rpc('safety_check', { p_lat: lat, p_lng: lng })
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}
