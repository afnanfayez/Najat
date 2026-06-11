const CACHE_NAME = 'najat-pwa-cache-v20'
const API_CACHE_NAME = 'najat-api-cache-v2'
const MAP_TILES_CACHE = 'najat-map-tiles-v1'
const FETCH_TIMEOUT_MS = 8000

const CORE_ASSETS = [
  '/',
  '/login',
  '/logout',
  '/dashboard',
  '/favicon.ico',
  '/assets/Photo1.png',
  '/assets/Logo1.png',
  '/assets/Logo2.png',
  '/assets/najat-icon-192.png',
  '/assets/najat-icon-512.png',
  '/assets/leaflet/marker-icon.png',
  '/assets/leaflet/marker-icon-2x.png',
  '/assets/leaflet/marker-shadow.png',
  '/assets/leaflet/marker-icon-blue-2x.png',
]

const EXTERNAL_CACHE_HOSTS = [
  'unpkg.com',
  'gstatic.com',
  'google-fonts',
  'api.iconify.design',
  'raw.githubusercontent.com',
]

const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>غير متصل</title>
  <style>
    body{font-family:'Cairo',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f4f7fb;direction:rtl}
    .box{text-align:center;padding:32px;background:#fff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,.08);max-width:360px;width:90%}
    h2{color:#1a2d4a;margin:0 0 12px}p{color:#555;margin:0 0 20px}
    a{color:#2196F3;text-decoration:none;font-weight:700}
  </style>
</head>
<body>
  <div class="box">
    <h2>أنت غير متصل بالإنترنت</h2>
    <p>افتح صفحة سبق تحميلها أو سجّل الدخول بالبيانات المحفوظة.</p>
    <a href="/login">صفحة تسجيل الدخول</a>
  </div>
</body>
</html>`

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

function isMapTileUrl(url) {
  return (
    url.href.includes('basemaps.cartocdn.com') ||
    url.href.includes('tile.openstreetmap.org')
  )
}

function isExternalCacheable(url) {
  return EXTERNAL_CACHE_HOSTS.some((host) => url.href.includes(host))
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
  if (!self.navigator.onLine) return
  try {
    const response = await fetch(pagePath, {
      headers: {
        RSC: '1',
        'Next-Router-Prefetch': '1',
        'Next-Url': pagePath,
      },
    })
    if (response.ok) await cache.put(rscCacheKey(pagePath), response.clone())
  } catch {
    // ignore
  }
}

async function cacheDocument(cache, path) {
  if (!self.navigator.onLine) return
  try {
    const response = await fetch(path)
    if (response.ok) {
      await cache.put(path, response.clone())
      await cacheRscPayload(cache, path)
    }
  } catch {
    // ignore
  }
}

async function cacheFirstWithUpdate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (!self.navigator.onLine) {
    return cached || new Response('', { status: 503, statusText: 'Offline' })
  }

  const update = fetch(request)
    .then((response) => {
      if (response.status === 200) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  if (cached) {
    update.catch(() => undefined)
    return cached
  }

  return (await update) || new Response('', { status: 503, statusText: 'Offline' })
}

async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName)

  if (!self.navigator.onLine) {
    return (await cache.match(request)) || new Response('', { status: 503, statusText: 'Offline' })
  }

  try {
    const response = await fetchWithTimeout(request)
    if (response.status === 200) await cache.put(request, response.clone())
    return response
  } catch {
    return (await cache.match(request)) || new Response('', { status: 503, statusText: 'Service Unavailable' })
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => undefined))),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const keepCaches = new Set([CACHE_NAME, API_CACHE_NAME, MAP_TILES_CACHE])
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!keepCaches.has(cacheName)) return caches.delete(cacheName)
          }),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  const { type, path } = event.data ?? {}

  if (type === 'PRECACHE_ROUTE') {
    if (typeof path !== 'string' || !path.startsWith('/')) return
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cacheDocument(cache, path)))
    return
  }

  if (type === 'PRECACHE_ROUTES') {
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
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'najat-session-sync') {
    event.waitUntil(notifyClientsSync())
  }
})

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

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/_next/webpack-hmr')) return

  if (url.origin !== self.location.origin) {
    if (!isExternalCacheable(url) && !isMapTileUrl(url)) return
  }

  if (url.pathname.startsWith('/api/')) return

  if (url.pathname.startsWith('/v1/')) {
    event.respondWith(networkFirstWithCache(request, API_CACHE_NAME))
    return
  }

  if (isMapTileUrl(url)) {
    event.respondWith(cacheFirstWithUpdate(request, MAP_TILES_CACHE))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
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

        if (!self.navigator.onLine) {
          return (
            (await cache.match(request)) ||
            (await cache.match(shellKey)) ||
            (await cache.match(rscCacheKey(fallbackDocument(url.pathname)))) ||
            new Response('', {
              status: 200,
              headers: { 'Content-Type': 'text/x-component' },
            })
          )
        }

        try {
          const response = await fetchWithTimeout(request)
          if (response.ok) {
            await cache.put(shellKey, response.clone())
            await cache.put(request, response.clone())
          }
          return response
        } catch {
          return (
            (await cache.match(request)) ||
            (await cache.match(shellKey)) ||
            (await cache.match(rscCacheKey(fallbackDocument(url.pathname)))) ||
            new Response('', {
              status: 200,
              headers: { 'Content-Type': 'text/x-component' },
            })
          )
        }
      }),
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        async function serveCached() {
          return (
            (await cache.match(request)) ||
            (await cache.match(url.pathname)) ||
            (await cache.match(fallbackDocument(url.pathname))) ||
            (await cache.match('/dashboard')) ||
            (await cache.match('/login')) ||
            new Response(OFFLINE_FALLBACK_HTML, {
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
          )
        }

        if (!self.navigator.onLine) return serveCached()

        try {
          const response = await fetchWithTimeout(request)
          if (response.status === 200) {
            await cache.put(request, response.clone())
            await cache.put(url.pathname, response.clone())
            cacheRscPayload(cache, url.pathname)
          }
          return response
        } catch {
          return serveCached()
        }
      }),
    )
    return
  }

  event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
})
