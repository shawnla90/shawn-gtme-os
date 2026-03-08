'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '../hooks/useTheme'

interface NavLink {
  href: string
  label: string
  children?: NavLink[]
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
    setExpandedGroups(new Set())
    closeDrawer()
  }, [pathname, closeDrawer])

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
      if (e.key === 'Escape') {
        closeDrawer()
        setOpenDropdown(null)
      }
    }
    if (drawerOpen || openDropdown) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [drawerOpen, openDropdown, closeDrawer])

  const isActive = (href: string) => {
    if (href.startsWith('http')) return false
    if (href === '/' || href === '#') return pathname === href
    return pathname.startsWith(href)
  }

  const isGroupActive = (link: NavLink) => {
    if (link.children) {
      return link.children.some((child) => isActive(child.href))
    }
    return isActive(link.href)
  }

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
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
          align-items: center;
        }

        /* ── Desktop dropdown ── */
        .nav-dropdown-wrap {
          position: relative;
        }
        .nav-dropdown-trigger {
          color: var(--text-secondary);
          font-size: 14px;
          cursor: default;
          user-select: none;
          transition: color 0.15s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-dropdown-trigger:hover {
          color: var(--accent);
        }
        .nav-dropdown-chevron {
          font-size: 10px;
          transition: transform 0.2s ease;
          line-height: 1;
        }
        .nav-dropdown-chevron-open {
          transform: rotate(180deg);
        }
        .nav-dropdown-panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--canvas);
          border: 1px solid var(--border);
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 6px 0;
          min-width: 160px;
          z-index: 1001;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
        }
        .nav-dropdown-panel-open {
          opacity: 1;
          pointer-events: auto;
        }
        .nav-dropdown-panel a {
          display: block;
          padding: 8px 16px;
          color: var(--text-secondary);
          font-size: 14px;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .nav-dropdown-panel a:hover {
          color: var(--accent);
          background: var(--canvas-subtle);
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
          display: flex;
          align-items: center;
          padding: 14px 20px;
          color: var(--text-secondary);
          font-size: 15px;
          text-decoration: none;
          font-family: var(--font-mono);
          transition: color 0.15s ease, background 0.15s ease;
          min-height: 48px;
          box-sizing: border-box;
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
        .nav-drawer-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          color: var(--text-secondary);
          font-size: 15px;
          font-family: var(--font-mono);
          cursor: pointer;
          user-select: none;
          min-height: 48px;
          box-sizing: border-box;
          transition: color 0.15s ease, background 0.15s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .nav-drawer-group-header:hover {
          color: var(--accent);
          background: var(--canvas-subtle);
        }
        .nav-drawer-group-children {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.25s ease;
        }
        .nav-drawer-group-children-open {
          max-height: 500px;
        }
        .nav-drawer-group-children a {
          padding-left: 40px;
          border-left: 2px solid var(--border);
          margin-left: 20px;
        }
        .nav-drawer-group-children a.nav-drawer-link-active {
          border-left: 3px solid var(--accent);
          padding-left: 39px;
        }

        /* ── Theme toggle ── */
        .nav-theme-toggle {
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 14px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .nav-theme-toggle:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .nav-theme-toggle-mobile {
          background: none;
          border: none;
          border-bottom: 1px solid var(--border);
          padding: 14px 20px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 15px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          text-align: left;
          min-height: 48px;
          box-sizing: border-box;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .nav-theme-toggle-mobile:hover {
          color: var(--accent);
          background: var(--canvas-subtle);
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
          {links.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="nav-dropdown-wrap"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <span
                  className={`nav-dropdown-trigger${isGroupActive(link) ? ' nav-link-active' : ''}`}
                >
                  {link.label}
                  <span
                    className={`nav-dropdown-chevron${openDropdown === link.label ? ' nav-dropdown-chevron-open' : ''}`}
                  >
                    ▾
                  </span>
                </span>
                <div
                  className={`nav-dropdown-panel${openDropdown === link.label ? ' nav-dropdown-panel-open' : ''}`}
                >
                  {link.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={isActive(child.href) ? 'nav-link-active' : ''}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link${isActive(link.href) ? ' nav-link-active' : ''}`}
              >
                {link.label}
              </a>
            )
          )}
          <button
            className="nav-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'anthropic mode' : 'dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
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
          <button
            className="nav-theme-toggle-mobile"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {theme === 'dark' ? 'anthropic mode' : 'dark mode'}
          </button>
          {links.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  className={`nav-drawer-group-header${isGroupActive(link) ? ' nav-link-active' : ''}`}
                  onClick={() => toggleGroup(link.label)}
                >
                  <span>{link.label}</span>
                  <span
                    className={`nav-dropdown-chevron${expandedGroups.has(link.label) ? ' nav-dropdown-chevron-open' : ''}`}
                  >
                    ▾
                  </span>
                </button>
                <div
                  className={`nav-drawer-group-children${expandedGroups.has(link.label) ? ' nav-drawer-group-children-open' : ''}`}
                >
                  {link.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={`nav-drawer-link${isActive(child.href) ? ' nav-drawer-link-active' : ''}`}
                      onClick={closeDrawer}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`nav-drawer-link${isActive(link.href) ? ' nav-drawer-link-active' : ''}`}
                onClick={closeDrawer}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </>
  )
}
