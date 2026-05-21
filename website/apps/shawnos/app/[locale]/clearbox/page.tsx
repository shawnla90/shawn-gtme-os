import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { ButtonLink } from '@shawnos/shared/components/ui'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Clearbox — see your market, move first',
  description:
    'Clearbox is a signal-based market intelligence engine. Launching this week. Join early access.',
  alternates: { canonical: 'https://shawnos.ai/clearbox' },
  openGraph: {
    title: 'Clearbox — see your market, move first',
    description: 'Signal-based market intelligence. Launching this week.',
    url: 'https://shawnos.ai/clearbox',
    images: [
      {
        url: '/og?title=Clearbox&subtitle=see+your+market+move+first',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default async function ClearboxInterimPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <section
      style={{
        padding: '64px 24px 120px',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '48px',
        }}
      >
        <Image
          src="/clearbox/aura-logo.png"
          alt="Clearbox"
          width={64}
          height={64}
          style={{ opacity: 0.95 }}
        />
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Launching this week
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          See your market. Move first.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '18px',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: 0,
          }}
        >
          Clearbox is a signal-based intelligence engine. It reads the
          conversations your buyers are already having and labels every thread
          as a lead, a competitor mention, or an engagement opportunity, with
          an Aura score telling you which to act on first.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ButtonLink
            href="https://discord.gg/6eKe49nth"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
          >
            Join early access
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </header>

      {/* Demo slot — ch16 InboxPanel + AuraPanel port lands here once pasted. */}
      <div
        style={{
          marginTop: '48px',
          padding: '64px 24px',
          background: 'var(--canvas-subtle)',
          border: '1px dashed var(--canvas-border)',
          borderRadius: '16px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        // demo coming. inbox + aura panel render here.
      </div>
    </section>
  )
}
