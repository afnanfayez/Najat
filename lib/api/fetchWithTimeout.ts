import { isBrowserOffline } from '@/lib/offline/connectionState'

// 8s online gives slow paginated endpoints room while still failing fast offline.
const DEFAULT_TIMEOUT_MS = 8_000
const OFFLINE_TIMEOUT_MS = 1_500

export function getFetchTimeoutMs(): number {
  // Two independent offline signals can lag each other right after a DevTools
  // toggle / real connectivity drop: the raw browser property and our own
  // ping-verified flag (lib/offline/connectionState.ts). Whichever one has
  // already caught up is enough to justify failing fast — otherwise a stale
  // navigator.onLine read alone forces a full 8s wait before the request
  // even gets a chance to hit the offline fallback path.
  const offline =
    (typeof navigator !== 'undefined' && !navigator.onLine) || isBrowserOffline()
  return offline ? OFFLINE_TIMEOUT_MS : DEFAULT_TIMEOUT_MS
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = getFetchTimeoutMs(),
): Promise<Response> {
  const startedAt = Date.now()
  console.log(`[CONN-DEBUG] fetchWithTimeout START @ ${startedAt} url=${typeof input === 'string' ? input : String(input)} timeoutMs=${timeoutMs} navigator.onLine=${typeof navigator !== 'undefined' ? navigator.onLine : 'n/a'} isBrowserOffline()=${isBrowserOffline()}`)
  const controller = new AbortController()
  const timer = setTimeout(() => {
    console.log(`[CONN-DEBUG] fetchWithTimeout ABORTING after ${Date.now() - startedAt}ms (timeoutMs=${timeoutMs})`)
    controller.abort()
  }, timeoutMs)

  try {
    const res = await fetch(input, {
      ...init,
      signal: controller.signal,
    })
    console.log(`[CONN-DEBUG] fetchWithTimeout RESOLVED after ${Date.now() - startedAt}ms status=${res.status}`)
    return res
  } catch (err) {
    console.log(`[CONN-DEBUG] fetchWithTimeout REJECTED after ${Date.now() - startedAt}ms err=${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`)
    if (err instanceof Error && err.name === 'AbortError') {
      throw {
        status: 0,
        message: 'انقطع الاتصال أو انتهت مهلة الطلب',
        errors: null,
      }
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
