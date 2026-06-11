'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { processSyncQueue } from '@/lib/offline/processSyncQueue'

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
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .then(() => {
          console.log('[PWA] Service Worker disabled in development')
        })
        .catch((err) => {
          console.warn('[PWA] Failed to disable Service Worker in development:', err)
        })
      return
    }

    // ── 1. تسجيل Service Worker ──────────────────────────────────────────────
    const registerSW = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js')
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
      try {
        const reg = await navigator.serviceWorker.ready

        if ('sync' in reg) {
          // Background Sync API مدعوم — الـ SW سيُطلق sync event تلقائياً
          await (reg as any).sync.register('najat-session-sync')
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
