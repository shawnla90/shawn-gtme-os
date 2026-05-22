'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { PillTabs, type PillTabItem } from '@shawnos/shared/components/ui'
import { InlineTestimonials, type Testimonial } from '../../../components/unlumen-ui/inline-testimonials'
import { VercelSnapText } from '../../../components/unlumen-ui/vercel-snap-text'
import { SmartAnimateText } from '../../../components/unlumen-ui/smart-animate-text'
import GooeySvgFilter from '../../../components/unlumen-ui/gooey-svg-filter'
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

export function ClearboxDemo() {
  const [mode, setMode] = useState<ClearboxCategory>('lead')

  const filteredTestimonials: Testimonial[] = useMemo(() => {
    return inlineQuotes
      .filter((q) => q.category === mode)
      .map((q) => ({
        id: q.id,
        text: q.text,
        author: q.author,
      }))
  }, [mode])

  return (
    <>
      {/* What Clearbox finds — scroll story */}
      <section
        style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid var(--canvas-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          // what it finds
        </p>
        <div style={{ height: '480px', position: 'relative' }}>
          <VercelSnapText
            items={['Leads.', 'Competitors.', 'Engagers.']}
            prefix="Clearbox surfaces"
            itemHeight={120}
            className="text-[var(--text-primary)]"
          />
        </div>
      </section>

      {/* Mode selector + Aura score + filtered testimonials */}
      <section
        style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid var(--canvas-border)',
        }}
      >
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
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

        {/* Inline testimonials — real-ish quotes from public forums */}
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
            accentColor="#fafafa"
            avatarSize={32}
            fontSize={22}
            blurAmount={5}
            blurOpacity={0.3}
          />
        </div>
      </section>

      {/* Gooey filter for the home page wiki cluster — defined here too so the page has it if reused */}
      <GooeySvgFilter id="clearbox-gooey" strength={15} />

      {/* Hidden image preload — Next strict mode complains otherwise */}
      <Image
        src="/clearbox/aura-logo.png"
        alt=""
        width={1}
        height={1}
        style={{ display: 'none' }}
        priority
      />
    </>
  )
}
