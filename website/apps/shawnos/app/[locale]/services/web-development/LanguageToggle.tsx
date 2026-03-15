'use client'

import type { Locale } from './i18n/types'

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  he: '\u05E2\u05D1',
  es: 'ES',
  zh: '中',
  ja: '日',
}

const localeUrls: Record<Locale, string> = {
  en: '/services/web-development',
  he: '/he/services/web-development',
  es: '/es/services/web-development',
  zh: '/zh/services/web-development',
  ja: '/ja/services/web-development',
}

interface LanguageToggleProps {
  locale: Locale
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0,
      borderRadius: 20,
      border: '1px dashed var(--border-dashed)',
      overflow: 'hidden',
    }}>
      {(Object.keys(localeLabels) as Locale[]).map((loc, i) => {
        const isActive = loc === locale
        return (
          <a
            key={loc}
            href={localeUrls[loc]}
            style={{
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              color: isActive ? 'var(--text-on-accent)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              borderLeft: i > 0 ? '1px dashed var(--border-dashed)' : 'none',
              transition: 'background-color 0.15s, color 0.15s',
              lineHeight: 1.6,
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {localeLabels[loc]}
          </a>
        )
      })}
    </div>
  )
}
