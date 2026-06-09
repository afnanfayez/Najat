'use client'

import { useEffect } from 'react'
import {
  showInstallToast,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/installPrompt'

let dismissedThisLoad = false

export function useInstallPrompt() {
  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent
      event.preventDefault()
      if (dismissedThisLoad) return
      showInstallToast(event, () => {
        dismissedThisLoad = true
      })
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
}
