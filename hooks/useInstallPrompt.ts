'use client'

import { useEffect, useRef } from 'react'
import {
  showInstallToast,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/installPrompt'

export function useInstallPrompt() {
  const promptShownRef = useRef(false)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Check if already running in standalone (installed) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    // 2. Check if the user previously skipped the installation
    const isSkipped = localStorage.getItem('najat_pwa_install_skipped') === 'true'

    if (isStandalone || isSkipped) {
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
      if (typeof window !== 'undefined') {
        ;(window as any).deferredNajatPrompt = event
      }
      triggerToast(event)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Fallback: If beforeinstallprompt hasn't fired in 3.5s (e.g. iOS/Safari or other browsers),
    // show the toast anyway with instructions fallback
    const timer = setTimeout(() => {
      if (!promptShownRef.current) {
        triggerToast(null)
      }
    }, 3500)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [])
}
