'use client'

import { useEffect, useState } from 'react'
import { getPendingOfflineOpsCount } from '@/lib/offline/db'

export function usePendingSyncCount() {
  const [count, setCount] = useState(0)
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const n = await getPendingOfflineOpsCount()
        if (!cancelled) setCount(n)
      } catch {
        // IndexedDB unavailable in SSR
      }
    }

    refresh()

    const onOnline = () => { setIsOnline(true); void refresh() }
    const onOffline = () => setIsOnline(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    // Poll every 10 s so counts stay fresh after sync completes
    const timer = setInterval(refresh, 10_000)

    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return { pendingCount: count, isOnline }
}
