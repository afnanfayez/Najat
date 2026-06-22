'use client'

import { useEffect, useState } from 'react'
import { setBrowserOffline, isBrowserOffline } from '@/lib/offline/connectionState'
import { pingServer } from '@/lib/offline/pingServer'

export function useOnlineStatus() {
  // Initialise from the shared module state so navigating back to a page
  // doesn't flash "online" before the effect re-runs.
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return isBrowserOffline()
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)

    const update = (val: boolean) => {
      console.log(`[CONN-DEBUG] useOnlineStatus.update(${val}) @ ${Date.now()}`)
      setIsOffline(val)
      setBrowserOffline(val)
    }

    /**
     * Mount-time check only.
     *
     * Problem: the SW serves pages from cache even when truly offline, so
     * navigator.onLine can report `true` on a cache-served page. We ping to
     * verify reality on first load.
     *
     * If navigator says offline → trust immediately (no ping needed).
     * If navigator says online  → ping to confirm (handles SW false-positive).
     * If ping fails but navigator says online → retry once after 1.5 s to handle
     * the cold-start race (page loaded while network was momentarily unstable).
     */
    const checkOnMount = async () => {
      console.log(`[CONN-DEBUG] checkOnMount() start @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
      if (!navigator.onLine) {
        console.log(`[CONN-DEBUG] checkOnMount() navigator.onLine=false -> update(true), no ping`)
        update(true)
        return
      }
      const reachable = await pingServer()
      if (reachable) {
        console.log(`[CONN-DEBUG] checkOnMount() ping reachable -> update(false)`)
        update(false)
        return
      }
      // Ping failed but navigator.onLine is true — could be a SW false-positive
      // OR the network just came up. Retry once after a short delay.
      console.log(`[CONN-DEBUG] checkOnMount() first ping failed despite navigator.onLine=true -> retrying in 1500ms`)
      await new Promise((r) => setTimeout(r, 1500))
      const reachable2 = await pingServer()
      console.log(`[CONN-DEBUG] checkOnMount() retry ping reachable=${reachable2} -> update(${!reachable2})`)
      update(!reachable2)
    }

    checkOnMount()

    /**
     * Browser 'online' event handler.
     *
     * Trust the browser event directly — by the time the browser fires 'online',
     * it has already verified connectivity at the OS/network level. Running a ping
     * here races against the network stack stabilising and produces a false negative
     * (ping fails → we stay "offline" → banner never hides).
     *
     * The SW false-positive case is already handled by checkOnMount above.
     */
    const handleOnline = () => {
      console.log(`[CONN-DEBUG] useOnlineStatus 'online' listener fired @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
      update(false)
    }

    const handleOffline = () => {
      console.log(`[CONN-DEBUG] useOnlineStatus 'offline' listener fired @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
      update(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    console.log(`[CONN-DEBUG] useOnlineStatus MOUNTED @ ${Date.now()}, instance id=${Math.random().toString(36).slice(2, 8)}`)

    return () => {
      console.log(`[CONN-DEBUG] useOnlineStatus UNMOUNTED @ ${Date.now()}`)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isHydrated, isOffline }
}
