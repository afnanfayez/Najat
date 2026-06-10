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
  '/profile/edit',
] as const

async function postToServiceWorker(
  message: Record<string, unknown>,
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready
  registration.active?.postMessage(message)
}

/** Warm Next.js App Router flight payloads so client navigation works offline. */
export async function warmRscRoute(path: string): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return
  try {
    await fetch(path, {
      headers: {
        RSC: '1',
        'Next-Router-Prefetch': '1',
        'Next-Url': path,
      },
    })
  } catch {
    // ignore — SW may still serve a cached shell
  }
}

export async function precacheAppRoute(path: string): Promise<void> {
  try {
    await postToServiceWorker({ type: 'PRECACHE_ROUTE', path })
    await warmRscRoute(path)
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
    if (navigator.onLine) {
      await Promise.allSettled(RESIDENT_ROUTES.map((path) => warmRscRoute(path)))
    }
  } catch {
    // ignore precache failures
  }
}
