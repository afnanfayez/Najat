'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { processSyncQueue } from '@/lib/offline/processSyncQueue'
import { syncAllData } from '@/lib/offline/sync'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import { precacheRoutesForRole } from '@/lib/pwa/precacheRoute'

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

    // ── 1. تسجيل Service Worker ──────────────────────────────────────────────
    const registerSW = async () => {
      try {
        // في وضع التطوير نُمرّر ?dev=1 حتى يتجنب SW تخزين ملفات /_next/ الديناميكية
        const swUrl =
          process.env.NODE_ENV !== 'production' ? '/sw.js?dev=1' : '/sw.js'
        await navigator.serviceWorker.register(swUrl)
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
          reg.active?.postMessage({ type: 'REGISTER_BACKGROUND_SYNC' })
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
