'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchAdminHealthLatestContent,
  fetchAdminHealthMedicalContent,
  type AdminHealthContentQueryParams,
} from '@/components/admin/health/data/adminHealthService'

export function useAdminHealthMedicalContent(params: AdminHealthContentQueryParams) {
  const query = useQuery({
    queryKey: ['admin-health-content', params],
    queryFn: () => fetchAdminHealthMedicalContent(params),
  })

  return {
    ...query,
    items: query.data?.items ?? [],
  }
}

export function useAdminHealthLatestContent(limit = 3) {
  const query = useQuery({
    queryKey: ['admin-health-content', 'latest', limit],
    queryFn: () => fetchAdminHealthLatestContent(limit),
  })

  return {
    ...query,
    items: query.data ?? [],
  }
}
