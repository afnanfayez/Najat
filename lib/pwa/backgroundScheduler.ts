/**
 * Single serial queue for the app's background offline warm-up work.
 *
 * Every warm-up job used to schedule its own independent requestIdleCallback.
 * That backfired badly: idle callbacks fire when the main thread goes idle, and
 * backgrounding or minimising the tab is the most reliable way to make it idle
 * — so minimising the window kicked off a full API sync, a 234-asset static
 * precache and ~1,500 map-tile fetches all at once.
 *
 * This queue instead runs one task at a time, only while the document is
 * visible, only while online, and (for tasks marked `heavy`) only on a
 * connection worth spending. Work pauses when the tab is hidden and resumes on
 * the next visibilitychange.
 */

interface BackgroundTask {
  name: string
  run: () => Promise<void>
  heavy: boolean
}

const queue: BackgroundTask[] = []
let draining = false
let listenersAttached = false

function isVisible(): boolean {
  if (typeof document === 'undefined') return false
  return document.visibilityState === 'visible'
}

interface NetworkInformation {
  saveData?: boolean
  effectiveType?: string
}

function connection(): NetworkInformation | undefined {
  if (typeof navigator === 'undefined') return undefined
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

/**
 * Skip heavy warm-up (map tiles, image warming, bulk static precache) only when
 * the user has explicitly asked to save data.
 *
 * Deliberately NOT keyed on effectiveType: a 2g/3g link is the normal case for
 * this app's users, and they are precisely the people who need the offline
 * caches to be populated. Throttling by connection speed would disable offline
 * support for everyone who depends on it. The serial, visibility-gated queue
 * already prevents the warm-up from saturating a slow link.
 */
export function isConstrainedConnection(): boolean {
  return connection()?.saveData === true
}

function whenIdle(fn: () => void, timeout: number): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(fn, { timeout })
  } else {
    window.setTimeout(fn, Math.min(timeout, 3_000))
  }
}

/** Yield to the main thread so warm-up never competes with user interaction. */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => whenIdle(() => resolve(), 2_000))
}

async function drain(): Promise<void> {
  if (draining) return
  draining = true
  try {
    while (queue.length > 0) {
      // Pause — not cancel. visibilitychange/online resumes where we left off.
      if (!isVisible() || !navigator.onLine) break

      const task = queue[0]
      if (task.heavy && isConstrainedConnection()) {
        queue.shift()
        continue
      }

      try {
        await task.run()
      } catch {
        // best effort — a failed warm-up must never break the app
      }
      queue.shift()
      await yieldToMain()
    }
  } finally {
    draining = false
  }
}

function attachListeners(): void {
  if (listenersAttached || typeof document === 'undefined') return
  listenersAttached = true

  document.addEventListener('visibilitychange', () => {
    if (isVisible()) void drain()
  })
  window.addEventListener('online', () => {
    if (isVisible()) void drain()
  })
}

/**
 * Queue a background warm-up task. Tasks run one at a time, in submission
 * order. Re-queueing a name that is already pending is a no-op, so callers can
 * fire on every mount without stacking duplicate work.
 */
export function enqueueBackgroundTask(
  name: string,
  run: () => Promise<void>,
  options: { heavy?: boolean; timeout?: number } = {},
): void {
  if (typeof window === 'undefined') return
  if (queue.some((task) => task.name === name)) return

  attachListeners()
  queue.push({ name, run, heavy: options.heavy ?? false })
  whenIdle(() => void drain(), options.timeout ?? 10_000)
}
