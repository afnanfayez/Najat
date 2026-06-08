'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).workbox === undefined // Avoid conflicts if any workbox is already loaded
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Najat PWA Service Worker registered successfully:', reg.scope)
          })
          .catch((err) => {
            console.error('Najat PWA Service Worker registration failed:', err)
          })
      })
    }
  }, [])

  return null
}
