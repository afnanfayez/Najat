'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { processSyncQueue } from '@/lib/offline/processSyncQueue'
import { syncAllData } from '@/lib/offline/sync'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import { precacheRoutesForRole, precacheStaticAssets } from '@/lib/pwa/precacheRoute'
import { requestPersistentStorage, getStorageEstimate } from '@/lib/pwa/persistStorage'

const SYNC_SIGNAL_THROTTLE_MS = 2_000

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
 *
 * ملاحظة: تحديثات الـ SW تُطبَّق بشكل طبيعي (lazy) دون إشعار للمستخدم أو
 * إعادة تحميل قسرية — لا يوجد skipWaiting() مُستدعى من العميل.
 */
export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) return

    const devMode = process.env.NODE_ENV !== 'production'

    let lastSyncSignalAt = Date.now()
    const shouldHandleSyncSignal = () => {
      const now = Date.now()
      if (now - lastSyncSignalAt < SYNC_SIGNAL_THROTTLE_MS) return false
      lastSyncSignalAt = now
      return true
    }

    // ── 1. تسجيل Service Worker ──────────────────────────────────────────────
    const registerSW = async () => {
      try {
        const swUrl = devMode ? '/sw.js?dev=1' : '/sw.js'
        await navigator.serviceWorker.register(swUrl)

        // Ask the browser to keep our offline caches & IndexedDB from being
        // evicted under storage pressure / inactivity (esp. iOS Safari).
        void requestPersistentStorage()

        // Storage telemetry (dev only) — surfaces how close we are to quota,
        // which is the root cause behind images/shells getting evicted.
        if (devMode) {
          void getStorageEstimate().then((est) => {
            if (est) {
              console.info(
                `[PWA] storage ~${(est.usage / 1048576).toFixed(1)}MB / ` +
                  `${(est.quota / 1048576).toFixed(0)}MB (${est.usagePct}%)`,
              )
            }
          })

          // IS_DEV in sw.js skips ALL fetch interception (shells/RSC/images/tiles)
          // to avoid racing Turbopack's on-demand compile and looping into endless
          // reloads. Offline therefore cannot work under `next dev` by design —
          // make that explicit so it isn't mistaken for a bug during testing.
          console.warn(
            '[PWA] العمل بلا اتصال معطّل في وضع التطوير (next dev) لتجنّب تعارض HMR. ' +
              'لاختبار العمل بلا اتصال فعلياً، استخدم: npm run build && npm run start',
          )
        }

        if (getToken()) {
          void precacheRoutesForRole(getCurrentAuthRole())
          scheduleDataSync(true)
          // Background full-static precache so every route boots offline.
          const warmStatic = () => void precacheStaticAssets()
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(warmStatic, { timeout: 20_000 })
          } else {
            window.setTimeout(warmStatic, 8_000)
          }
        }
        console.log('[PWA] Service Worker registered ✓')
      } catch (err) {
        console.error('[PWA] Service Worker registration failed:', err)
      }
    }

    const startRegistration = async () => {
      if (devMode) {
        await unregisterDevServiceWorkers()
      }
      await registerSW()
    }

    if (document.readyState === 'complete') {
      startRegistration()
    } else {
      window.addEventListener('load', startRegistration, { once: true })
    }

    // ── 2. عند عودة الإنترنت → طلب Background Sync من SW ────────────────────
    const handleOnline = async () => {
      console.log(`[CONN-DEBUG] PWARegister 'online' event fired @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
      // Wait 750 ms for the OS/browser network stack to fully stabilise before
      // making API calls. Without this delay, requests fired immediately after the
      // 'online' event fail with network errors (DNS not yet resolved, TCP not
      // established), silently consuming retries without actually syncing.
      await new Promise((r) => setTimeout(r, 750))

      console.log(`[CONN-DEBUG] PWARegister calling processSyncQueue() + scheduleDataSync(true) @ ${Date.now()}`)
      void processSyncQueue()
      scheduleDataSync(true)

      if (shouldHandleSyncSignal()) {
        toast.success('تمت استعادة الاتصال بالإنترنت', {
          id: 'pwa-online',
          duration: 3000,
        })
      }

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
    console.log(`[CONN-DEBUG] PWARegister MOUNTED @ ${Date.now()}, 'online' listener attached`)

    // ── 3. استقبال رسالة BACKGROUND_SYNC_TRIGGERED من SW ────────────────────
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'BACKGROUND_SYNC_TRIGGERED') return
      console.log(`[CONN-DEBUG] PWARegister SW message BACKGROUND_SYNC_TRIGGERED @ ${Date.now()}`)
      console.log('[PWA] Background sync triggered by SW — refreshing session')

      void processSyncQueue()

      // أطلق حدث داخلي تستمع إليه AuthContext لإعادة جلب بيانات المستخدم
      window.dispatchEvent(new Event('najat:session-refresh'))

      if (shouldHandleSyncSignal()) {
        toast.success('تم استعادة الاتصال — جارٍ مزامنة البيانات', {
          id: 'pwa-online',
          duration: 3000,
        })
      }
    }

    const handleControllerChange = () => {
      console.log(`[CONN-DEBUG] PWARegister SW controllerchange @ ${Date.now()} -> forcing window.location.reload()`)
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('message', handleSWMessage)
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      navigator.serviceWorker.removeEventListener('message', handleSWMessage)
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return null
}
