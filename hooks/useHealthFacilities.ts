'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchLiveNonHospitalFacilities } from '@/lib/health/healthFacilitiesBackend'
import { fetchAllHospitalPages } from '@/lib/health/hospitalsBackend'
import {
  facilityMatchesHealthSearch,
  getMockHealthFacilitiesResult,
  USE_MOCK_HEALTH_FACILITIES,
} from '@/lib/mocks/healthFacilitiesMockData'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

const HEALTH_MOCK_FALLBACK =
  process.env.NEXT_PUBLIC_HEALTH_MOCK === '1'

export type HealthFacilitiesQueryParams = {
  category?: FacilityCategory
  search?: string
  region?: 'north' | 'south' | null
}

function filterBySearch(list: HealthFacility[], search?: string) {
  if (!search?.trim()) return list
  return list.filter((f) => facilityMatchesHealthSearch(f, search))
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

export function useHealthFacilities(params?: HealthFacilitiesQueryParams) {
  const query = useQuery({
    queryKey: ['health-facilities', params],
    queryFn: async (): Promise<{ facilities: HealthFacility[]; total: number }> => {
      if (USE_MOCK_HEALTH_FACILITIES) {
        return getMockHealthFacilitiesResult({
          category: params?.category,
          search: params?.search,
          region: params?.region ?? null,
        })
      }

      if (params?.category === 'hospitals') {
        try {
          let facilities = await fetchAllHospitalPages()
          facilities = applyRegionFilter(facilities, params.region)
          facilities = filterBySearch(facilities, params.search)
          return { facilities, total: facilities.length }
        } catch (e) {
          if (HEALTH_MOCK_FALLBACK) {
            return getMockHealthFacilitiesResult({
              category: 'hospitals',
              search: params?.search,
              region: params?.region ?? null,
            })
          }
          throw e
        }
      }

      try {
        const response = await fetchLiveNonHospitalFacilities({
          category: params?.category,
          search: params?.search,
        })
        let facilities = response.facilities
        facilities = applyRegionFilter(facilities, params?.region)
        facilities = filterBySearch(facilities, params?.search)
        return { facilities, total: facilities.length }
      } catch (e) {
        if (HEALTH_MOCK_FALLBACK) {
          return getMockHealthFacilitiesResult({
            category: params?.category,
            search: params?.search,
            region: params?.region ?? null,
          })
        }
        throw e
      }
    },
    staleTime: 1000 * 60 * 2,
  })

  return query
}
