'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllAidPages } from '@/lib/health/aidBackend'
import { MOCK_AID, USE_MOCK_AID } from '@/lib/mocks/aidMockData'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

export type AidQueryParams = {
  search?: string
  category?: string
  region?: string
}

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function useAid(params?: AidQueryParams) {
  const debouncedSearch = useDebounced(params?.search ?? '', 350)

  return useQuery({
    queryKey: ['aid', params?.category, debouncedSearch, params?.region],
    queryFn: async (): Promise<HumanitarianAid[]> => {
      const base: HumanitarianAid[] = USE_MOCK_AID
        ? MOCK_AID
        : await fetchAllAidPages()

      let result = base

      if (params?.category && params.category !== 'all') {
        result = result.filter((a) => a.category === params.category)
      }

      if (params?.region) {
        const regionQ = params.region.toLowerCase()
        result = result.filter(
          (a) =>
            a.provider.toLowerCase().includes(regionQ) ||
            a.name.toLowerCase().includes(regionQ)
        )
      }

      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim().toLowerCase()
        result = result.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q)),
        )
      }

      return result
    },
    staleTime: 1000 * 60 * 5,
  })
}
