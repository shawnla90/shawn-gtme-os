import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { fetchUserProfile } from '@shawnos/shared/lib/reddit'
import { RedditTabs } from './RedditTabs'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Reddit Growth Playbook — 1,000+ Karma in 30 Days'
  const description =
    'How I went from zero to 1,000+ karma in one month with a 50/50 post-comment ratio. Real evidence, real numbers, no gatekeeping.'
  return {
    title,
    description,
    keywords: [
      'Reddit growth strategy 2026',
      'how to grow on Reddit',
      'Reddit karma strategy',
      'Reddit for business',
      'Reddit marketing without spam',
      'Reddit commenting strategy',
      'Reddit post types',
      'grow Reddit account fast',
    ],
    alternates: { canonical: `${SITE_URL}/reddit`, languages: hreflang('/reddit') },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/reddit`,
      images: [
        {
          url: `/og?title=${encodeURIComponent('Reddit Growth Playbook')}&subtitle=${encodeURIComponent('1,000+ karma in 30 days. the evidence.')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent('Reddit Growth Playbook')}&subtitle=${encodeURIComponent('1,000+ karma in 30 days. the evidence.')}`,
      ],
    },
  }
}

/* ── styles ─────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 880,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const heroSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0 48px',
}

const heroTitle: React.CSSProperties = {
  fontSize: 'clamp(28px, 5vw, 42px)',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.15,
  margin: '0 0 16px',
  letterSpacing: '-0.03em',
}

const heroAccent: React.CSSProperties = {
  color: '#FF4500',
}

const heroSub: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  maxWidth: 560,
  margin: '0 auto',
}

const statGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '16px',
  margin: '40px 0',
}

const statCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '20px 16px',
  textAlign: 'center',
}

const statNumber: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#FF4500',
  margin: '0 0 4px',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const sectionDivider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const ctaBlock: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.08), rgba(255, 69, 0, 0.02))',
  border: '1px solid rgba(255, 69, 0, 0.2)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center',
  marginTop: '48px',
}

const ctaTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '0 0 12px',
}

const ctaDesc: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: '0 0 20px',
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: '#FF4500',
  padding: '10px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
}

/* ── page component ─────────────────────────────────── */

export default async function RedditPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const profile = await fetchUserProfile('Shawntenam')

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Reddit Growth Playbook', url: `${SITE_URL}/reddit` }]}
      />

      <div style={pageWrap}>
        {/* Hero */}
        <section style={heroSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/reddit-evidence/reddit-logo-dark.png"
            alt="Reddit"
            style={{
              width: '180px',
              height: 'auto',
              margin: '0 auto 24px',
              display: 'block',
              opacity: 0.9,
              borderRadius: '12px',
            }}
          />
          <h1 style={heroTitle}>
            <span style={heroAccent}>Reddit</span> Growth Playbook
          </h1>
          <p style={heroSub}>
            1,000+ karma in 30 days. nearly 50/50 post-comment ratio. 250K+ impressions across 30 communities.
            <br />
            here&apos;s exactly how I did it, what flopped, and why the receipts matter more than the advice.
          </p>
        </section>

        {/* Stats */}
        <div style={statGrid}>
          <div style={statCard}>
            <p style={statNumber}>{profile?.totalKarma?.toLocaleString() ?? '1,089'}</p>
            <p style={statLabel}>total karma</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>250K+</p>
            <p style={statLabel}>impressions</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>50/50</p>
            <p style={statLabel}>post/comment ratio</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>30</p>
            <p style={statLabel}>days</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>226</p>
            <p style={statLabel}>contributions</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>24</p>
            <p style={statLabel}>achievements</p>
          </div>
        </div>

        <hr style={sectionDivider} />

        {/* All content lives in tabs: posts guide (types → rules → receipts) | comments guide */}
        <RedditTabs />

        <hr style={sectionDivider} />

        {/* CTA */}
        <div style={ctaBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/reddit-evidence/reddit-3d-snoo.png"
            alt=""
            style={{
              width: '80px',
              height: 'auto',
              margin: '0 auto 16px',
              display: 'block',
              borderRadius: '8px',
              filter: 'brightness(0.95)',
            }}
          />
          <p style={ctaTitle}>want to build with us?</p>
          <p style={ctaDesc}>
            r/GTMBuilders is where the building happens. 120+ people shipping real work.
            <br />
            no gatekeeping. no courses. just builders.
          </p>
          <a
            href="https://reddit.com/r/GTMBuilders"
            target="_blank"
            rel="noopener noreferrer"
            style={ctaLink}
          >
            join r/GTMBuilders
          </a>
        </div>

        {/* Related */}
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <a href="/community" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
            &larr; community feed
          </a>
          <a href="/blog/reddit-is-king" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
            case study: reddit is king &rarr;
          </a>
        </div>
      </div>
    </>
  )
}
