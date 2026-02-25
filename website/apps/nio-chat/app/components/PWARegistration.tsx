// NioBot PWA — Service worker registration + online/offline status + iOS install hint

'use client'

import { useEffect, useState } from 'react'

export default function PWARegistration() {
  const [offline, setOffline] = useState(false)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // --- Service Worker registration ---
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        // Check for updates every 5 min (was 30 — too slow for active dev)
        setInterval(() => reg.update(), 5 * 60 * 1000)

        // Also check immediately on page focus (user switches back to Nio)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update()
        })

        // If there's already a waiting worker on load, activate it immediately
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        }

        // Detect new SW waiting
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Auto-activate immediately instead of showing a toast
              newWorker.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
      })

      // Auto-reload when new SW takes over
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }

    // --- Online/offline detection ---
    const goOffline = () => setOffline(true)
    const goOnline = () => setOffline(false)

    setOffline(!navigator.onLine)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)

    // --- iOS install hint ---
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone)

    if (isIOS && !isStandalone) {
      const dismissed = localStorage.getItem('niobot-install-dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setShowInstallHint(true), 2000)
        return () => {
          clearTimeout(timer)
          window.removeEventListener('offline', goOffline)
          window.removeEventListener('online', goOnline)
        }
      }
    }

    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  function dismissInstallHint() {
    setShowInstallHint(false)
    localStorage.setItem('niobot-install-dismissed', '1')
  }

  function handleUpdate() {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.waiting?.postMessage({ type: 'SKIP_WAITING' })
    })
  }

  return (
    <>
      {/* Offline banner */}
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 bg-[#f8514920] border-b border-[#f85149] text-[#f85149] text-xs font-medium"
          style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#f85149] animate-pulse" />
          offline — messages queued until reconnect
        </div>
      )}

      {/* Update available toast */}
      {updateAvailable && (
        <div className="fixed bottom-20 left-4 right-4 z-[100] flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--canvas-overlay)] border border-[var(--accent)] shadow-lg">
          <span className="text-xs text-[var(--text-secondary)]">new version available</span>
          <button
            onClick={handleUpdate}
            className="text-xs font-bold px-3 py-1 rounded-lg bg-[var(--accent)] text-[var(--canvas)]"
          >
            update
          </button>
        </div>
      )}

      {/* iOS install hint — top banner style, clear of bottom UI */}
      {showInstallHint && (
        <div className="fixed top-14 left-3 right-3 z-[100] rounded-xl bg-[var(--canvas-overlay)] border border-[var(--accent)] shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[var(--text-primary)] leading-relaxed">
                <span className="font-bold">install NioBot</span>
                {' — tap '}
                <span className="inline-flex items-center align-middle mx-0.5 px-1.5 py-0.5 rounded bg-[var(--canvas)] border border-[var(--border)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
                  </svg>
                </span>
                {' then "Add to Home Screen"'}
              </p>
            </div>
            <button
              onClick={dismissInstallHint}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 p-1"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
