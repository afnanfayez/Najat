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

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent)

    // 1. Check if already running in standalone (installed) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorWithStandalone).standalone === true

    // 2. Check if the user previously skipped the installation
    const isSkipped = localStorage.getItem('najat_pwa_install_skipped') === 'true'

    if (!isMobile || isStandalone || isSkipped) {
      return
    }

    const triggerToast = (event: BeforeInstallPromptEvent | null) => {
      if (promptShownRef.current) return
      promptShownRef.current = true

      showInstallToast(event, () => {
        localStorage.setItem('najat_pwa_install_skipped', 'true')
      })
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
      localStorage.setItem('najat_pwa_install_skipped', 'true')
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
