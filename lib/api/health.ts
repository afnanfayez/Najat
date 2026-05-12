import { request } from '@/lib/api/api'
import type { HealthFacilitiesResponse, FacilityCategory } from '@/schemas/healthFacility'

export const healthAPI = {
  getFacilities: (params?: {
    category?: FacilityCategory
    search?: string
  }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.search)   qs.set('search', params.search)
    const query = qs.toString()
    return request(
      `/v1/health/facilities${query ? `?${query}` : ''}`,
    ) as Promise<HealthFacilitiesResponse>
  },
}
