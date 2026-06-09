'use client'

import { useEffect, useRef } from 'react'
import {
  showInstallToast,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/installPrompt'

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean
}

type WindowWithDeferredPrompt = Window & {
  deferredNajatPrompt?: BeforeInstallPromptEvent
}

export function useInstallPrompt() {
  const promptShownRef = useRef(false)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Check if already running in standalone (installed) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorWithStandalone).standalone === true

    if (isStandalone) {
      return
    }

    const triggerToast = (event: BeforeInstallPromptEvent | null) => {
      if (promptShownRef.current && !event) return
      promptShownRef.current = true

      showInstallToast(event)
    }

    // Capture native install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent
      event.preventDefault()
      deferredPromptRef.current = event
      ;(window as WindowWithDeferredPrompt).deferredNajatPrompt = event
      triggerToast(event)
    }

    const handleAppInstalled = () => {
      deferredPromptRef.current = null
      delete (window as WindowWithDeferredPrompt).deferredNajatPrompt
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    const fallbackTimer = window.setTimeout(() => {
      if (!deferredPromptRef.current) {
        triggerToast(null)
      }
    }, 1500)

    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])
}
