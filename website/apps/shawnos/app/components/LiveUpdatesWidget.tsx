'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Announcement } from '../data/announcements'

const STORAGE_KEY = 'live_updates_dismissed'

interface LiveUpdatesWidgetProps {
  announcements: Announcement[]
}

export function LiveUpdatesWidget({ announcements }: LiveUpdatesWidgetProps) {
  const t = useTranslations('Home.liveUpdates')
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  if (dismissed || announcements.length === 0) return null

  const activeItems = announcements
    .filter((a) => a.active)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)

  if (activeItems.length === 0) return null

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="live-updates-widget">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="live-updates-widget"
          style={{
            position: 'fixed',
            bottom: 80,
            left: 24,
            zIndex: 9997,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            fontSize: 12,
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--canvas)',
            border: '1px dashed var(--border-dashed)',
            borderRadius: 20,
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-dashed)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
          aria-label={t('showUpdates')}
        >
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            animation: 'pulse-dot 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          {activeItems.length !== 1 ? t('updateCountPlural', { count: activeItems.length }) : t('updateCount', { count: activeItems.length })}
        </button>
      ) : (
        <div
          className="live-updates-widget"
          style={{
            position: 'fixed',
            bottom: 80,
            left: 24,
            zIndex: 9997,
            width: 300,
            maxWidth: 'calc(100vw - 48px)',
            backgroundColor: 'var(--canvas)',
            border: '1px dashed var(--border-dashed)',
            borderRadius: 12,
            padding: 16,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {t('updatesHeading')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                {t('minimize')}
              </button>
              <button
                onClick={handleDismiss}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label={t('dismissUpdates')}
              >
                &times;
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px dashed var(--border-dashed)',
                }}
              >
                <span style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  flexShrink: 0,
                  marginTop: 6,
                }} />
                <div style={{ flex: 1 }}>
                  {item.link ? (
                    <a
                      href={item.link}
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        lineHeight: 1.5,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.text}
                    </span>
                  )}
                  <div style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}>
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 639px) {
          .live-updates-widget { display: none !important; }
        }
      `}</style>
    </div>
  )
}
