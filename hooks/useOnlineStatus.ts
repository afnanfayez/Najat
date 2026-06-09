'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)

  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const getSnapshot = () => !navigator.onLine
const getServerSnapshot = () => false

export function useOnlineStatus() {
  const isOffline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  return {
    isHydrated: true,
    isOffline,
  }
}
