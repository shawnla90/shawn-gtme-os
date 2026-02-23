// NioBot PWA Service Worker
// Cache-first for static assets, network-first for HTML, skip API/SSE

const CACHE_VERSION = 'niobot-pwa-v1'

const PRECACHE_URLS = [
  '/',
  '/offline.html',
]

// Install: precache shell + skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Activate: clean old caches + claim clients immediately
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

  // Static assets with hashed filenames — cache first (immutable)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Local images and icons — cache first
  if (url.pathname.startsWith('/icons/') || url.pathname.startsWith('/avatars/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Google Fonts — cache first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request))
    return
  }

  // HTML navigation — network first, offline fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallback(request))
    return
  }

  // Everything else — stale while revalidate
  event.respondWith(staleWhileRevalidate(request))
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
    // Try cache
    const cached = await caches.match(request)
    if (cached) return cached

    // Last resort: offline page
    const offlinePage = await caches.match('/offline.html')
    if (offlinePage) return offlinePage

    return new Response('Offline', { status: 503, statusText: 'Offline' })
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(CACHE_VERSION)
      cache.then(c => c.put(request, response.clone()))
    }
    return response
  }).catch(() => null)

  return cached || (await fetchPromise) || new Response('', { status: 503 })
}
