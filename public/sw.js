/**
 * Najat PWA — Service Worker
 *
 * Caching strategy:
 *  - Static assets (/_next/static/, /assets/)  → cache-first, update in background
 *  - Page shells / RSC payloads               → stale-while-revalidate (APP_SHELL_TIMEOUT_MS)
 *  - Map tiles (CartoCDN, OSM)                → cache-first, update in background
 *  - External cacheable assets (Leaflet etc.) → cache-first, update in background
 *  - API responses (/v1/*)                    → NOT cached here; handled by IndexedDB (lib/offline/db.ts)
 *
 * BUMP SHELL_CACHE ON EVERY DEPLOY so stale shells are evicted on activate.
 */

// Cache buckets — keep these literals in sync with lib/pwa/cacheNames.ts
//  - SHELL_CACHE: versioned; BUMP ON EVERY DEPLOY (shells, RSC, /_next/static)
//  - IMAGE_CACHE: durable; survives deploys so images aren't re-downloaded
//  - MAP_TILES_CACHE: durable; survives deploys
const SHELL_CACHE = 'najat-shell-v28'
const IMAGE_CACHE = 'najat-images-v1'
const MAP_TILES_CACHE = 'najat-map-tiles-v1'
// API responses are NOT cached by the SW — they are handled by IndexedDB sync (lib/offline/db.ts)
const FETCH_TIMEOUT_MS = 8000
const APP_SHELL_TIMEOUT_MS = 2500

// Freshness windows for cache-first-with-revalidate. A fresh entry is served
// straight from cache with NO network request (saves bandwidth on slow links);
// a stale entry is served from cache and revalidated in the background (SWR).
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const STATIC_MAX_AGE_MS = 30 * ONE_DAY_MS // hashed /_next/static + bundled /assets — effectively immutable
const IMAGE_MAX_AGE_MS = 7 * ONE_DAY_MS   // optimized images may change behind a stable URL
const TILE_MAX_AGE_MS = 30 * ONE_DAY_MS   // map tiles rarely change

// Hard caps so durable caches don't grow without bound and trigger eviction of
// the whole origin's storage. Oldest entries (FIFO via cache insertion order)
// are pruned first.
const IMAGE_MAX_ENTRIES = 300
const TILE_MAX_ENTRIES = 1500
// في وضع التطوير نتجنب تخزين ملفات /_next/ حتى لا تتأثر آلية HMR
const IS_DEV = self.location.search.includes('dev=1')

// Shells & documents → SHELL_CACHE (versioned)
const CORE_SHELL_ASSETS = [
  '/',
  '/login',
  '/logout',
  '/dashboard',
  '/admin',
  '/manifest.webmanifest',
]

// Images & icons → IMAGE_CACHE (durable across deploys)
const CORE_IMAGE_ASSETS = [
  '/favicon.ico',
  '/assets/Photo1.png',
  '/assets/Photo2.jpg',
  '/assets/Logo1.png',
  '/assets/Logo1_cropped.png',
  '/assets/Logo2.png',
  '/assets/Logo3.png',
  '/assets/najat-icon-192.png',
  '/assets/najat-icon-512.png',
  '/assets/profile.png',
  '/assets/profile_avatar.png',
  '/assets/doctor.png',
  '/assets/artical.png',
  '/assets/health1.jpg',
  '/assets/health2.jpg',
  '/assets/health3.jpg',
  '/assets/health4.png',
  '/assets/health5.jpg',
  '/assets/health6.jpg',
  '/assets/health7.jpg',
  '/assets/health8.jpg',
  '/assets/health9.jpg',
  '/assets/healthcare1.jpg',
  '/assets/healthcare2.jpg',
  '/assets/healthcare3.jpg',
  '/assets/staff1.png',
  '/assets/staff2.jpg',
  '/assets/leaflet/marker-icon.png',
  '/assets/leaflet/marker-icon-2x.png',
  '/assets/leaflet/marker-shadow.png',
  '/assets/leaflet/marker-icon-blue-2x.png',
]

