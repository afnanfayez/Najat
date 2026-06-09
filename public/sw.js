const CACHE_NAME = 'najat-pwa-cache-v6';
const AUTH_ROUTES = ['/login', '/register', '/dashboard', '/admin', '/volunteer'];
const ASSETS_TO_CACHE = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/admin',
  '/volunteer',
  '/favicon.ico',
  '/assets/Logo1.png',
  '/assets/Logo1_cropped.png',
  '/assets/Logo2.png',
  '/assets/Logo3.png',
  '/assets/Photo1.png',
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff2',
];

async function cachePageAssets(cache, pagePath) {
  try {
    const response = await fetch(pagePath);
    if (!response.ok) return;
    await cache.put(pagePath, response.clone());
    const html = await response.text();
    const assetUrls = [
      ...html.matchAll(/(?:src|href)="([^"]*\/_next\/[^"]+)"/g),
      ...html.matchAll(/(?:src|href)="(\/_next\/[^"]+)"/g),
    ]
      .map((match) => {
        try {
          return new URL(match[1], self.location.origin).toString();
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    await Promise.all(
      [...new Set(assetUrls)].map((assetUrl) =>
        cache.add(assetUrl).catch(() => undefined),
      ),
    );
  } catch {
    // ignore precache failures for individual pages
  }
}

async function precacheAuthPages(cache) {
  await Promise.all(AUTH_ROUTES.map((route) => cachePageAssets(cache, route)));
}

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
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'PRECACHE_ROUTE') return
  const path = event.data.path
  if (typeof path !== 'string' || !path.startsWith('/')) return

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cachePageAssets(cache, path)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/favicon.ico' ||
    url.href.includes('unpkg.com') ||
    url.href.includes('gstatic.com') ||
    url.href.includes('google-fonts')
  );
}

function fallbackDocument(pathname) {
  if (pathname.startsWith('/register')) return '/register';
  if (pathname.startsWith('/admin')) return '/admin';
  if (pathname.startsWith('/volunteer')) return '/volunteer';
  if (pathname.startsWith('/dashboard')) return '/dashboard';
  return '/login';
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) {
    if (!url.href.includes('unpkg.com') && !url.href.includes('gstatic.com')) {
      return;
    }
  }

  if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
                cachePageAssets(cache, url.pathname);
              });
            }
            return response;
          })
          .catch(() => null);

        if (cachedResponse) {
          networkFetch.catch(() => undefined);
          return cachedResponse;
        }

        return networkFetch.then(
          (response) =>
            response ||
            caches.match(fallbackDocument(url.pathname)) ||
            caches.match('/login'),
        );
      }),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => null);

        if (cachedResponse) {
          networkFetch.catch(() => undefined);
          return cachedResponse;
        }

        return networkFetch.then((response) => response || cachedResponse);
      }),
    );
    return;
  }

  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
              }
              return response;
            })
            .catch(() => caches.match('/login')),
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => undefined),
    ),
  );
});
