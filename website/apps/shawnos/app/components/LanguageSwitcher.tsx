'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from '../../i18n/navigation'
import { useLocale } from 'next-intl'

const locales = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'he', label: 'עברית', short: 'עב' },
  { code: 'es', label: 'Espanol', short: 'ES' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
    setOpen(false)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = locales.find((l) => l.code === locale) ?? locales[0]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
          lineHeight: 1,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {current.short}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 130,
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {locales.map((l) => {
            const isActive = l.code === locale
            return (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-mono)',
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--canvas-subtle)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span>{l.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {l.short}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
