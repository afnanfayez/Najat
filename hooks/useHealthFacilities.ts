'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchLiveNonHospitalFacilities } from '@/lib/health/healthFacilitiesBackend'
import { fetchAllHospitalPages } from '@/lib/health/hospitalsBackend'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'
import { getFacilitiesByCategory, getAllFacilities, putFacilities } from '@/lib/offline/db'

export type HealthFacilitiesQueryParams = {
  category?: FacilityCategory
  search?: string
  region?: 'north' | 'south' | null
}

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

async function fetchCategoryFacilities(
  category?: FacilityCategory,
): Promise<{ facilities: HealthFacility[]; total: number }> {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  if (isOffline) {
    const facilities = await fetchFromIndexedDB(category)
    return { facilities, total: facilities.length }
  }

  try {
    let facilities: HealthFacility[] = []
    if (category === 'hospitals') {
      facilities = await fetchAllHospitalPages()
    } else {
      const res = await fetchLiveNonHospitalFacilities({ category })
      facilities = res.facilities
    }

    if (facilities.length > 0) {
      putFacilities(facilities).catch(() => {})
    }

    return { facilities, total: facilities.length }
  } catch (e) {
    console.warn('Network request failed, falling back to offline DB', e)
    const facilities = await fetchFromIndexedDB(category)
    return { facilities, total: facilities.length }
  }
}

export function useHealthFacilities(params?: HealthFacilitiesQueryParams) {
  const category = params?.category

  const baseQuery = useQuery({
    queryKey: ['health-facilities', category],
    queryFn: () => fetchCategoryFacilities(category),
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
    /** القائمة الكاملة قبل فلترة البحث/المنطقة — لحساب أرقام المسارات */
    catalog: baseQuery.data,
  }
}
