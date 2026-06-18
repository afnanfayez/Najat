'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { processSyncQueue } from '@/lib/offline/processSyncQueue'
import { syncAllData } from '@/lib/offline/sync'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import { precacheRoutesForRole, precacheStaticAssets } from '@/lib/pwa/precacheRoute'
import { requestPersistentStorage, getStorageEstimate } from '@/lib/pwa/persistStorage'

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

function promptUpdate(worker: ServiceWorker): void {
  toast('يتوفر تحديث جديد للتطبيق', {
    id: 'pwa-update',
    description: 'اضغط لتحديث التطبيق إلى أحدث إصدار',
    duration: Infinity,
    action: {
      label: 'تحديث',
      onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }),
    },
  })
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

    const devMode = process.env.NODE_ENV !== 'production'

    let lastSyncSignalAt = 0
    const shouldHandleSyncSignal = () => {
      const now = Date.now()
      if (now - lastSyncSignalAt < SYNC_SIGNAL_THROTTLE_MS) return false
      lastSyncSignalAt = now
      return true
    }

    // ── 1. تسجيل Service Worker ──────────────────────────────────────────────
    // Track whether a SW was already controlling the page BEFORE we register.
    // A controller change after first install (no prior controller) is NOT an
    // update — it's clients.claim() taking control for the first time. Reloading
    // in that case creates an infinite loop: install → claim → controllerchange
    // → reload → install → …
    const hadController = Boolean(navigator.serviceWorker.controller)

    const registerSW = async () => {
      try {
        const swUrl = devMode ? '/sw.js?dev=1' : '/sw.js'
        const registration = await navigator.serviceWorker.register(swUrl)

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
        }

        // Controlled update: the new SW waits (no skipWaiting) until the user
        // accepts. Prompt when an update is ready instead of swapping silently.
        if (!devMode) {
          if (registration.waiting && navigator.serviceWorker.controller) {
            promptUpdate(registration.waiting)
          }
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (!newWorker) return
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                promptUpdate(newWorker)
              }
            })
          })
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

    // ── 4. عند تفعيل SW جديد (بعد قبول التحديث) → إعادة تحميل الصفحة مرة واحدة ──
    let refreshing = false
    const handleControllerChange = () => {
      if (refreshing) return
      // Skip reload on the very first SW installation (clients.claim() fires
      // controllerchange even though no update happened — reloading here starts
      // the infinite-reload loop).
      if (!hadController) return
      // In development the SW file changes on every HMR cycle, so controller
      // changes are frequent and normal — never force a full reload.
      if (devMode) return
      refreshing = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      navigator.serviceWorker.removeEventListener('message', handleSWMessage)
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return null
}
