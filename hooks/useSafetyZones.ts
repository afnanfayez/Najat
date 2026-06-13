'use client'

import { useQuery } from '@tanstack/react-query'
import { safetyAPI } from '@/lib/api/safety'
import type { DangerZoneDto } from '@/schemas/safetyApi'

const ZONES_QUERY_KEY = ['safety', 'zones'] as const

/**
 * Fetches all danger zones directly via GET /v1/safety/zones.
 * Use this when you need a flat list of zones (e.g. admin management table)
 * rather than the full map-data bundle.
 */
export function useSafetyZones(params?: { page?: number; limit?: number }) {
  return useQuery<DangerZoneDto[]>({
    queryKey: [...ZONES_QUERY_KEY, params],
    queryFn: () => safetyAPI.listZones(params),
    staleTime: 60_000,
  })
}

/**
 * Fetches a single danger zone by ID via GET /v1/safety/zones/{id}.
 */
export function useSafetyZoneById(id: string | undefined) {
  return useQuery<DangerZoneDto>({
    queryKey: [...ZONES_QUERY_KEY, id],
    queryFn: () => safetyAPI.getZoneById(id!),
    enabled: !!id,
    staleTime: 60_000,
  })
}