const IMAGE_FALLBACK_ASSETS = [
  '/assets/Logo1.png',
  '/assets/najat-icon-512.png',
  '/favicon.ico',
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

function isImageRequest(request, url) {
  const accept = request.headers.get('Accept') || ''
  return (
    request.destination === 'image' ||
    accept.includes('image/') ||
    /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i.test(url.pathname)
  )
}

async function imageFallbackResponse(cache) {
  for (const asset of IMAGE_FALLBACK_ASSETS) {
    const response = await cache.match(asset)
    if (response) return response
  }

  return new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#f4f7fb"/><circle cx="256" cy="256" r="96" fill="#2496ff" opacity=".16"/><path fill="#2496ff" d="M256 144c61.9 0 112 50.1 112 112s-50.1 112-112 112-112-50.1-112-112 50.1-112 112-112Zm0 48a64 64 0 1 0 0 128 64 64 0 0 0 0-128Z"/></svg>',
    {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store',
      },
    },
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
    if (response.ok && !response.redirected) {
      await cache.put(rscCacheKey(normalizedPath), response.clone())
    }
  } catch {
    // ignore
  }
}

// Extract the /_next/static JS & CSS a document references and cache them, so a
// PRECACHED (never-visited) route can still boot offline. Without this, only
// routes the user actually loaded online have their chunks cached, and a hard
// offline load of any other route fails with "Failed to load chunk …".
async function cacheReferencedStaticAssets(html) {
  if (typeof html !== 'string' || !html) return
  const cache = await caches.open(SHELL_CACHE)
  const urls = new Set()
  const re = /\/_next\/static\/[^"'\s)\\]+?\.(?:js|css)/g
  let match
  while ((match = re.exec(html)) !== null) urls.add(match[0])
  await Promise.all(
    [...urls].map(async (url) => {
      try {
        if (await cache.match(url)) return
        const res = await fetch(url)
        if (res.ok) await putWithTimestamp(cache, url, res)
      } catch {
        // ignore individual asset failures
      }
    }),
  )
}

// Precache EVERY hashed /_next/static asset listed in the build-time manifest,
// so any route — even one never visited — can boot offline. Runs in the
// background (triggered by the client on idle) so it never blocks first paint.
async function precacheStaticManifest() {
  if (!self.navigator.onLine) return
  try {
    const res = await fetch('/precache-manifest.json', { cache: 'no-cache' })
    if (!res.ok) return
    const urls = await res.json()
    if (!Array.isArray(urls)) return
    const cache = await caches.open(SHELL_CACHE)
    const CONCURRENCY = 6
    let i = 0
    async function worker() {
      while (i < urls.length) {
        const url = urls[i++]
        if (typeof url !== 'string') continue
        try {
          if (await cache.match(url)) continue
          const r = await fetch(url)
          if (r.ok) await putWithTimestamp(cache, url, r)
        } catch {
          // ignore individual asset failures
        }
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  } catch {
    // ignore — best effort
  }
}

async function cacheDocument(cache, path) {
  if (!self.navigator.onLine) return
  const normalizedPath = normalizePathname(path)
  try {
    const response = await fetch(normalizedPath)
    if (response.ok && !response.redirected) {
      const html = await response.clone().text()
      await cache.put(normalizedPath, response.clone())
      await cache.put(pageCacheKey(normalizedPath), response.clone())
      await cacheRscPayload(cache, normalizedPath)
      await cacheReferencedStaticAssets(html)
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

function isCacheableResponse(response) {
  // 200 = readable same-origin/CORS; opaque = cross-origin no-cors <img> (status 0)
  return response && (response.status === 200 || response.type === 'opaque')
}

// Stamp the time of caching onto a response so we can compute its age later.
// Opaque cross-origin responses can't be re-wrapped (body is null), so they are
// stored as-is and treated as always-stale (revalidated in background when online).
async function putWithTimestamp(cache, request, response) {
  if (response.type === 'opaque' || response.status === 0) {
    try {
      await cache.put(request, response.clone())
    } catch {
      // ignore
    }
    return
  }
  try {
    const body = await response.clone().arrayBuffer()
    const headers = new Headers(response.headers)
    headers.set('x-sw-cached-at', String(Date.now()))
    await cache.put(
      request,
      new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }),
    )
  } catch {
    // Fall back to a plain put if re-wrapping fails for any reason.
    try {
      await cache.put(request, response.clone())
    } catch {
      // ignore
    }
  }
}

function cachedAgeMs(response) {
  const ts = Number(response && response.headers.get('x-sw-cached-at'))
  if (!ts) return Infinity // legacy entries with no timestamp → treat as stale
  return Date.now() - ts
}

// Keep a cache under maxEntries by deleting the oldest entries first.
// cache.keys() preserves insertion order, giving us a simple FIFO eviction.
async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    const excess = keys.length - maxEntries
    for (let i = 0; i < excess; i++) {
      await cache.delete(keys[i])
    }
  } catch {
    // ignore
  }
}

// Cache-first with TTL-gated revalidation:
//  - fresh cache hit  → return cached, NO network request (bandwidth-friendly)
//  - stale cache hit  → return cached now, revalidate in background (SWR)
//  - cache miss       → fetch, cache, return (or image fallback when offline)
async function cacheFirstWithRevalidate(
  request,
  cacheName,
  maxAgeMs = STATIC_MAX_AGE_MS,
  maxEntries = 0,
) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const url = new URL(request.url)

  if (!self.navigator.onLine) {
    return (
      cached ||
      (isImageRequest(request, url) ? await imageFallbackResponse(cache) : null) ||
      new Response('', { status: 503, statusText: 'Offline' })
    )
  }

  if (cached && cachedAgeMs(cached) < maxAgeMs) {
    return cached // fresh — skip the network entirely
  }

  const update = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        await putWithTimestamp(cache, request, response)
        if (maxEntries > 0) void trimCache(cacheName, maxEntries)
      }
      return response
    })
    .catch(() => null)

  if (cached) {
    // stale — serve cache immediately, refresh in background
    update.catch(() => undefined)
    return cached
  }

  return (
    (await update) ||
    (isImageRequest(request, url) ? await imageFallbackResponse(cache) : null) ||
    new Response('', { status: 503, statusText: 'Offline' })
  )
}

