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
  const title = 'Reddit Growth Playbook — 2,000+ Karma in 3 Months'
  const description =
    'How I doubled to 2,000+ karma in 3 months with a 50/50 post-comment ratio and 1.5M+ views across r/GTMbuilders, r/gtmengineering, r/ClaudeCode and 15 other communities. Every Reddit conversation becomes a lead, a competitor signal, or an engagement opportunity.'
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
          url: `/og?title=${encodeURIComponent('Reddit Growth Playbook')}&subtitle=${encodeURIComponent('2,000+ karma in 3 months. the evidence.')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent('Reddit Growth Playbook')}&subtitle=${encodeURIComponent('2,000+ karma in 3 months. the evidence.')}`,
      ],
    },
  }
}

/* ── styles ─────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 880,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-editorial-body)',
}

const heroSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0 48px',
}

const heroTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display-walsh)',
  fontSize: 'clamp(48px, 9vw, 104px)',
  fontWeight: 500,
  color: 'var(--text-primary)',
  lineHeight: 0.92,
  margin: '0 0 24px',
  letterSpacing: '-0.05em',
}

const heroAccent: React.CSSProperties = {
  color: '#FF4500',
  fontWeight: 500,
}

const heroSub: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  maxWidth: 580,
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
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '30px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color: '#FF4500',
  margin: '0 0 6px',
  letterSpacing: '-0.02em',
}

const statLabel: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
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
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--text-primary)',
  margin: '0 0 14px',
  letterSpacing: '-0.01em',
  lineHeight: 1.25,
}

const ctaDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: '0 0 22px',
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: '#FF4500',
  padding: '11px 26px',
  borderRadius: '8px',
  textDecoration: 'none',
  letterSpacing: '0.01em',
}

const ctaSecondary: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
}

const ctaSecondaryLink: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  borderBottom: '1px dotted var(--text-secondary)',
  paddingBottom: '1px',
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
            2,000+ karma in 3 months. nearly 50/50 post-comment ratio. 1.5M+ views.
            <br />
            most active in r/GTMbuilders, r/gtmengineering, r/ClaudeCode + 15 others — here&apos;s exactly how I did it, what flopped, and how every conversation became a lead, a competitor signal, or an engagement opportunity.
          </p>
        </section>

        {/* Stats */}
        <div style={statGrid}>
          <div style={statCard}>
            <p style={statNumber}>{profile?.totalKarma?.toLocaleString() ?? '2,173'}</p>
            <p style={statLabel}>total karma</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>1.5M+</p>
            <p style={statLabel}>views</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>50/50</p>
            <p style={statLabel}>post/comment ratio</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>3</p>
            <p style={statLabel}>months</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>350+</p>
            <p style={statLabel}>contributions</p>
          </div>
          <div style={statCard}>
            <p style={statNumber}>308</p>
            <p style={statLabel}>top post ↑</p>
          </div>
        </div>

        <hr style={sectionDivider} />

        {/* All content lives in tabs: posts guide (types → rules → receipts) | comments guide */}
        <RedditTabs />

        <hr style={sectionDivider} />

        {/* Primary CTA — Clearbox bridge */}
        <div style={ctaBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/clearbox/aura-logo.png"
            alt="Clearbox Aura"
            style={{
              width: '80px',
              height: 'auto',
              margin: '0 auto 16px',
              display: 'block',
              borderRadius: '8px',
            }}
          />
          <p style={ctaTitle}>this playbook is the manual version of Clearbox</p>
          <p style={ctaDesc}>
            Clearbox is a signal-based intelligence engine. it reads the conversations your buyers are already having
            and labels every thread as a lead, a competitor mention, or an engagement opportunity.
            <br />
            Aura tells you which to act on first.
          </p>
          <a
            href="https://clearbox.to"
            target="_blank"
            rel="noopener noreferrer"
            style={ctaLink}
          >
            See your market. Move first. →
          </a>
        </div>

        {/* Secondary — r/GTMBuilders community link */}
        <div style={ctaSecondary}>
          <a
            href="https://reddit.com/r/GTMBuilders"
            target="_blank"
            rel="noopener noreferrer"
            style={ctaSecondaryLink}
          >
            or join r/GTMBuilders if you want to build alongside us →
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
