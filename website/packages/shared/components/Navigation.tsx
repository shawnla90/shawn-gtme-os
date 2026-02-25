'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface NavLink {
  href: string
  label: string
}

interface NavigationProps {
  siteName: string
  links?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/vitals', label: 'Vitals' },
  { href: '/about', label: 'About' },
]

export function Navigation({ siteName, links = defaultLinks }: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    if (drawerOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [drawerOpen, closeDrawer])

  const isActive = (href: string) => {
    if (href.startsWith('http')) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <style>{`
        /* ── Desktop link row ── */
        .nav-link {
          color: var(--text-secondary);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .nav-link:hover {
          color: var(--accent);
        }
        .nav-link-active {
          color: var(--accent) !important;
        }
        .nav-link-row {
          display: flex;
          gap: 24px;
        }

        /* ── Hamburger button ── */
        .nav-hamburger {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .nav-hamburger:hover {
          color: var(--accent);
          border-color: var(--accent);
        }

        /* ── Mobile drawer ── */
        .nav-backdrop {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .nav-backdrop-open {
          opacity: 1;
        }
        .nav-drawer {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--canvas);
          border-bottom: 1px solid var(--border);
          z-index: 999;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .nav-drawer-open {
          max-height: 85vh;
          overflow-y: auto;
        }
        .nav-drawer-link {
          display: block;
          padding: 14px 20px;
          color: var(--text-secondary);
          font-size: 15px;
          text-decoration: none;
          font-family: var(--font-mono);
          transition: color 0.15s ease, background 0.15s ease;
          min-height: 48px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }
        .nav-drawer-link:hover {
          color: var(--accent);
          background: var(--canvas-subtle);
        }
        .nav-drawer-link-active {
          color: var(--accent) !important;
          border-left: 3px solid var(--accent);
          padding-left: 17px;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .nav-link-row {
            display: none !important;
          }
          .nav-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-drawer {
            display: block;
          }
          .nav-backdrop {
            display: block;
          }
        }
      `}</style>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          fontFamily: 'var(--font-mono)',
          position: 'relative',
          zIndex: 1000,
        }}
      >
        {/* Logo / Site name */}
        <a
          href="/"
          style={{
            color: 'var(--accent)',
            fontSize: '18px',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          {siteName}
        </a>

        {/* Desktop link row */}
        <div className="nav-link-row">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href) ? ' nav-link-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {drawerOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Backdrop */}
      <div
        className={`nav-backdrop${drawerOpen ? ' nav-backdrop-open' : ''}`}
        onClick={closeDrawer}
        style={{ pointerEvents: drawerOpen ? 'auto' : 'none' }}
      />

      {/* Slide-down drawer (mobile only) */}
      <div className={`nav-drawer${drawerOpen ? ' nav-drawer-open' : ''}`}>
        <div style={{ padding: '8px 0' }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-drawer-link${isActive(link.href) ? ' nav-drawer-link-active' : ''}`}
              onClick={closeDrawer}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
