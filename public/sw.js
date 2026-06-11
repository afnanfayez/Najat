const CACHE_NAME = 'najat-pwa-cache-v22'
const API_CACHE_NAME = 'najat-api-cache-v2'
const MAP_TILES_CACHE = 'najat-map-tiles-v1'
const FETCH_TIMEOUT_MS = 8000
// في وضع التطوير نتجنب تخزين ملفات /_next/ حتى لا تتأثر آلية HMR
const IS_DEV = self.location.search.includes('dev=1')

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

function pageCacheKey(pathname) {
  return `page-shell:${pathname}`
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function isRscRequest(request, url) {
  const accept = request.headers.get('Accept') || ''
  return (
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1' ||
    accept.includes('text/x-component')
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

function isAppRouteRequest(request, url) {
  if (url.origin !== self.location.origin) return false
  if (url.pathname.startsWith('/_next/')) return false
  if (url.pathname.startsWith('/api/')) return false
  if (url.pathname.startsWith('/v1/')) return false
  if (isStaticAsset(url)) return false
  if (request.mode === 'navigate') return true
  if (isRscRequest(request, url)) return true

  const accept = request.headers.get('Accept') || ''
  const destination = request.destination
  return (
    destination === '' &&
    (accept.includes('text/html') || accept.includes('*/*')) &&
    fallbackDocument(url.pathname) === normalizePathname(url.pathname)
  )
}

function fallbackDocument(pathname) {
  const normalized = normalizePathname(pathname)
  if (normalized.startsWith('/register')) return '/register'
  if (normalized.startsWith('/admin')) return '/admin'
  if (normalized.startsWith('/volunteer')) return '/volunteer'
  if (normalized.startsWith('/dashboard')) return '/dashboard'
  if (normalized.startsWith('/logout')) return '/logout'
  if (normalized.startsWith('/hospitals')) return '/hospitals'
  if (normalized.startsWith('/pharmacies')) return '/pharmacies'
  if (normalized.startsWith('/clinics')) return '/clinics'
  if (normalized.startsWith('/labs')) return '/labs'
  if (normalized.startsWith('/dental-clinics')) return '/dental-clinics'
  if (normalized.startsWith('/humanitarian-aid')) return '/humanitarian-aid'
  if (normalized.startsWith('/health-guide')) return '/health-guide'
  if (normalized.startsWith('/maps')) return '/maps'
  if (normalized.startsWith('/emergency')) return '/emergency'
  if (normalized.startsWith('/profile')) return '/profile'
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
  const normalizedPath = normalizePathname(pagePath)
  try {
    const response = await fetch(normalizedPath, {
      headers: {
        RSC: '1',
        'Next-Router-Prefetch': '1',
        'Next-Url': normalizedPath,
      },
    })
    if (response.ok) await cache.put(rscCacheKey(normalizedPath), response.clone())
  } catch {
    // ignore
  }
}

async function cacheDocument(cache, path) {
  if (!self.navigator.onLine) return
  const normalizedPath = normalizePathname(path)
  try {
    const response = await fetch(normalizedPath)
    if (response.ok) {
      await cache.put(normalizedPath, response.clone())
      await cache.put(pageCacheKey(normalizedPath), response.clone())
      await cacheRscPayload(cache, normalizedPath)
    }
  } catch {
    // ignore
  }
}

async function serveCachedDocument(cache, request, url) {
  const pathname = normalizePathname(url.pathname)
  const fallbackPath = fallbackDocument(pathname)

  return (
    (await cache.match(request)) ||
    (await cache.match(url.pathname)) ||
    (await cache.match(pathname)) ||
    (await cache.match(pageCacheKey(pathname))) ||
    (await cache.match(fallbackPath)) ||
    (await cache.match(pageCacheKey(fallbackPath))) ||
    (await cache.match('/dashboard')) ||
    (await cache.match(pageCacheKey('/dashboard'))) ||
    (await cache.match('/login')) ||
    (await cache.match(pageCacheKey('/login'))) ||
    new Response(OFFLINE_FALLBACK_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  )
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
    const paths = Array.isArray(event.data?.paths) ? event.data.paths : []
    const safePaths = paths.filter((item) => typeof item === 'string' && item.startsWith('/'))
    if (safePaths.length === 0) return
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>
        Promise.all(safePaths.map((routePath) => cacheDocument(cache, routePath))),
      ),
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
    // في وضع التطوير: تجاوز تخزين ملفات /_next/ لضمان عمل HMR بشكل سليم
    if (IS_DEV && url.pathname.startsWith('/_next/')) return
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
        const pathname = normalizePathname(url.pathname)
        const shellKey = rscCacheKey(pathname)
        const fallbackPath = fallbackDocument(pathname)

        // للروابط الديناميكية (مثل /hospitals/5) لا نستخدم RSC الصفحة الأساسية
        // كـ fallback — نُرجع RSC فارغاً حتى تتولى مكوّنات العميل التحميل من URL
        const isSubRoute = fallbackPath !== pathname
        const emptyRsc = new Response('', {
          status: 200,
          headers: { 'Content-Type': 'text/x-component' },
        })

        if (!self.navigator.onLine) {
          return (
            (await cache.match(request)) ||
            (await cache.match(shellKey)) ||
            (!isSubRoute ? await cache.match(rscCacheKey(fallbackPath)) : null) ||
            emptyRsc
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
            (!isSubRoute ? await cache.match(rscCacheKey(fallbackPath)) : null) ||
            emptyRsc
          )
        }
      }),
    )
    return
  }

  if (isAppRouteRequest(request, url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const pathname = normalizePathname(url.pathname)

        if (!self.navigator.onLine) return serveCachedDocument(cache, request, url)

        try {
          const response = await fetchWithTimeout(request)
          if (response.status === 200) {
            await cache.put(request, response.clone())
            await cache.put(pathname, response.clone())
            await cache.put(pageCacheKey(pathname), response.clone())
            cacheRscPayload(cache, pathname)
          }
          return response
        } catch {
          return serveCachedDocument(cache, request, url)
        }
      }),
    )
    return
  }

  event.respondWith(cacheFirstWithUpdate(request, CACHE_NAME))
})
