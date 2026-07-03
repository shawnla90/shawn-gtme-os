'use client'

import { useState } from 'react'
import { PillTabs, type PillTabItem } from '@shawnos/shared/components/ui'
import { SmartAnimateText } from '../unlumen-ui/smart-animate-text'

type ClearboxMode = 'lead' | 'competitor' | 'engager'

const MODE_TABS: PillTabItem[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'competitor', label: 'Competitor' },
  { id: 'engager', label: 'Engager' },
]

const MODE_COPY: Record<
  ClearboxMode,
  { caption: string; auraScore: string; signals: Array<{ step: string; detail: string }> }
> = {
  lead: {
    caption: 'Buyers signaling intent to solve a problem in your category.',
    auraScore: '89',
    signals: [
      { step: 'signal detected', detail: 'a buyer describes the exact problem you solve' },
      { step: 'thread scored', detail: 'Aura ranks it against everything else live right now' },
      { step: 'move first', detail: 'you show up in the conversation before anyone else does' },
    ],
  },
  competitor: {
    caption: 'Conversations naming or comparing against a tool you already compete with.',
    auraScore: '73',
    signals: [
      { step: 'competitor named', detail: 'a thread compares tools in your category' },
      { step: 'sentiment mapped', detail: 'Aura reads what the market likes and what it wants fixed' },
      { step: 'move first', detail: 'you answer the comparison while it still matters' },
    ],
  },
  engager: {
    caption: 'High-context threads where showing up adds real value.',
    auraScore: '92',
    signals: [
      { step: 'thread surfaced', detail: 'a high-context discussion in your market picks up steam' },
      { step: 'angle scored', detail: 'Aura scores where your experience adds the value' },
      { step: 'move first', detail: 'you build presence where the buyers already read' },
    ],
  },
}

/**
 * The interactive Clearbox mode selector (Lead / Competitor / Engager) with the
 * Aura score and a per-mode signal walkthrough. Lives on the homepage as the
 * "what Clearbox is" teaser; the full product is at clearbox.to.
 */
export function ClearboxModeDemo() {
  const [mode, setMode] = useState<ClearboxMode>('lead')
  const copy = MODE_COPY[mode]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div>
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
            // pick a mode
          </p>
          <PillTabs
            items={MODE_TABS}
            value={mode}
            onChange={(id) => setMode(id as ClearboxMode)}
            ariaLabel="Clearbox mode selector"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 4px',
            }}
          >
            Aura
          </p>
          <SmartAnimateText
            value={copy.auraScore}
            className="text-5xl font-bold text-[var(--text-primary)]"
          />
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: '640px',
          marginBottom: '28px',
        }}
      >
        {copy.caption}
      </p>

      <div
        style={{
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--canvas-border)',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          // how {mode} mode runs
        </p>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {copy.signals.map((s, i) => (
            <li
              key={s.step}
              style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--aura-strong)',
                  minWidth: '150px',
                }}
              >
                {`0${i + 1} · ${s.step}`}
              </span>
              <span style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, flex: 1, minWidth: '220px' }}>
                {s.detail}
              </span>
            </li>
          ))}
        </ol>
        <a
          href="https://clearbox.to"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: 'var(--text-primary)',
            color: 'var(--canvas)',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Open Clearbox ↗
        </a>
      </div>
    </div>
  )
}
