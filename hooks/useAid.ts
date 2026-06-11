'use client'

import { useMemo, useState, useEffect } from 'react'
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

function filterAidList(
  base: HumanitarianAid[],
  params?: AidQueryParams,
  debouncedSearch?: string,
): HumanitarianAid[] {
  let result = base

  if (params?.category && params.category !== 'all') {
    result = result.filter(
      (a) => a.category === params.category || a.category === 'all',
    )
  }

  if (params?.region && params.region !== 'الكل' && params.region !== 'فلترة') {
    const regionQ = params.region.toLowerCase()
    result = result.filter(
      (a) =>
        (a.regions && a.regions.some((r) => r.toLowerCase().includes(regionQ))) ||
        a.provider.toLowerCase().includes(regionQ) ||
        a.name.toLowerCase().includes(regionQ),
    )
  }

  const search = debouncedSearch?.trim()
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }

  return result
}

async function fetchAidCatalog(): Promise<HumanitarianAid[]> {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  if (isOffline) {
    return getAllAid()
  }

  const cached = await getAllAid()
  if (cached.length > 0) {
    fetchAllAidPages()
      .then((fresh) => {
        if (fresh.length > 0) putAid(fresh).catch(() => {})
      })
      .catch(() => {})
    return cached
  }

  try {
    const base = await fetchAllAidPages()
    if (base.length > 0) {
      putAid(base).catch(() => {})
    }
    return base
  } catch (e) {
    console.warn('Network fetch failed, falling back to offline DB', e)
    return getAllAid()
  }
}

export function useAid(params?: AidQueryParams) {
  const debouncedSearch = useDebounced(params?.search ?? '', 350)

  const baseQuery = useQuery({
    queryKey: ['aid', 'catalog'],
    queryFn: fetchAidCatalog,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const data = useMemo(
    () => filterAidList(baseQuery.data ?? [], params, debouncedSearch),
    [baseQuery.data, params, debouncedSearch],
  )

  return {
    ...baseQuery,
    data,
    /** القائمة الكاملة قبل الفلترة — لحساب أرقام المسارات */
    catalog: baseQuery.data ?? [],
  }
}
