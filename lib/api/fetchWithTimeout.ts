// 8s online gives slow paginated endpoints room while still failing fast offline.
const DEFAULT_TIMEOUT_MS = 8_000
const OFFLINE_TIMEOUT_MS = 1_500

export function getFetchTimeoutMs(): number {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return OFFLINE_TIMEOUT_MS
  }
  return DEFAULT_TIMEOUT_MS
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = getFetchTimeoutMs(),
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } catch (err) {
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
