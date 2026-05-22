'use client'

import { useState } from 'react'
import { PillTabs, type PillTabItem, ButtonLink } from '@shawnos/shared/components/ui'

export interface KnowledgeTabSummary {
  id: string
  label: string
  count?: number
  countSuffix?: string
  description: string
  categoriesText?: string
  samples: { title: string; href?: string }[]
  fullHref: string
  fullLabel: string
}

interface KnowledgeHubProps {
  tabs: KnowledgeTabSummary[]
}

export function KnowledgeHub({ tabs }: KnowledgeHubProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? '')

  const pillItems: PillTabItem[] = tabs.map((t) => ({
    id: t.id,
    label: t.count != null ? `${t.label} · ${t.count}${t.countSuffix ?? ''}` : t.label,
  }))

  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <section
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '48px 24px 96px',
      }}
    >
      <header style={{ marginBottom: '32px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}
        >
          // the knowledge hub
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(32px, 4.5vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}
        >
          Everything I&apos;ve learned, in one place.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '640px',
            margin: 0,
          }}
        >
          Wikis, how-tos, the daily log, the long-form playbook. Pick a tab to drop in.
        </p>
      </header>

      <div style={{ overflowX: 'auto', marginBottom: '32px', paddingBottom: '4px' }}>
        <PillTabs items={pillItems} value={active} onChange={setActive} ariaLabel="Knowledge hub sections" />
      </div>

      {current && (
        <article
          style={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--canvas-border)',
            borderRadius: '16px',
            padding: '32px 28px',
          }}
        >
          <header style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              {current.label}
              {current.count != null && (
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '12px', fontSize: '17px' }}>
                  {current.count}
                  {current.countSuffix ?? ''}
                </span>
              )}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {current.description}
            </p>
            {current.categoriesText && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginTop: '12px',
                }}
              >
                {current.categoriesText}
              </p>
            )}
          </header>

          {current.samples.length > 0 && (
            <ul
              style={{
                listStyle: 'none',
                margin: '0 0 24px',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {current.samples.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>›</span>
                  {s.href ? (
                    <a href={s.href} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {s.title}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <ButtonLink href={current.fullHref} variant="primary" size="md">
            {current.fullLabel}
          </ButtonLink>
        </article>
      )}
    </section>
  )
}
