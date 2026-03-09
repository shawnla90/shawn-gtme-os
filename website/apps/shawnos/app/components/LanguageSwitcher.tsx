'use client'

import { usePathname, useRouter } from '../../i18n/navigation'
import { useLocale } from 'next-intl'

const localeLabels: Record<string, string> = {
  en: 'EN',
  he: 'עב',
  es: 'ES',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0,
      borderRadius: 6,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {Object.entries(localeLabels).map(([loc, label], i) => {
        const isActive = loc === locale
        return (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              color: isActive ? 'var(--canvas)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              border: 'none',
              borderRight: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              ...(i > 0 ? { borderLeft: '1px solid var(--border)' } : {}),
              transition: 'background-color 0.15s, color 0.15s',
              lineHeight: 1.6,
            }}
            aria-label={`Switch to ${loc}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
