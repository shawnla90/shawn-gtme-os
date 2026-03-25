'use client'

import { useState, useEffect } from 'react'
import type { Locale } from './i18n/types'

const STORAGE_KEY = 'webdev_lang_banner_dismissed'

const LANGUAGE_COUNT = 5

const bannerText: Record<Locale, string> = {
  en: `Now available in ${LANGUAGE_COUNT} languages`,
  he: `\u05D6\u05DE\u05D9\u05DF \u05D1-${LANGUAGE_COUNT} \u05E9\u05E4\u05D5\u05EA`,
  es: `Ahora disponible en ${LANGUAGE_COUNT} idiomas`,
  zh: `\u73B0\u5DF2\u63D0\u4F9B ${LANGUAGE_COUNT} \u79CD\u8BED\u8A00\u7248\u672C`,
  ja: `${LANGUAGE_COUNT}\u304B\u56FD\u8A9E\u3067\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u3059`,
}

interface LanguageBannerProps {
  locale: Locale
}

export function LanguageBanner({ locale }: LanguageBannerProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  if (dismissed) return null

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '10px 24px',
      backgroundColor: 'var(--canvas-subtle)',
      borderBottom: '1px dashed var(--accent)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      position: 'relative',
    }}>
      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
        {bannerText[locale]}
      </span>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: 16,
          padding: '0 4px',
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        &times;
      </button>
    </div>
  )
}
