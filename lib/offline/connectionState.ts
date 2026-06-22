import { pingServer } from './pingServer'

/**
 * connectionState.ts — Centralized client connectivity state.
 *
 * Single source of truth for whether the browser is currently offline.
 * Updated by:
 *   1. Module-level browser event listeners (instant, no React needed)
 *   2. useOnlineStatus hook's on-mount ping check (catches SW false-positives)
 *   3. A recovery poll (below) that re-verifies via a real network probe while
 *      offline, independent of whether the browser ever fires a native
 *      'online' event — that event is not reliably emitted by every DevTools
 *      network-emulation transition, especially across client-side
 *      navigations, which previously left the app stuck "offline" until an
 *      unrelated second toggle happened to fire the event correctly.
 *
 * Because this is a plain JS module, its state PERSISTS across client-side
 * navigations in Next.js (evaluated once per hard page load).
 */

let offlineState = false

const RECOVERY_POLL_MS = 3_000
let isPolling = false

if (typeof window !== 'undefined') {
  // Initialise from the current browser value on hard load.
  offlineState = !navigator.onLine
  console.log(`[CONN-DEBUG] module init @ ${Date.now()} navigator.onLine=${navigator.onLine} -> offlineState=${offlineState}`)

  // 'offline' → trust immediately, no verification needed.
  window.addEventListener('offline', () => {
    console.log(`[CONN-DEBUG] window 'offline' event fired @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
    offlineState = true
  })

  // 'online' → trust immediately.
  // The SW false-positive case (page served from SW cache while truly offline)
  // is caught by useOnlineStatus's mount-time ping — not here.
  // Once the browser fires a real 'online' event the network is already verified,
  // so we flip the state right away so that mutations stop queuing to IndexedDB.
  window.addEventListener('online', () => {
    console.log(`[CONN-DEBUG] window 'online' event fired @ ${Date.now()} navigator.onLine=${navigator.onLine}`)
    offlineState = false
  })

  // Recovery poll: only does network work while offlineState is true. Uses a
  // real probe (not navigator.onLine) so it can't reintroduce the false
  // "connection restored" toast that a raw navigator.onLine poll used to cause.
  // On success it dispatches a synthetic 'online' event so every existing
  // listener (PWARegister's processSyncQueue trigger, useOnlineStatus, the
  // banner) reacts exactly as it would to a real one.
  setInterval(() => {
    if (!offlineState || isPolling) return
    isPolling = true
    void pingServer()
      .then((reachable) => {
        console.log(`[CONN-DEBUG] recovery poll ping reachable=${reachable} @ ${Date.now()}`)
        if (reachable && offlineState) {
          offlineState = false
          window.dispatchEvent(new Event('online'))
        }
      })
      .finally(() => {
        isPolling = false
      })
  }, RECOVERY_POLL_MS)
}

export function isBrowserOffline(): boolean {
  return offlineState
}

/**
 * Called by useOnlineStatus after state settles (ping result or browser event).
 * This is the authoritative update path for the React layer.
 */
export function setBrowserOffline(val: boolean): void {
  console.log(`[CONN-DEBUG] setBrowserOffline(${val}) @ ${Date.now()} (was ${offlineState})`)
  offlineState = val
}
