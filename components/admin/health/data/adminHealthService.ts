import {
  fetchAdminHealthContentFromApi,
  fetchAdminHealthFacilitiesFromApi,
} from '@/lib/api/adminHealth'
import { USE_MOCK_ADMIN_HEALTH } from '@/lib/mocks/mockConfig'
import {
  ADMIN_HEALTH_FACILITIES,
  ADMIN_HEALTH_MEDICAL_CONTENT,
  ADMIN_HEALTH_STATS,
} from '@/lib/mocks/adminHealthMockData'
import type {
  AdminHealthContentListResponse,
  AdminHealthContentQueryParams,
  AdminHealthFacilitiesListResponse,
  AdminHealthFacilitiesQueryParams,
  AdminHealthMedicalContent,
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
} from '@/schemas/adminHealth'

export type {
  AdminHealthFacilitiesQueryParams,
  AdminHealthContentQueryParams,
  AdminHealthFacilitiesListResponse,
  AdminHealthContentListResponse,
}

function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function filterMockFacilities(
  params: AdminHealthFacilitiesQueryParams,
): AdminHealthFacilitiesListResponse {
  const q = normalizeSearch(params.search)
  const region = params.region ?? 'all'
  const status = params.status ?? 'all'

  const facilities = ADMIN_HEALTH_FACILITIES.filter((facility) => {
    if (region !== 'all' && facility.region !== region) return false
    if (status !== 'all' && facility.status !== status) return false
    if (!q) return true
    return (
      facility.name.toLowerCase().includes(q) ||
      facility.address.toLowerCase().includes(q)
    )
  })

  return { facilities, stats: ADMIN_HEALTH_STATS }
}

function filterMockContent(
  params: AdminHealthContentQueryParams,
): AdminHealthContentListResponse {
  const q = normalizeSearch(params.search)
  let items: AdminHealthMedicalContent[] = ADMIN_HEALTH_MEDICAL_CONTENT

  if (q) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q),
    )
  }

  if (params.limit && params.limit > 0) {
    items = items.slice(0, params.limit)
  }

  return { items }
}

export async function fetchAdminHealthFacilities(
  params: AdminHealthFacilitiesQueryParams = {},
): Promise<AdminHealthFacilitiesListResponse> {
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockFacilities(params)
  }

  try {
    return await fetchAdminHealthFacilitiesFromApi(params)
  } catch {
    return filterMockFacilities(params)
  }
}

export async function fetchAdminHealthMedicalContent(
  params: AdminHealthContentQueryParams = {},
): Promise<AdminHealthContentListResponse> {
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockContent(params)
  }

  try {
    return await fetchAdminHealthContentFromApi(params)
  } catch {
    return filterMockContent(params)
  }
}

export async function fetchAdminHealthLatestContent(
  limit = 3,
): Promise<AdminHealthMedicalContent[]> {
  const { items } = await fetchAdminHealthMedicalContent({ limit })
  return items
}

export type AdminHealthFilterState = {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
}

export function toFacilitiesQueryParams(
  filters: AdminHealthFilterState,
): AdminHealthFacilitiesQueryParams {
  return {
    search: filters.search.trim() || undefined,
    region: filters.region,
    status: filters.status,
  }
}

export function toContentQueryParams(search: string): AdminHealthContentQueryParams {
  return {
    search: search.trim() || undefined,
  }
}
