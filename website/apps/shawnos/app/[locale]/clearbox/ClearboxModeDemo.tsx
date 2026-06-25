'use client'

import { useMemo, useState } from 'react'
import { PillTabs, type PillTabItem } from '@shawnos/shared/components/ui'
import { InlineTestimonials, type Testimonial } from '../../../components/unlumen-ui/inline-testimonials'
import { SmartAnimateText } from '../../../components/unlumen-ui/smart-animate-text'
import { inlineQuotes, type ClearboxCategory } from './quotes'

const MODE_TABS: PillTabItem[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'competitor', label: 'Competitor' },
  { id: 'engager', label: 'Engager' },
]

const MODE_COPY: Record<ClearboxCategory, { caption: string; auraScore: string }> = {
  lead: {
    caption: 'Buyers signaling intent to solve a problem in your category.',
    auraScore: '89',
  },
  competitor: {
    caption: 'Conversations naming or comparing against a tool you already compete with.',
    auraScore: '73',
  },
  engager: {
    caption: 'High-context threads where showing up adds real value.',
    auraScore: '92',
  },
}

/**
 * The interactive Clearbox mode selector (Lead / Competitor / Engager) with the
 * Aura score and filtered testimonials. Extracted so it can be reused both on
 * the /clearbox landing page and as a "what Clearbox is" teaser on the homepage.
 */
export function ClearboxModeDemo() {
  const [mode, setMode] = useState<ClearboxCategory>('lead')

  const filteredTestimonials: Testimonial[] = useMemo(() => {
    return inlineQuotes
      .filter((q) => q.category === mode)
      .map((q) => ({ id: q.id, text: q.text, author: q.author }))
  }, [mode])

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
            onChange={(id) => setMode(id as ClearboxCategory)}
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
            value={MODE_COPY[mode].auraScore}
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
          marginBottom: '32px',
        }}
      >
        {MODE_COPY[mode].caption}
      </p>

      <div
        style={{
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--canvas-border)',
          borderRadius: '16px',
          padding: '32px 28px',
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
          // what people are actually saying
        </p>
        <InlineTestimonials
          testimonials={filteredTestimonials}
          accentColor="var(--text-primary)"
          avatarSize={32}
          fontSize={22}
          blurAmount={5}
          blurOpacity={0.3}
        />
      </div>
    </div>
  )
}
