'use client'

import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLiveNonHospitalFacilities } from '@/lib/health/healthFacilitiesBackend'
import { fetchAllHospitalPages } from '@/lib/health/hospitalsBackend'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'
import { getFacilitiesByCategory, getAllFacilities, putFacilities } from '@/lib/offline/db'

export type HealthFacilitiesQueryParams = {
  category?: FacilityCategory
  search?: string
  region?: 'north' | 'south' | null
}

type HealthFacilitiesResult = {
  facilities: HealthFacility[]
  total: number
  source: 'cache' | 'network' | 'empty'
  refreshing?: boolean
}

const INITIAL_NETWORK_WAIT_MS = 1_500

function facilityMatchesSearch(f: HealthFacility, search: string): boolean {
  const q = search.toLowerCase()
  if (f.name.toLowerCase().includes(q)) return true
  if (f.address?.toLowerCase().includes(q)) return true
  if (f.detail?.facilityKindLabel?.toLowerCase().includes(q)) return true
  const srv = f.detail?.hospitalServices?.map((s) => s.label.toLowerCase()) || []
  if (srv.some((s) => s.includes(q))) return true
  return false
}

function filterBySearch(list: HealthFacility[], search?: string) {
  if (!search?.trim()) return list
  return list.filter((f) => facilityMatchesSearch(f, search))
}

function applyRegionFilter(
  list: HealthFacility[],
  region: 'north' | 'south' | null | undefined,
): HealthFacility[] {
  if (!region) return list
  const hasAny = list.some((f) => f.region != null)
  if (!hasAny) return list
  return list.filter((f) => f.region === region)
}

async function fetchFromIndexedDB(category?: FacilityCategory): Promise<HealthFacility[]> {
  if (!category) return getAllFacilities()
  return getFacilitiesByCategory(category)
}

function timeout<T>(ms: number): Promise<T> {
  return new Promise((_, reject) => {
    globalThis.setTimeout(() => reject(new Error('slow-network')), ms)
  })
}

async function fetchLiveFacilities(category?: FacilityCategory): Promise<HealthFacility[]> {
  if (category === 'hospitals') {
    return fetchAllHospitalPages()
  }

  const res = await fetchLiveNonHospitalFacilities({ category })
  return res.facilities
}

async function fetchCategoryFacilities(
  category?: FacilityCategory,
  onFreshData?: (facilities: HealthFacility[]) => void,
): Promise<HealthFacilitiesResult> {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  if (isOffline) {
    const facilities = await fetchFromIndexedDB(category)
    return { facilities, total: facilities.length, source: 'cache' }
  }

  const cached = await fetchFromIndexedDB(category)
  const livePromise = fetchLiveFacilities(category)

  const saveFresh = (fresh: HealthFacility[]) => {
    if (fresh.length > 0) {
      putFacilities(fresh).catch(() => {})
      onFreshData?.(fresh)
    }
  }

  if (cached.length > 0) {
    livePromise
      .then(saveFresh)
      .catch(() => {
        // keep cached data visible
      })
    return {
      facilities: cached,
      total: cached.length,
      source: 'cache',
      refreshing: true,
    }
  }

  try {
    const facilities = await Promise.race([
      livePromise,
      timeout<HealthFacility[]>(INITIAL_NETWORK_WAIT_MS),
    ])

    saveFresh(facilities)
    return { facilities, total: facilities.length, source: 'network' }
  } catch (e) {
    if (e instanceof Error && e.message === 'slow-network') {
      livePromise
        .then(saveFresh)
        .catch(() => {
          // keep the non-blocking slow state visible until the user retries
        })
      return { facilities: [], total: 0, source: 'empty', refreshing: true }
    }

    console.warn('Network request failed, falling back to offline DB', e)
    const fallback = await fetchFromIndexedDB(category)
    return {
      facilities: fallback,
      total: fallback.length,
      source: fallback.length > 0 ? 'cache' : 'empty',
    }
  }
}

export function useHealthFacilities(params?: HealthFacilitiesQueryParams) {
  const category = params?.category
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['health-facilities', category] as const, [category])

  const baseQuery = useQuery({
    queryKey,
    queryFn: () =>
      fetchCategoryFacilities(category, (fresh) => {
        queryClient.setQueryData<HealthFacilitiesResult>(queryKey, {
          facilities: fresh,
          total: fresh.length,
          source: 'network',
        })
      }),
    staleTime: 1000 * 60 * 2,
    retry: (count) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return false
      return count < 1
    },
    refetchOnWindowFocus: false,
  })

  const data = useMemo(() => {
    if (!baseQuery.data) return undefined
    let facilities = baseQuery.data.facilities
    facilities = applyRegionFilter(facilities, params?.region)
    facilities = filterBySearch(facilities, params?.search)
    return { facilities, total: facilities.length }
  }, [baseQuery.data, params?.region, params?.search])

  return {
    ...baseQuery,
    data,
    isLoading: baseQuery.isLoading && !baseQuery.data,
    isBackgroundRefreshing: baseQuery.data?.refreshing === true,
    /** القائمة الكاملة قبل فلترة البحث/المنطقة — لحساب أرقام المسارات */
    catalog: baseQuery.data,
  }
}
