'use client'

import Image from 'next/image'
import { VercelSnapText } from '../../../components/unlumen-ui/vercel-snap-text'
import GooeySvgFilter from '../../../components/unlumen-ui/gooey-svg-filter'
import { ClearboxModeDemo } from './ClearboxModeDemo'

export function ClearboxDemo() {
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
        <ClearboxModeDemo />
      </section>

      {/* Gooey filter kept for the page's wiki cluster */}
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
