import { request } from '@/lib/api/api'
import type {
  AdminHealthContentListResponse,
  AdminHealthFacilitiesListResponse,
  AdminHealthFacilitiesQueryParams,
  AdminHealthContentQueryParams,
  AdminHealthFacility,
  AdminHealthMedicalContent,
  AdminHealthStatsDto,
  CreateAdminHealthFacilityBody,
  UpdateAdminHealthFacilityBody,
} from '@/schemas/adminHealth'

const V1 = '/v1'

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function unwrapList<T>(raw: unknown, key: string): T[] {
  if (!raw || typeof raw !== 'object') return []
  const obj = raw as Record<string, unknown>
  if (Array.isArray(obj[key])) return obj[key] as T[]
  if (obj.data && typeof obj.data === 'object') {
    return unwrapList(obj.data, key)
  }
  if (Array.isArray(obj.data)) return obj.data as T[]
  return []
}

function normalizeFacilitiesResponse(raw: unknown): AdminHealthFacilitiesListResponse {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    const payload =
      obj.data && typeof obj.data === 'object'
        ? (obj.data as Record<string, unknown>)
        : obj

    const facilities = (
      Array.isArray(payload.facilities)
        ? payload.facilities
        : unwrapList<AdminHealthFacility>(raw, 'facilities')
    ) as AdminHealthFacility[]

    const stats = (payload.stats ?? obj.stats) as AdminHealthStatsDto | undefined

    if (facilities.length > 0 || stats) {
      return {
        facilities,
        stats: stats ?? {
          totalFacilities: facilities.length,
          activeNow: facilities.filter((f) => f.status === 'open').length,
          underMaintenance: facilities.filter((f) => f.status === 'maintenance')
            .length,
        },
      }
    }
  }

  return {
    facilities: [],
    stats: { totalFacilities: 0, activeNow: 0, underMaintenance: 0 },
  }
}

function normalizeContentResponse(raw: unknown): AdminHealthContentListResponse {
  const items = unwrapList<AdminHealthMedicalContent>(raw, 'items')
  if (items.length > 0) return { items }

  const articles = unwrapList<AdminHealthMedicalContent>(raw, 'articles')
  return { items: articles }
}

export async function fetchAdminHealthFacilitiesFromApi(
  params: AdminHealthFacilitiesQueryParams = {},
): Promise<AdminHealthFacilitiesListResponse> {
  const query = buildQuery({
    search: params.search,
    region: params.region !== 'all' ? params.region : undefined,
    status: params.status !== 'all' ? params.status : undefined,
  })
  const raw = await request(`${V1}/admin/health/facilities${query}`)
  return normalizeFacilitiesResponse(raw)
}

export async function fetchAdminHealthContentFromApi(
  params: AdminHealthContentQueryParams = {},
): Promise<AdminHealthContentListResponse> {
  const query = buildQuery({
    search: params.search,
    limit: params.limit,
  })
  const raw = await request(`${V1}/admin/health/content${query}`)
  return normalizeContentResponse(raw)
}

export async function createAdminHealthFacilityFromApi(
  body: CreateAdminHealthFacilityBody | FormData,
): Promise<AdminHealthFacility> {
  const raw = await request(`${V1}/admin/health/facilities`, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
  const obj = raw as Record<string, unknown>
  const facility = (obj.data ?? obj.facility ?? obj) as AdminHealthFacility
  return facility
}

export async function updateAdminHealthFacilityFromApi(
  id: string,
  body: UpdateAdminHealthFacilityBody,
): Promise<AdminHealthFacility> {
  const raw = await request(`${V1}/admin/health/facilities/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  const obj = raw as Record<string, unknown>
  return (obj.data ?? obj.facility ?? obj) as AdminHealthFacility
}

export async function deleteAdminHealthFacilityFromApi(id: string): Promise<void> {
  await request(`${V1}/admin/health/facilities/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
