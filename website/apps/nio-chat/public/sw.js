// NioBot PWA Service Worker
// Network-first for HTML + JS bundles, cache-first only for immutable static assets
// CACHE_VERSION must be bumped on every deploy to bust stale caches

const CACHE_VERSION = 'niobot-pwa-v5'

const PRECACHE_URLS = [
  '/',
]

// Install: precache shell + skip waiting immediately (don't wait for old tabs)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Activate: purge ALL old caches + claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// Handle SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests
  if (request.method !== 'GET') return

  // Never cache API routes (chat SSE, auth, etc.)
  if (url.pathname.startsWith('/api/')) return

  // Never cache hot-reload / dev websocket
  if (url.pathname.startsWith('/_next/webpack-hmr')) return

  // Google Fonts — cache first (immutable CDN)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request))
    return
  }

  // Local images, icons, chimes — cache first (rarely change)
  if (url.pathname.startsWith('/icons/') || url.pathname.startsWith('/avatars/') || url.pathname.startsWith('/chimes/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Everything else (HTML, JS bundles, CSS) — network first
  // This ensures new deploys are picked up immediately
  event.respondWith(networkFirstWithFallback(request))
})

// --- Caching strategies ---

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' })
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Offline fallback — serve cached version
    const cached = await caches.match(request)
    if (cached) return cached

    return new Response('Offline', { status: 503, statusText: 'Offline' })
  }
}
