const CACHE_NAME = 'najat-pwa-cache-v14'
const FETCH_TIMEOUT_MS = 4000
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
  '/profile/edit',
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

function rscCacheKey(pathname) {
  return `rsc-shell:${pathname}`
}

function isRscRequest(request, url) {
  return (
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1'
  )
}

function fetchWithTimeout(request, timeoutMs = FETCH_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeoutMs)
    fetch(request)
      .then((response) => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

async function cacheRscPayload(cache, pagePath) {
  try {
    const response = await fetch(pagePath, {
      headers: {
        RSC: '1',
        'Next-Router-Prefetch': '1',
        'Next-Url': pagePath,
      },
    })
    if (!response.ok) return
    await cache.put(rscCacheKey(pagePath), response.clone())
  } catch {
    // ignore
  }
}

async function cachePageAssets(cache, pagePath) {
  try {
    const response = await fetch(pagePath)
    if (!response.ok) return
    await cache.put(pagePath, response.clone())
    await cacheRscPayload(cache, pagePath)
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

function isDevBundlerAsset(url) {
  return (
    url.pathname.includes('turbopack') ||
    url.search.includes('turbopack') ||
    url.pathname.startsWith('/_next/webpack-hmr')
  )
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/favicon.ico' ||
    isExternalCacheable(url)
  )
}

function networkFirstWithCache(request, cacheName) {
  return caches.open(cacheName).then(async (cache) => {
    try {
      const response = await fetchWithTimeout(request)
      if (response.status === 200) {
        await cache.put(request, response.clone())
      }
      return response
    } catch {
      const cached = await cache.match(request)
      if (cached) return cached
      throw new Error('network-first-miss')
    }
  })
}

function fallbackDocument(pathname) {
  if (pathname.startsWith('/register')) return '/register'
  if (pathname.startsWith('/admin')) return '/admin'
  if (pathname.startsWith('/volunteer')) return '/volunteer'
  if (pathname.startsWith('/dashboard')) return '/dashboard'
  if (pathname.startsWith('/logout')) return '/logout'
  if (pathname.startsWith('/hospitals')) return '/hospitals'
  if (pathname.startsWith('/pharmacies')) return '/pharmacies'
  if (pathname.startsWith('/clinics')) return '/clinics'
  if (pathname.startsWith('/labs')) return '/labs'
  if (pathname.startsWith('/dental-clinics')) return '/dental-clinics'
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

  if (isDevBundlerAsset(url)) return

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

  if (
    url.origin === self.location.origin &&
    isRscRequest(request, url) &&
    !url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const shellKey = rscCacheKey(url.pathname)
        const cached =
          (await cache.match(request)) || (await cache.match(shellKey))
        if (cached) return cached

        try {
          const response = await fetchWithTimeout(request)
          if (response.ok) {
            await cache.put(shellKey, response.clone())
            await cache.put(request, response.clone())
          }
          return response
        } catch {
          const fallback =
            (await cache.match(shellKey)) ||
            (await cache.match(rscCacheKey(fallbackDocument(url.pathname)))) ||
            (await cache.match(fallbackDocument(url.pathname)))
          if (fallback) return fallback
          throw new Error('offline-rsc-miss')
        }
      }),
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetchWithTimeout(request)
          if (response && response.status === 200) {
            const clone = response.clone()
            await cache.put(request, clone)
            cachePageAssets(cache, url.pathname)
          }
          return response
        } catch {
          const cachedResponse =
            (await cache.match(request)) ||
            (await cache.match(rscCacheKey(url.pathname))) ||
            (await cache.match(fallbackDocument(url.pathname))) ||
            (await cache.match('/dashboard')) ||
            (await cache.match('/login'))
          if (cachedResponse) return cachedResponse
          throw new Error('offline-nav-miss')
        }
      }),
    )
    return
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image')
  ) {
    event.respondWith(networkFirstWithCache(request, CACHE_NAME))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
    return
  }

  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(networkFirstWithCache(request, CACHE_NAME))
    return
  }

  if (url.origin !== self.location.origin && isExternalCacheable(url)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
    return
  }

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached
      try {
        const response = await fetchWithTimeout(request)
        if (response.status === 200) {
          const clone = response.clone()
          const cache = await caches.open(CACHE_NAME)
          await cache.put(request, clone)
        }
        return response
      } catch {
        return undefined
      }
    }),
  )
})
