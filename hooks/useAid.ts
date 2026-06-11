'use client'

import { useMemo, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllAidPages } from '@/lib/health/aidBackend'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import { getAllAid, putAid } from '@/lib/offline/db'

export type AidQueryParams = {
  search?: string
  category?: string
  region?: string
}

const INITIAL_NETWORK_WAIT_MS = 4_500

function timeout<T>(ms: number): Promise<T> {
  return new Promise((_, reject) => {
    globalThis.setTimeout(() => reject(new Error('slow-network')), ms)
  })
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

async function fetchAidCatalog(
  onFreshData?: (items: HumanitarianAid[]) => void,
): Promise<HumanitarianAid[]> {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  if (isOffline) {
    return getAllAid()
  }

  const cached = await getAllAid()
  const livePromise = fetchAllAidPages()
  const saveFresh = (fresh: HumanitarianAid[]) => {
    if (fresh.length > 0) {
      putAid(fresh).catch(() => {})
      onFreshData?.(fresh)
    }
  }

  if (cached.length > 0) {
    livePromise
      .then(saveFresh)
      .catch(() => {})
    return cached
  }

  try {
    const base = await Promise.race([
      livePromise,
      timeout<HumanitarianAid[]>(INITIAL_NETWORK_WAIT_MS),
    ])
    saveFresh(base)
    return base
  } catch (e) {
    if (e instanceof Error && e.message === 'slow-network') {
      livePromise.then(saveFresh).catch(() => {})
      return []
    }
    console.warn('Network fetch failed, falling back to offline DB', e)
    return getAllAid()
  }
}

export function useAid(params?: AidQueryParams) {
  const debouncedSearch = useDebounced(params?.search ?? '', 350)
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['aid', 'catalog'] as const, [])

  const baseQuery = useQuery({
    queryKey,
    queryFn: () =>
      fetchAidCatalog((fresh) => {
        queryClient.setQueryData(queryKey, fresh)
      }),
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
    isLoading: baseQuery.isLoading && baseQuery.data == null,
    /** القائمة الكاملة قبل الفلترة — لحساب أرقام المسارات */
    catalog: baseQuery.data ?? [],
  }
}
