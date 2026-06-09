export async function precacheAppRoute(path: string): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    registration.active?.postMessage({
      type: 'PRECACHE_ROUTE',
      path,
    })
  } catch {
    // ignore precache failures
  }
}
