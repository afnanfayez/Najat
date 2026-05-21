'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { safetyAPI } from '@/lib/api/safety'
import { useAuth } from '@/context/AuthContext'

export function useSafetyMapData() {
  const { isHydrated } = useAuth()

  return useQuery({
    queryKey: ['safety', 'map-data'],
    queryFn: () => safetyAPI.getMapData({ limit: 100 }),
    enabled: isHydrated && Boolean(getToken()),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export function useSafetyCheck(lat: number | null, lng: number | null) {
  const { isHydrated } = useAuth()

  return useQuery({
    queryKey: ['safety', 'check', lat, lng],
    queryFn: () => safetyAPI.check({ lat: lat!, lng: lng! }),
    enabled: isHydrated && Boolean(getToken()) && lat != null && lng != null,
    staleTime: 1000 * 60,
    retry: 1,
  })
}
