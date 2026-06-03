'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchAdminHealthFacilities,
  type AdminHealthFacilitiesQueryParams,
} from '@/components/admin/health/data/adminHealthService'

export function useAdminHealthFacilities(params: AdminHealthFacilitiesQueryParams) {
  const query = useQuery({
    queryKey: ['admin-health-facilities', params],
    queryFn: () => fetchAdminHealthFacilities(params),
  })

  return {
    ...query,
    facilities: query.data?.facilities ?? [],
    stats: query.data?.stats,
  }
}
