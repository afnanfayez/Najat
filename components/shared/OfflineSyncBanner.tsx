'use client'

import { useCallback, useEffect, useState } from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { getLastSyncTime, getPendingOfflineOpsCount } from '@/lib/offline/db'

export function OfflineSyncBanner() {
  const { isOffline } = useOnlineStatus()
  const [pendingCount, setPendingCount] = useState(0)
  const [lastSyncLabel, setLastSyncLabel] = useState('لا توجد مزامنة محفوظة')

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingOfflineOpsCount()
      setPendingCount(count)
    } catch {
      setPendingCount(0)
    }
  }, [])

  const refreshLastSync = useCallback(async () => {
    try {
      const lastSync = await getLastSyncTime()
      if (!lastSync) {
        setLastSyncLabel('لا توجد مزامنة محفوظة')
        return
      }

      setLastSyncLabel(
        new Intl.DateTimeFormat('ar', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(lastSync)),
      )
    } catch {
      setLastSyncLabel('لا توجد مزامنة محفوظة')
    }
  }, [])

  // Refresh counts whenever the offline state changes
  useEffect(() => {
    if (isOffline) {
      refreshPendingCount()
      refreshLastSync()
    }
  }, [isOffline, refreshLastSync, refreshPendingCount])

  // Also react to browser online/offline events and internal sync events
  useEffect(() => {
    const handleOffline = () => {
      console.log(`[CONN-DEBUG] OfflineSyncBanner 'offline' handler @ ${Date.now()}`)
      refreshPendingCount()
      refreshLastSync()
    }

    const handleOnline = () => {
      console.log(`[CONN-DEBUG] OfflineSyncBanner 'online'/session-refresh handler @ ${Date.now()}`)
      // Re-read pending count after sync so the banner updates immediately
      // (isOffline will become false from the hook, hiding the banner)
      refreshPendingCount()
      refreshLastSync()
    }

    const handleSyncComplete = () => {
      console.log(`[CONN-DEBUG] OfflineSyncBanner sync-queue-processed handler @ ${Date.now()}`)
      refreshPendingCount()
      refreshLastSync()
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    window.addEventListener('najat:session-refresh', handleOnline)
    window.addEventListener('najat:sync-queue-processed', handleSyncComplete)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('najat:session-refresh', handleOnline)
      window.removeEventListener('najat:sync-queue-processed', handleSyncComplete)
    }
  }, [refreshLastSync, refreshPendingCount])

  console.log(`[CONN-DEBUG] OfflineSyncBanner render @ ${Date.now()} isOffline=${isOffline} pendingCount=${pendingCount}`)
  if (!isOffline) return null

  return (
    <div
      dir="rtl"
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '9px 16px',
        background: '#C2413A',
        color: '#fff',
        fontSize: '13px',
        fontFamily: "'Cairo', sans-serif",
        fontWeight: 700,
        zIndex: 9999,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <WifiOffIcon />
        تم انقطاع الاتصال بالإنترنت
      </span>
      <span style={{ fontWeight: 600, opacity: 0.95 }}>
        آخر مزامنة: {lastSyncLabel}
        {pendingCount > 0 ? ` - ${pendingCount} عملية بانتظار المزامنة` : ''}
      </span>
    </div>
  )
}

function WifiOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  )
}
