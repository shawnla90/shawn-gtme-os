'use client'

import { useState, useEffect } from 'react'
import type { Locale } from './i18n/types'

const STORAGE_KEY = 'webdev_lang_banner_dismissed'

const bannerText: Record<Locale, string> = {
  en: 'Now available in English, Hebrew, Spanish, and Chinese',
  he: '\u05D6\u05DE\u05D9\u05DF \u05D2\u05DD \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA, \u05D0\u05E0\u05D2\u05DC\u05D9\u05EA, \u05E1\u05E4\u05E8\u05D3\u05D9\u05EA \u05D5\u05E1\u05D9\u05E0\u05D9\u05EA',
  es: 'Ahora disponible en ingl\u00e9s, hebreo, espa\u00f1ol y chino',
  zh: '\u73B0\u5DF2\u63D0\u4F9B\u82F1\u8BED\u3001\u5E0C\u4F2F\u6765\u8BED\u3001\u897F\u73ED\u7259\u8BED\u548C\u4E2D\u6587\u7248\u672C',
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
