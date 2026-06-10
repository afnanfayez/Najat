const CACHE_NAME = 'najat-pwa-cache-v11'
const MAP_TILES_CACHE = 'najat-map-tiles-v1'
const AUTH_ROUTES = [
  '/login',
  '/logout',
  '/register',
  '/dashboard',
  '/admin',
  '/volunteer',
]
const RESIDENT_ROUTES = [
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
]
const ASSETS_TO_CACHE = [
  '/',
  '/login',
  '/logout',
  '/register',
  '/dashboard',
  '/admin',
  '/volunteer',
  '/favicon.ico',
  '/assets/Logo1.png',
  '/assets/Logo1_cropped.png',
  '/assets/Logo2.png',
  '/assets/Photo1.png',
  '/assets/Photo2.jpg',
  '/assets/najat-icon-192.png',
  '/assets/najat-icon-512.png',
  '/assets/leaflet/marker-icon.png',
  '/assets/leaflet/marker-icon-2x.png',
  '/assets/leaflet/marker-shadow.png',
  '/assets/leaflet/marker-icon-blue-2x.png',
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff2',
]

const EXTERNAL_CACHE_HOSTS = [
  'unpkg.com',
  'gstatic.com',
  'google-fonts',
  'api.iconify.design',
  'raw.githubusercontent.com',
]

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

async function cachePageAssets(cache, pagePath) {
  try {
    const response = await fetch(pagePath)
    if (!response.ok) return
    await cache.put(pagePath, response.clone())
    const html = await response.text()
    const assetUrls = [
      ...html.matchAll(/(?:src|href)="([^"]*\/_next\/[^"]+)"/g),
      ...html.matchAll(/(?:src|href)="(\/_next\/[^"]+)"/g),
    ]
      .map((match) => {
        try {
          return new URL(match[1], self.location.origin).toString()
        } catch {
          return null
        }
      })
      .filter(Boolean)

    await Promise.all(
      [...new Set(assetUrls)].map((assetUrl) =>
        cache.add(assetUrl).catch(() => undefined),
      ),
    )
  } catch {
    // ignore precache failures for individual pages
  }
}

async function precacheRoutes(cache, routes) {
  await Promise.all(routes.map((route) => cachePageAssets(cache, route)))
}

async function precacheAuthPages(cache) {
  await precacheRoutes(cache, AUTH_ROUTES)
}

async function precacheResidentPages(cache) {
  await precacheRoutes(cache, RESIDENT_ROUTES)
}

function isMapTileUrl(url) {
  return (
    url.href.includes('basemaps.cartocdn.com') ||
    url.href.includes('tile.openstreetmap.org')
  )
}

function isExternalCacheable(url) {
  return EXTERNAL_CACHE_HOSTS.some((host) => url.href.includes(host))
}

function cacheFirstWithUpdate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        })
        .catch(() => null)

      if (cachedResponse) {
        networkFetch.catch(() => undefined)
        return cachedResponse
      }

      return networkFetch.then((response) => response || cachedResponse)
    }),
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Install
// ──────────────────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache
          .addAll(ASSETS_TO_CACHE)
          .catch(() => undefined)
          .then(() => precacheAuthPages(cache)),
      )
      .then(() => self.skipWaiting()),
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// Activate
// ──────────────────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  const keepCaches = new Set([CACHE_NAME, MAP_TILES_CACHE])
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (!keepCaches.has(cache)) {
              return caches.delete(cache)
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// Messages from client
// ──────────────────────────────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
  const { type, path, paths } = event.data ?? {}

  if (type === 'PRECACHE_ROUTE') {
    if (typeof path !== 'string' || !path.startsWith('/')) return
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cachePageAssets(cache, path)),
    )
    return
  }

  if (type === 'PRECACHE_ROUTES') {
    const routes = Array.isArray(paths)
      ? paths.filter((p) => typeof p === 'string' && p.startsWith('/'))
      : RESIDENT_ROUTES
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => precacheRoutes(cache, routes)),
    )
    return
  }

  if (type === 'REGISTER_BACKGROUND_SYNC') {
    if (self.registration && 'sync' in self.registration) {
      event.waitUntil(
        self.registration.sync.register('najat-session-sync').catch(() => {
          notifyClientsSync()
        }),
      )
    } else {
      notifyClientsSync()
    }
    return
  }
})

// ──────────────────────────────────────────────────────────────────────────────
// Background Sync
// ──────────────────────────────────────────────────────────────────────────────

self.addEventListener('sync', (event) => {
  if (event.tag === 'najat-session-sync') {
    event.waitUntil(handleSessionSync())
  }
})

async function handleSessionSync() {
  await notifyClientsSync()
}

async function notifyClientsSync() {
  try {
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    clients.forEach((client) => {
      client.postMessage({ type: 'BACKGROUND_SYNC_TRIGGERED' })
    })
  } catch {
    // ignore
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Fetch — Cache Strategy
// ──────────────────────────────────────────────────────────────────────────────

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/favicon.ico' ||
    isExternalCacheable(url)
  )
}

function fallbackDocument(pathname) {
  if (pathname.startsWith('/register')) return '/register'
  if (pathname.startsWith('/admin')) return '/admin'
  if (pathname.startsWith('/volunteer')) return '/volunteer'
  if (pathname.startsWith('/dashboard')) return '/dashboard'
  if (pathname.startsWith('/logout')) return '/logout'
  if (
    pathname.startsWith('/hospitals') ||
    pathname.startsWith('/pharmacies') ||
    pathname.startsWith('/clinics') ||
    pathname.startsWith('/labs') ||
    pathname.startsWith('/dental-clinics')
  ) {
    return '/hospitals'
  }
  if (pathname.startsWith('/humanitarian-aid')) return '/humanitarian-aid'
  if (pathname.startsWith('/health-guide')) return '/health-guide'
  if (pathname.startsWith('/maps')) return '/maps'
  if (pathname.startsWith('/emergency')) return '/emergency'
  if (pathname.startsWith('/profile')) return '/profile'
  return '/dashboard'
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  if (url.origin !== self.location.origin) {
    if (!isExternalCacheable(url) && !isMapTileUrl(url)) {
      return
    }
  }

  if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/api/')) {
    return
  }

  if (isMapTileUrl(url)) {
    event.respondWith(cacheFirstWithUpdate(request, MAP_TILES_CACHE))
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
              cachePageAssets(cache, url.pathname)
            })
          }
          return response
        })
        .catch(async () => {
          const cachedResponse =
            (await caches.match(request)) ||
            (await caches.match(fallbackDocument(url.pathname))) ||
            (await caches.match('/dashboard')) ||
            (await caches.match('/login'))

          return cachedResponse
        }),
    )
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
    return
  }

  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const clone = response.clone()
                caches
                  .open(CACHE_NAME)
                  .then((cache) => cache.put(request, clone))
              }
              return response
            })
            .catch(() => undefined),
      ),
    )
    return
  }

  if (url.origin !== self.location.origin && isExternalCacheable(url)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
    return
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return response
          })
          .catch(() => undefined),
    ),
  )
})
