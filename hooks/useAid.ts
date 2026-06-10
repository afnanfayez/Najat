'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllAidPages } from '@/lib/health/aidBackend'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import { getAllAid, putAid } from '@/lib/offline/db'

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
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
      let base: HumanitarianAid[] = []

      if (isOffline) {
        base = await getAllAid()
      } else {
        try {
          base = await fetchAllAidPages()
          if (base.length > 0) {
            putAid(base).catch(() => {})
          }
        } catch (e) {
          console.warn('Network fetch failed, falling back to offline DB', e)
          base = await getAllAid()
        }
      }

      let result = base

      if (params?.category && params.category !== 'all') {
        result = result.filter(
          (a) => a.category === params.category || a.category === 'all'
        )
      }

      if (params?.region && params.region !== 'الكل' && params.region !== 'فلترة') {
        const regionQ = params.region.toLowerCase()
        result = result.filter(
          (a) =>
            (a.regions && a.regions.some((r) => r.toLowerCase().includes(regionQ))) ||
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
