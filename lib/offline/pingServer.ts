/**
 * Performs a real network round-trip to /api/ping.
 * The Service Worker explicitly skips all /api/* routes (sw.js), so this
 * request is NEVER answered from SW cache — it's a true connectivity probe,
 * unlike navigator.onLine or the browser's online/offline events.
 */
export async function pingServer(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(`/api/ping?_t=${Date.now()}`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)
    return res.ok
  } catch {
    return false
  }
}