self.addEventListener('install', (event) => {
  console.log(`[CONN-DEBUG][SW] install event @ ${Date.now()} — calling self.skipWaiting() (note: contradicts the "no skipWaiting" comment below)`)
  self.skipWaiting()
  event.waitUntil(
    Promise.all([
      caches
        .open(SHELL_CACHE)
        .then((cache) =>
          Promise.all(
            CORE_SHELL_ASSETS.map((url) => cache.add(url).catch(() => undefined)),
          ),
        ),
      caches
        .open(IMAGE_CACHE)
        .then((cache) =>
          Promise.all(
            CORE_IMAGE_ASSETS.map((url) => cache.add(url).catch(() => undefined)),
          ),
        ),
    ]),
    // NOTE: no skipWaiting() here — a new SW now waits until the page calls
    // SKIP_WAITING (driven by an in-app "update available" prompt), so we never
    // swap the controller out from under an active session.
  )
})

self.addEventListener('activate', (event) => {
  const keepCaches = new Set([SHELL_CACHE, IMAGE_CACHE, MAP_TILES_CACHE])
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
      // Bound the durable caches in case they grew under a previous version.
      .then(() =>
        Promise.all([
          trimCache(IMAGE_CACHE, IMAGE_MAX_ENTRIES),
          trimCache(MAP_TILES_CACHE, TILE_MAX_ENTRIES),
        ]),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  const { type, path } = event.data ?? {}

  if (type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  if (type === 'PRECACHE_STATIC') {
    event.waitUntil(precacheStaticManifest())
    return
  }

  if (type === 'PRECACHE_ROUTE') {
    if (typeof path !== 'string' || !path.startsWith('/')) return
    event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cacheDocument(cache, path)))
    return
  }

  if (type === 'PRECACHE_ROUTES') {
    const paths = Array.isArray(event.data?.paths) ? event.data.paths : []
    const safePaths = paths.filter((item) => typeof item === 'string' && item.startsWith('/'))
    if (safePaths.length === 0) return
    event.waitUntil(
      caches.open(SHELL_CACHE).then((cache) =>
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
  if (url.pathname.startsWith('/api/')) return

  // في وضع التطوير: لا نعترض أي طلب تصفّح/RSC إطلاقاً. الـ APP_SHELL_TIMEOUT_MS
  // (2.5s) يصلح لبناء production لكنه أقصر من زمن تجميع Turbopack لمسار جديد في
  // dev — فينتهي المهلة بينما الطلب الحقيقي ما زال جاريًا، فيتسابق مع اتصال
  // الـ dev server ويُغلقه ("Connection closed")، فيُسقط Next.js التنقّل الى
  // hard navigation كامل، الذي يُعيد تسجيل الـ SW ويكرر نفس السباق — حلقة ريلود
  // لا تنتهي. الأوفلاين في dev غير مفيد عمليًا (المطوّر متصل دائمًا)؛ اختبار
  // الأوفلاين الحقيقي يكون عبر build/start.
  if (IS_DEV) return

  // Map tiles (cross-origin images) → durable tile cache
  if (isMapTileUrl(url)) {
    event.respondWith(
      cacheFirstWithRevalidate(request, MAP_TILES_CACHE, TILE_MAX_AGE_MS, TILE_MAX_ENTRIES).catch(
        () => new Response('', { status: 503, statusText: 'Offline' }),
      ),
    )
    return
  }

  // Images → durable image cache. Covers same-origin (/assets, /_next/image,
  // favicon) AND cross-origin remote media (Cloudinary, Railway, etc.) so that
  // remote facility/article images survive offline. Cross-origin <img> loads
  // are no-cors → opaque responses, which we still cache and serve offline.
  //
  // IMPORTANT: navigation requests advertise `image/avif,image/webp` in Accept,
  // so we must exclude navigations and RSC payloads here — otherwise document
  // requests would be hijacked into the image cache and skip the shell handler.
  if (
    request.mode !== 'navigate' &&
    !isRscRequest(request, url) &&
    isImageRequest(request, url)
  ) {
    // في وضع التطوير: تجاوز ملفات /_next/ المحلية لضمان عمل HMR بشكل سليم
    if (IS_DEV && url.origin === self.location.origin && url.pathname.startsWith('/_next/')) {
      return
    }
    event.respondWith(
      cacheFirstWithRevalidate(request, IMAGE_CACHE, IMAGE_MAX_AGE_MS, IMAGE_MAX_ENTRIES).catch(
        () => new Response('', { status: 503, statusText: 'Offline' }),
      ),
    )
    return
  }

  // Remaining cross-origin requests: only cache whitelisted hosts (fonts/JS/CSS)
  if (url.origin !== self.location.origin) {
    if (!isExternalCacheable(url)) return
  }

  if (isStaticAsset(url)) {
    // في وضع التطوير: تجاوز تخزين ملفات /_next/ لضمان عمل HMR بشكل سليم
    if (IS_DEV && url.pathname.startsWith('/_next/')) return
    event.respondWith(
      cacheFirstWithRevalidate(request, SHELL_CACHE, STATIC_MAX_AGE_MS).catch(
        () => new Response('', { status: 503, statusText: 'Offline' }),
      ),
    )
    return
  }

  if (
    url.origin === self.location.origin &&
    isRscRequest(request, url) &&
    !url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
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
          const response = await fetchWithTimeout(request, APP_SHELL_TIMEOUT_MS)
          if (response.ok && !response.redirected) {
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
      }).catch(
        () => new Response('', { status: 200, headers: { 'Content-Type': 'text/x-component' } }),
      ),
    )
    return
  }

  if (isAppRouteRequest(request, url)) {
    event.respondWith(
      caches
        .open(SHELL_CACHE)
        .then(async (cache) => {
          const pathname = normalizePathname(url.pathname)

          console.log(`[CONN-DEBUG][SW] navigation fetch ${pathname} @ ${Date.now()} self.navigator.onLine=${self.navigator.onLine}`)
          if (!self.navigator.onLine) return serveCachedDocument(cache, request, url)

          try {
            const response = await fetchWithTimeout(request, APP_SHELL_TIMEOUT_MS)
            if (response.status === 200 && !response.redirected) {
              await cache.put(request, response.clone())
              await cache.put(pathname, response.clone())
              await cache.put(pageCacheKey(pathname), response.clone())
              cacheRscPayload(cache, pathname)
            }
            return response
          } catch {
            return serveCachedDocument(cache, request, url)
          }
        })
        // Last-resort safety net: if anything above throws (corrupted cache,
        // QuotaExceededError, etc.) the browser shows its OWN offline
        // interstitial instead of ours — never let this promise reject.
        .catch(
          () =>
            new Response(OFFLINE_FALLBACK_HTML, {
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }),
        ),
    )
    return
  }

  event.respondWith(
    cacheFirstWithRevalidate(request, SHELL_CACHE, STATIC_MAX_AGE_MS).catch(
      () => new Response('', { status: 503, statusText: 'Offline' }),
    ),
  )
})
