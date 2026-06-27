'use client'

import { useState } from 'react'
import { PillTabs, type PillTabItem } from '@shawnos/shared/components/ui'

export type KnowledgeLens = 'context' | 'gtm' | 'both'

export interface KnowledgeTabSummary {
  id: string
  label: string
  lens?: KnowledgeLens
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

type LensFilter = 'all' | 'context' | 'gtm'

const LENS_TAG: Record<KnowledgeLens, string> = {
  context: 'Context Eng',
  gtm: 'GTM Eng',
  both: 'Both',
}

export function KnowledgeHub({ tabs }: KnowledgeHubProps) {
  const [lens, setLens] = useState<LensFilter>('all')

  const lensItems: PillTabItem[] = [
    { id: 'all', label: 'Both worlds' },
    { id: 'context', label: 'Context Engineering' },
    { id: 'gtm', label: 'Go-To-Market' },
  ]

  const visible = tabs.filter(
    (t) => lens === 'all' || t.lens === 'both' || t.lens === lens,
  )

  return (
    <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px 96px' }}>
      <style>{`
        .kh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 18px; }
        .kh-card {
          background: var(--canvas-subtle); border: 1px solid var(--canvas-border);
          border-radius: var(--radius-lg); padding: 26px 24px; display: flex; flex-direction: column;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .kh-card:hover { transform: translateY(-3px); border-color: var(--text-secondary); background: var(--canvas-card); }
        .kh-lens-tag {
          align-self: flex-start; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-muted); border: 1px solid var(--canvas-border);
          border-radius: var(--radius-pill); padding: 4px 10px; margin-bottom: 14px;
        }
        .kh-cta { margin-top: auto; font-size: 14px; font-weight: 600; color: var(--text-primary);
          text-decoration: none; }
        .kh-cta:hover { opacity: 0.7; }
      `}</style>

      {/* framing */}
      <header style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
          // the knowledge hub
        </p>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Two worlds. One practice.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', margin: 0 }}>
          One side is <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>context engineering</strong> — building with
          Claude, Cursor, agents, the whole AI-native stack. The other is{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>go-to-market engineering</strong> — turning that machine into
          pipeline, content, and revenue. People file them as two different jobs. I don&apos;t. Same person, same
          codebase, pointed at two problems. Pick a lens — or read both.
        </p>
      </header>

      {/* lens toggle */}
      <div style={{ overflowX: 'auto', marginBottom: '28px', paddingBottom: '4px' }}>
        <PillTabs
          items={lensItems}
          value={lens}
          onChange={(v) => setLens(v as LensFilter)}
          ariaLabel="Filter knowledge by lens"
        />
      </div>

      {/* surface grid */}
      <div className="kh-grid">
        {visible.map((t) => (
          <article key={t.id} className="kh-card">
            <span className="kh-lens-tag">{LENS_TAG[t.lens ?? 'both']}</span>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '21px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              {t.label}
              {t.count != null && (
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '10px', fontSize: '14px' }}>
                  {t.count}
                  {t.countSuffix ?? ''}
                </span>
              )}
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
              {t.description}
            </p>

            {t.samples.length > 0 && (
              <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.samples.slice(0, 3).map((s, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>›</span>
                    {s.href ? (
                      <a href={s.href} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{s.title}</a>
                    ) : (
                      <span style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <a href={t.fullHref} className="kh-cta">{t.fullLabel} →</a>
          </article>
        ))}
      </div>
    </section>
  )
}
