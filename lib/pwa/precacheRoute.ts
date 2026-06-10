export const RESIDENT_ROUTES = [
  '/dashboard',
  '/hospitals',
  '/pharmacies',
  '/clinics',
  '/labs',
  '/dental-clinics',
  '/humanitarian-aid',
  '/health-guide',
  '/maps',
  '/emergency',
  '/profile',
] as const

async function postToServiceWorker(
  message: Record<string, unknown>,
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready
  registration.active?.postMessage(message)
}

export async function precacheAppRoute(path: string): Promise<void> {
  try {
    await postToServiceWorker({ type: 'PRECACHE_ROUTE', path })
  } catch {
    // ignore precache failures
  }
}

export async function precacheResidentRoutes(): Promise<void> {
  try {
    await postToServiceWorker({
      type: 'PRECACHE_ROUTES',
      paths: [...RESIDENT_ROUTES],
    })
  } catch {
    // ignore precache failures
  }
}
