'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { processSyncQueue } from '@/lib/offline/processSyncQueue'
import { syncAllData } from '@/lib/offline/sync'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import { precacheRoutesForRole } from '@/lib/pwa/precacheRoute'

const SYNC_SIGNAL_THROTTLE_MS = 10_000

type SyncServiceWorkerRegistration = ServiceWorkerRegistration & {
  sync?: {
    register: (tag: string) => Promise<void>
  }
}

function scheduleDataSync(force = false): void {
  if (typeof window === 'undefined') return
  const run = () => {
    void syncAllData(force)
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 15_000 })
  } else {
    window.setTimeout(run, 3_000)
  }
}

async function unregisterDevServiceWorkers(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))

    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('najat-'))
          .map((cacheName) => caches.delete(cacheName)),
      )
    }
  } catch (err) {
    console.warn('[PWA] Failed to unregister dev service workers:', err)
  }
}

/**
 * PWARegister — يسجّل الـ Service Worker ويُدير:
 *  1. تسجيل SW عند تحميل الصفحة
 *  2. Background Sync عند عودة الإنترنت
 *  3. استقبال رسالة BACKGROUND_SYNC_TRIGGERED من SW → إعادة تحميل الجلسة
 */
export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) return

    if (process.env.NODE_ENV !== 'production') {
      void unregisterDevServiceWorkers()
      return
    }

    let lastSyncSignalAt = 0
    const shouldHandleSyncSignal = () => {
      const now = Date.now()
      if (now - lastSyncSignalAt < SYNC_SIGNAL_THROTTLE_MS) return false
      lastSyncSignalAt = now
      return true
    }

    // ── 1. تسجيل Service Worker ──────────────────────────────────────────────
    const registerSW = async () => {
      try {
        // في وضع التطوير نُمرّر ?dev=1 حتى يتجنب SW تخزين ملفات /_next/ الديناميكية
        await navigator.serviceWorker.register('/sw.js')
        if (getToken()) {
          void precacheRoutesForRole(getCurrentAuthRole())
          scheduleDataSync(true)
        }
        console.log('[PWA] Service Worker registered ✓')
      } catch (err) {
        console.error('[PWA] Service Worker registration failed:', err)
      }
    }

    if (document.readyState === 'complete') {
      registerSW()
    } else {
      window.addEventListener('load', registerSW, { once: true })
    }

    // ── 2. عند عودة الإنترنت → طلب Background Sync من SW ────────────────────
    const handleOnline = async () => {
      if (!shouldHandleSyncSignal()) return

      toast.success('تمت استعادة الاتصال بالإنترنت', {
        id: 'pwa-online',
        duration: 3000,
      })
      void processSyncQueue()
      scheduleDataSync(true)
      try {
        const reg = (await navigator.serviceWorker.ready) as SyncServiceWorkerRegistration

        if (reg.sync) {
          // Background Sync API مدعوم — الـ SW سيُطلق sync event تلقائياً
          await reg.sync.register('najat-session-sync')
          console.log('[PWA] Background Sync registered ✓')
        } else {
          // Fallback: أرسل رسالة مباشرة للـ SW ليُبلّغ باقي النوافذ
          window.dispatchEvent(new Event('najat:session-refresh'))
        }
      } catch (err) {
        console.warn('[PWA] Background Sync registration failed:', err)
        // Fallback: أعد تحميل الجلسة مباشرةً في نفس النافذة
        window.dispatchEvent(new Event('najat:session-refresh'))
      }
    }

    window.addEventListener('online', handleOnline)

    // ── 3. استقبال رسالة BACKGROUND_SYNC_TRIGGERED من SW ────────────────────
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'BACKGROUND_SYNC_TRIGGERED') return
      if (!shouldHandleSyncSignal()) return
      console.log('[PWA] Background sync triggered by SW — refreshing session')

      void processSyncQueue()

      // أطلق حدث داخلي تستمع إليه AuthContext لإعادة جلب بيانات المستخدم
      window.dispatchEvent(new Event('najat:session-refresh'))

      toast.success('تم استعادة الاتصال — جارٍ مزامنة البيانات', {
        id: 'pwa-online',
        duration: 3000,
      })
    }

    navigator.serviceWorker.addEventListener('message', handleSWMessage)

    return () => {
      window.removeEventListener('online', handleOnline)
      navigator.serviceWorker.removeEventListener('message', handleSWMessage)
    }
  }, [])

  return null
}
