export const RESIDENT_ROUTES = [
  '/login',
  '/logout',
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

export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/users/new',
  '/admin/health',
  '/admin/health/new',
  '/admin/health/content/new',
  '/admin/aid',
  '/admin/aid/points/new',
  '/admin/aid/donors/new',
  '/admin/maps',
  '/admin/maps/new',
  '/admin/data',
  '/admin/data/sync',
  '/admin/audit',
  '/admin/communication',
  '/admin/reports',
  '/admin/security',
  '/admin/alerts',
  '/login',
  '/logout',
] as const

export const VOLUNTEER_ROUTES = [
  '/volunteer',
  ...RESIDENT_ROUTES,
] as const

type OfflinePrecacheRole = 'admin' | 'volunteer' | 'resident' | null | undefined

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

function routesForRole(role: OfflinePrecacheRole): readonly string[] {
  if (role === 'admin') return [...new Set([...ADMIN_ROUTES, ...RESIDENT_ROUTES])]
  if (role === 'volunteer') return VOLUNTEER_ROUTES
  return RESIDENT_ROUTES
}

async function warmRoutesInBatches(paths: readonly string[]): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return
  const batchSize = 3

  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize)
    await Promise.allSettled(batch.map((path) => warmRscRoute(path)))
  }
}

export async function precacheRoutesForRole(role: OfflinePrecacheRole): Promise<void> {
  const paths = routesForRole(role)
  try {
    await postToServiceWorker({ type: 'PRECACHE_ROUTES', paths })
    await warmRoutesInBatches(paths)
  } catch {
    // ignore precache failures
  }
}

export async function precacheResidentRoutes(): Promise<void> {
  return precacheRoutesForRole('resident')
}

/**
 * Ask the SW to precache every hashed /_next/static asset (build-time manifest)
 * so any route boots offline. Background, idempotent, best-effort.
 */
export async function precacheStaticAssets(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return
  try {
    await postToServiceWorker({ type: 'PRECACHE_STATIC' })
  } catch {
    // ignore
  }
}
