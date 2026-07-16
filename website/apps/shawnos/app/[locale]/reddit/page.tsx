import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { fetchUserProfile } from '@shawnos/shared/lib/reddit'
import redditStats from '@shawnos/shared/data/reddit-stats.json'
import { EvidenceCard } from './EvidenceCard'
import { Collapse } from './Collapse'
import {
  POST_ARCHETYPES,
  CRAFT_RULES,
  GATE_TABLE,
  GATING_STEPS,
  COMMENT_TYPES,
  EXTRA_RECEIPTS,
  LINK_ZONES,
  LINK_ZONE_EVIDENCE,
  SIGNAL_LABELS,
  ACCOUNT_RAMP,
  RAMP_DONTS,
  KARMA_ENGINE,
  KARMA_ENGINE_SUB,
  THE_ASK,
  THE_ASK_EVIDENCE,
  SHADOWBAN_CHECKS,
  SHADOWBAN_TRIGGERS,
  SHADOWBAN_RECOVERY,
  DELEGATION,
  fmtViews,
} from './reportData'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'

const SUBSCRIBE_URL = 'https://clearbox.beehiiv.com'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const karma = redditStats.totalKarma.toLocaleString()
  const title = `The Reddit Growth Report: 2M+ Views, ${karma} Karma, ${redditStats.wins} Wins`
  const ogSubtitle = `2M+ views. ${karma} karma. ${redditStats.wins} wins. the system.`
  const description = `The full report on building ${karma} karma and 2M+ views on Reddit, with ${(redditStats.trackedViews / 1_000_000).toFixed(2)}M views tracked live in the journey db. The ramp, karma gating, the link map, how to get readers to ask for the link, shadowban recovery, and LLMO: the discipline of getting your language into the places models read.`
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
      'LLMO',
      'AI answer engine citations',
    ],
    alternates: { canonical: `${SITE_URL}/reddit`, languages: hreflang('/reddit') },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/reddit`,
      images: [
        {
          url: `/og?title=${encodeURIComponent('The Reddit Growth Report')}&subtitle=${encodeURIComponent(ogSubtitle)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent('The Reddit Growth Report')}&subtitle=${encodeURIComponent(ogSubtitle)}`,
      ],
    },
  }
}

/* ── section registry (drives the sticky nav) ───────── */

const SECTIONS = [
  { id: 'journey', label: 'the journey' },
  { id: 'account-ramp', label: 'the ramp' },
  { id: 'karma-engine', label: 'karma' },
  { id: 'post-types', label: 'post types' },
  { id: 'comments', label: 'comments' },
  { id: 'karma-gating', label: 'karma gating' },
  { id: 'link-map', label: 'the link map' },
  { id: 'the-ask', label: 'the ask' },
  { id: 'staying-alive', label: 'staying alive' },
  { id: 'ai-citations', label: 'what AI cites' },
  { id: 'llmo', label: 'LLMO' },
  { id: 'delegation', label: 'delegation' },
  { id: 'newsletter', label: 'the weekly report' },
]

/**
 * section numbers derive from SECTIONS order so inserting a section never
 * leaves a stale hardcoded kicker behind.
 */
const sectionNo = (id: string) =>
  String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0')

/* ── styles ─────────────────────────────────────────── */

const ORANGE = '#FF4500'

const pageWrap: React.CSSProperties = {
  maxWidth: 880,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-editorial-body)',
}

const heroSection: React.CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '56px 0 40px',
}

const heroGlow: React.CSSProperties = {
  position: 'absolute',
  top: '-40px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '420px',
  height: '260px',
  borderRadius: '50%',
  background: 'radial-gradient(ellipse, rgba(109, 94, 233, 0.18), rgba(255, 69, 0, 0.06) 60%, transparent 75%)',
  filter: 'blur(60px)',
  pointerEvents: 'none',
}

const heroKicker: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  margin: '0 0 18px',
}

const heroTitle: React.CSSProperties = {
  position: 'relative',
  fontFamily: 'var(--font-display-walsh)',
  fontSize: 'clamp(44px, 8.5vw, 96px)',
  fontWeight: 500,
  color: 'var(--text-primary)',
  lineHeight: 0.94,
  margin: '0 0 22px',
  letterSpacing: '-0.05em',
}

const heroAccent: React.CSSProperties = {
  color: ORANGE,
  fontWeight: 500,
}

const heroThesis: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.55,
  color: 'var(--text-primary)',
  maxWidth: 620,
  margin: '0 auto 14px',
  letterSpacing: '-0.01em',
}

const heroSub: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px',
  fontWeight: 400,
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  maxWidth: 580,
  margin: '0 auto',
}

const bigStatBand: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '14px',
  margin: '36px 0 10px',
}

const bigStatCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid rgba(255, 69, 0, 0.18)',
  borderRadius: '12px',
  padding: '22px 16px',
  textAlign: 'center',
}

const bigStatNumber: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '34px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color: ORANGE,
  margin: '0 0 6px',
  letterSpacing: '-0.02em',
}

const bigStatLabel: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const statFootnote: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  textAlign: 'center',
  margin: '0 0 8px',
}

const sectionStyle: React.CSSProperties = {
  padding: '48px 0 8px',
}

const sectionKicker: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '11px',
  fontWeight: 600,
  color: ORANGE,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  margin: '0 0 10px',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '30px',
  fontWeight: 400,
  color: 'var(--text-primary)',
  margin: '0 0 14px',
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
}

const sectionIntro: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  marginBottom: '22px',
}

const subHeading: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '21px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '32px 0 12px',
  letterSpacing: '-0.01em',
}

const receiptCallout: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '14px',
  color: ORANGE,
  lineHeight: 1.6,
  margin: '20px 0',
  padding: '12px 16px',
  background: 'rgba(255, 69, 0, 0.06)',
  borderLeft: `2px solid ${ORANGE}`,
  borderRadius: '4px',
  fontStyle: 'italic',
}

/* era timeline */
const eraRow: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  padding: '20px 22px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  marginBottom: '12px',
  alignItems: 'flex-start',
}

const eraMarker: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '13px',
  fontWeight: 600,
  color: ORANGE,
  minWidth: '64px',
  paddingTop: '3px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontVariantNumeric: 'tabular-nums',
}

const eraTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '18px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '0 0 4px',
  letterSpacing: '-0.01em',
}

const eraStats: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '13px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color: ORANGE,
  margin: '0 0 6px',
}

const eraDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: 0,
}

/* archetype + rule cards */
const archetypeCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '16px 20px',
  marginBottom: '10px',
}

const archetypeTop: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  flexWrap: 'wrap',
}

const archetypeName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '18px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  flex: 1,
  letterSpacing: '-0.01em',
}

const archetypeStats: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px',
  color: ORANGE,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}

const archetypeDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: '8px 0 0',
}

const archetypeValueLead: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '13px',
  color: ORANGE,
  lineHeight: 1.55,
  margin: '6px 0 12px',
  fontStyle: 'italic',
  fontWeight: 400,
  opacity: 0.9,
}

const ruleCard: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  padding: '16px 20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  marginBottom: '10px',
}

const ruleNumber: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '24px',
  fontWeight: 300,
  color: ORANGE,
  minWidth: '32px',
  lineHeight: 1,
  paddingTop: '2px',
  fontVariantNumeric: 'tabular-nums',
}

const ruleTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '16px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '0 0 4px',
  letterSpacing: '-0.01em',
}

const ruleDetail: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: 0,
}

/* comment type cards */
const commentCard: React.CSSProperties = {
  marginBottom: '32px',
  paddingBottom: '26px',
  borderBottom: '1px solid var(--border)',
}

const commentName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '20px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '0 0 8px',
  letterSpacing: '-0.01em',
}

const commentDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: '0 0 6px',
}

const commentHighlight: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '14px',
  color: ORANGE,
  fontWeight: 400,
  margin: '0 0 14px',
  fontStyle: 'italic',
}

/* link map zone cards */
const zoneCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '20px 22px',
  marginBottom: '12px',
}

const zoneName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '19px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '0 0 8px',
  letterSpacing: '-0.01em',
}

const zoneVerdict: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '11px',
  fontWeight: 600,
  color: ORANGE,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginLeft: '10px',
}

const zoneDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  margin: 0,
}

/* CTA blocks */
const bridgeBlock: React.CSSProperties = {
  marginTop: '28px',
  padding: '32px 36px',
  background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.08), rgba(109, 94, 233, 0.05))',
  border: '1px solid rgba(255, 69, 0, 0.2)',
  borderRadius: '16px',
  textAlign: 'center',
}

const bridgeText: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  margin: '0 0 20px',
}

const bridgeLink: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: ORANGE,
  padding: '11px 26px',
  borderRadius: '8px',
  textDecoration: 'none',
  letterSpacing: '0.01em',
}

const newsletterBlock: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(109, 94, 233, 0.1), rgba(255, 69, 0, 0.04))',
  border: '1px solid rgba(109, 94, 233, 0.25)',
  borderRadius: '16px',
  padding: '36px 32px',
  textAlign: 'center',
  marginTop: '8px',
}

const newsletterTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '26px',
  fontWeight: 400,
  color: 'var(--text-primary)',
  margin: '0 0 12px',
  letterSpacing: '-0.01em',
  lineHeight: 1.25,
}

const newsletterDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  maxWidth: 480,
  margin: '0 auto 22px',
}

const sectionDivider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0 0',
}

const vaultLinkStyle: React.CSSProperties = {
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

  const karmaEra = redditStats.eras.find((e) => e.era === 'karma-building') ?? { items: 0, views: 0, score: 0 }
  const clearboxEra = redditStats.eras.find((e) => e.era === 'clearbox') ?? { items: 0, views: 0, score: 0 }
  const karmaSub = redditStats.topSubreddits.find((s) => s.subreddit === KARMA_ENGINE_SUB)
  const liveKarma = Math.max(profile?.totalKarma ?? 0, redditStats.totalKarma)

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'The Reddit Growth Report', url: `${SITE_URL}/reddit` }]}
      />

      {/* page-local styles: sticky section nav, anchor offsets, table scroll */}
      <style>{`
        .rr-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--canvas);
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .rr-nav::-webkit-scrollbar { display: none; }
        .rr-nav-inner {
          display: flex;
          gap: 4px;
          max-width: 880px;
          margin: 0 auto;
          padding: 0 20px;
          white-space: nowrap;
        }
        .rr-nav a {
          display: inline-block;
          padding: 12px 12px;
          font-family: var(--font-editorial-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .rr-nav a:hover {
          color: #FF4500;
          border-bottom-color: #FF4500;
        }
        .rr-section {
          scroll-margin-top: 56px;
        }
        .rr-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 22px;
        }
        .rr-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-editorial-body);
          font-size: 14px;
          min-width: 560px;
        }
        .rr-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #FF4500;
          background: rgba(255, 69, 0, 0.06);
          border-bottom: 1px solid var(--border);
        }
        .rr-table td {
          padding: 12px 16px;
          color: var(--text-secondary);
          line-height: 1.55;
          border-bottom: 1px solid var(--border);
          vertical-align: top;
        }
        .rr-table tr:last-child td { border-bottom: none; }
        .rr-table td:first-child {
          color: var(--text-primary);
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>

      <div style={pageWrap}>
        {/* ── 01 · report hero ── */}
        <section style={heroSection}>
          <div style={heroGlow} aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/reddit-evidence/reddit-logo-dark.png"
            alt="Reddit"
            style={{
              width: '150px',
              height: 'auto',
              margin: '0 auto 22px',
              display: 'block',
              opacity: 0.9,
              borderRadius: '12px',
              position: 'relative',
            }}
          />
          <p style={heroKicker}>report · updated {redditStats.asOf} · u/Shawntenam</p>
          <h1 style={heroTitle}>
            The <span style={heroAccent}>Reddit</span> Growth Report
          </h1>
          <p style={heroThesis}>
            Reddit is where AI models learn what to recommend. this report is the system that got my work cited: the karma gates, the link map, and the language layer on top.
          </p>
          <p style={heroSub}>
            15 months. {redditStats.totalPosts} posts and {redditStats.totalComments} comments across r/ClaudeCode, r/gtmengineering, r/GTMbuilders and 15 other subs. every number below is real and live-tracked.
          </p>
        </section>

        {/* the headline numbers */}
        <div style={bigStatBand}>
          <div style={bigStatCard}>
            <p style={bigStatNumber}>2M+</p>
            <p style={bigStatLabel}>cumulative views</p>
          </div>
          <div style={bigStatCard}>
            <p style={bigStatNumber}>{liveKarma.toLocaleString()}</p>
            <p style={bigStatLabel}>total karma</p>
          </div>
          <div style={bigStatCard}>
            <p style={bigStatNumber}>{redditStats.wins}</p>
            <p style={bigStatLabel}>tracked wins</p>
          </div>
          <div style={bigStatCard}>
            <p style={bigStatNumber}>15</p>
            <p style={bigStatLabel}>months</p>
          </div>
        </div>
        <p style={statFootnote}>
          {(redditStats.trackedViews / 1_000_000).toFixed(2)}M of the 2M+ views are tracked post-by-post in the journey db · karma split: {redditStats.linkKarma.toLocaleString()} link / {redditStats.commentKarma} comment · top post: {redditStats.topPost.score}↑ in r/{redditStats.topPost.subreddit}
        </p>

        {/* ── sticky section nav ── */}
        <nav className="rr-nav" aria-label="report sections">
          <div className="rr-nav-inner">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── 02 · era timeline ── */}
        <section id="journey" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('journey')}</p>
          <h2 style={sectionTitle}>the journey: zero to cited-by-AI</h2>
          <p style={sectionIntro}>
            the account ran in two deliberate eras. the first built trust, the second cashed it in. the order matters: every shortcut I tested that skipped era one died in the automod queue.
          </p>

          <div style={eraRow}>
            <span style={eraMarker}>era 01</span>
            <div style={{ flex: 1 }}>
              <p style={eraTitle}>karma building</p>
              <p style={eraStats}>
                {karmaEra.items} posts + comments · {fmtViews(karmaEra.views)} views · {karmaEra.score.toLocaleString()} score
              </p>
              <p style={eraDesc}>
                comments first, showcases later. built the 50/50 karma split, learned each sub&apos;s gate, and became a known name in the home subs before asking anything of them.
              </p>
            </div>
          </div>

          <div style={eraRow}>
            <span style={eraMarker}>era 02</span>
            <div style={{ flex: 1 }}>
              <p style={eraTitle}>clearbox</p>
              <p style={eraStats}>
                {clearboxEra.items} posts + comments · {fmtViews(clearboxEra.views)} views · {clearboxEra.score.toLocaleString()} score
              </p>
              <p style={eraDesc}>
                trust converted into pipeline. named the product in context, tracked every thread, and turned {redditStats.wins} conversations into tracked wins: signups, calls, and customers.
              </p>
            </div>
          </div>

          <div style={eraRow}>
            <span style={eraMarker}>now</span>
            <div style={{ flex: 1 }}>
              <p style={eraTitle}>cited by AI</p>
              <p style={eraStats}>unlinked brand mentions surfacing in AI answers</p>
              <p style={eraDesc}>
                the threads from both eras are now training material. AI answer engines cite them, and the product name travels without a URL attached. sections {sectionNo('ai-citations')} and {sectionNo('llmo')} break down the mechanism.
              </p>
            </div>
          </div>

          <h3 style={subHeading}>where the views live</h3>
          <div className="rr-table-wrap">
            <table className="rr-table">
              <thead>
                <tr>
                  <th>subreddit</th>
                  <th>items</th>
                  <th>views</th>
                  <th>score</th>
                </tr>
              </thead>
              <tbody>
                {redditStats.topSubreddits.slice(0, 6).map((s) => (
                  <tr key={s.subreddit}>
                    <td>r/{s.subreddit}</td>
                    <td>{s.items}</td>
                    <td>{fmtViews(s.views)}</td>
                    <td>{s.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr style={sectionDivider} />
        </section>

        {/* ── the ramp ── */}
        <section id="account-ramp" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('account-ramp')}</p>
          <h2 style={sectionTitle}>the ramp: starting an account that survives</h2>
          <p style={sectionIntro}>
            a new account that opens with a comment about its own product is the exact shape every filter on the platform was built to catch. Reddit reads behavior before it reads words. the ramp below is the slow part, and it decides whether anything after it works.
          </p>

          {ACCOUNT_RAMP.map((r) => (
            <div key={r.stage} style={archetypeCard}>
              <div style={archetypeTop}>
                <span style={archetypeName}>
                  {r.emoji} {r.stage}
                </span>
                <span style={archetypeStats}>{r.window}</span>
              </div>
              <p style={archetypeDesc}>{r.desc}</p>
            </div>
          ))}

          <p style={receiptCallout}>
            era one on this account: {karmaEra.items} posts and comments, {fmtViews(karmaEra.views)} views, zero product mentions.
          </p>

          <h3 style={subHeading}>the three ways people skip it</h3>
          {RAMP_DONTS.map((d) => (
            <div key={d.rule} style={ruleCard}>
              <span style={ruleNumber}>{d.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{d.rule}</p>
                <p style={ruleDetail}>{d.detail}</p>
              </div>
            </div>
          ))}
          <hr style={sectionDivider} />
        </section>

        {/* ── karma engine ── */}
        <section id="karma-engine" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('karma-engine')}</p>
          <h2 style={sectionTitle}>karma: farm your own interests</h2>
          <p style={sectionIntro}>
            karma is the toll every gated sub charges before it lets you speak. the cheapest place to earn it is the subs you would be reading anyway, because the comments cost you nothing and read as real without you trying. the sections after this one are useless until the account clears the floors in section {sectionNo('karma-gating')}.
          </p>

          {KARMA_ENGINE.map((k) => (
            <div key={k.move} style={commentCard}>
              <h3 style={commentName}>
                {k.emoji} {k.move}
              </h3>
              <p style={commentDesc}>{k.desc}</p>
            </div>
          ))}

          {karmaSub && (
            <p style={receiptCallout}>
              the receipt: r/{karmaSub.subreddit} on this account. {karmaSub.items} posts and comments, {fmtViews(karmaSub.views)} views, {karmaSub.score} score, and nothing to sell. it outranks every product sub here by views. the interest was real first and the karma was the byproduct.
            </p>
          )}
          <hr style={sectionDivider} />
        </section>

        {/* ── 03 · post types ── */}
        <section id="post-types" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('post-types')}</p>
          <h2 style={sectionTitle}>the 8 post types that work</h2>
          <p style={sectionIntro}>
            tested across 15 months. each type below carries its flagship receipt: the real post, the real numbers, and the value-lead note for SaaS, B2B marketing, Clay, and GTM-engineering readers.
          </p>

          {POST_ARCHETYPES.map((a) => (
            <div key={a.name} style={archetypeCard}>
              <div style={archetypeTop}>
                <span style={archetypeName}>
                  {a.emoji} {a.name}
                </span>
                <span style={archetypeStats}>{a.stats}</span>
              </div>
              <p style={archetypeDesc}>{a.desc}</p>
              <p style={archetypeValueLead}>↳ {a.valueLead}</p>
              <Collapse label="the receipt" sublabel={`${a.evidence.sub} · ${a.evidence.views} views`}>
                <EvidenceCard {...a.evidence} />
              </Collapse>
            </div>
          ))}

          <h3 style={subHeading}>the 6 craft rules</h3>
          <p style={sectionIntro}>
            every rule came from watching what worked and what got me destroyed. the entry system that earns you the right to post at all lives in the karma gating section.
          </p>

          {CRAFT_RULES.map((r, i) => (
            <div key={i} style={ruleCard}>
              <span style={ruleNumber}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{r.rule}</p>
                <p style={ruleDetail}>{r.detail}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '24px' }}>
            <Collapse label="more receipts" sublabel={`${EXTRA_RECEIPTS.length} additional posts with screenshots`}>
              <p style={sectionIntro}>
                every post below is real. screenshots straight from the Reddit dashboard, wins and flops included.
              </p>
              {EXTRA_RECEIPTS.map((e, i) => (
                <EvidenceCard key={i} {...e} />
              ))}
            </Collapse>
          </div>
          <hr style={sectionDivider} />
        </section>

        {/* ── 04 · comments ── */}
        <section id="comments" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('comments')}</p>
          <h2 style={sectionTitle}>comments: where karma actually lives</h2>
          <p style={sectionIntro}>
            my highest-performing piece of content on Reddit is a comment. 239 upvotes, 27K views, one sentence about ADHD and Claude Code. here are the 7 comment types I run and the flagship example for each.
          </p>

          {COMMENT_TYPES.map((ct) => (
            <div key={ct.name} style={commentCard}>
              <h3 style={commentName}>
                {ct.emoji} {ct.name}
              </h3>
              <p style={commentDesc}>{ct.desc}</p>
              <p style={commentHighlight}>{ct.highlight}</p>
              <EvidenceCard
                title={ct.example.context}
                sub=""
                tag="Comment"
                tagColor={ORANGE}
                upvotes={ct.example.upvotes}
                comments={0}
                views={ct.example.views}
                image={ct.example.image}
                body={ct.example.text}
                lesson=""
              />
            </div>
          ))}
        </section>

        {/* ── 05 · karma gating ── */}
        <section id="karma-gating" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('karma-gating')}</p>
          <h2 style={sectionTitle}>karma gating: the thresholds</h2>
          <p style={sectionIntro}>
            every sub you want to post in has a gate. some gates are posted in the rules: minimum karma, minimum account age. some are invisible: automod quietly removes your post and the views flatline at zero. know the gate before you post, or your best work dies in the queue.
          </p>

          <div className="rr-table-wrap">
            <table className="rr-table">
              <thead>
                <tr>
                  <th>the gate</th>
                  <th>where it lives</th>
                  <th>how you clear it</th>
                </tr>
              </thead>
              <tbody>
                {GATE_TABLE.map((g) => (
                  <tr key={g.gate}>
                    <td>{g.gate}</td>
                    <td>{g.where}</td>
                    <td>{g.clear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={subHeading}>the entry system</h3>
          {GATING_STEPS.map((r, i) => (
            <div key={i} style={ruleCard}>
              <span style={ruleNumber}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{r.rule}</p>
                <p style={ruleDetail}>{r.detail}</p>
              </div>
            </div>
          ))}

          <p style={receiptCallout}>
            the receipt: my karma-building era ran {karmaEra.items} posts and comments for {fmtViews(karmaEra.views)} views before the clearbox era started ({clearboxEra.items} items, {fmtViews(clearboxEra.views)} views). the gate-building phase came first. it always does.
          </p>

          <p style={{ textAlign: 'center', margin: '24px 0 0' }}>
            <a href="/vault" style={vaultLinkStyle}>
              the actual files: /vault → reddit/ →
            </a>
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── 06 · the link map ── */}
        <section id="link-map" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('link-map')}</p>
          <h2 style={sectionTitle}>the link map: three zones, three rules</h2>
          <p style={sectionIntro}>
            where a link lives decides whether a human ever votes on your post. get the zone wrong and the automod buries you first.
          </p>

          {LINK_ZONES.map((z) => (
            <div key={z.zone} style={zoneCard}>
              <p style={zoneName}>
                {z.emoji} {z.zone}
                <span style={zoneVerdict}>{z.verdict}</span>
              </p>
              <p style={zoneDesc}>{z.desc}</p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: a link that landed" sublabel="r/NYCapartments · 2.8K views">
              <EvidenceCard {...LINK_ZONE_EVIDENCE} />
            </Collapse>
          </div>

          <p style={receiptCallout}>
            the stronger move: skip the URL entirely. somebody asks, you describe what the thing does. &quot;I built a scanner that reads every complaint thread and labels each one lead, competitor, or engager.&quot; the reader who wants it will find it. the description is the link. section {sectionNo('the-ask')} is how you get asked on purpose.
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── the ask ── */}
        <section id="the-ask" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('the-ask')}</p>
          <h2 style={sectionTitle}>the ask: get them to request the link</h2>
          <p style={sectionIntro}>
            a link you drop is an ad. the same link, handed over because someone asked for it, is an answer. the sub scores those differently and so does everyone reading. the ask is the part you can engineer.
          </p>

          {THE_ASK.map((a) => (
            <div key={a.move} style={zoneCard}>
              <p style={zoneName}>
                {a.emoji} {a.move}
              </p>
              <p style={zoneDesc}>{a.desc}</p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: a post with no links, and the reply asking for them" sublabel={`${THE_ASK_EVIDENCE.sub} · ${THE_ASK_EVIDENCE.views} views`}>
              <EvidenceCard {...THE_ASK_EVIDENCE} />
            </Collapse>
          </div>

          <p style={receiptCallout}>
            the ask is the permission slip. it converts a URL from something you pushed into something the thread requested, and it is the only version of a link that a sub will let you post twice.
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── staying alive ── */}
        <section id="staying-alive" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('staying-alive')}</p>
          <h2 style={sectionTitle}>staying alive: shadowbans and silent removals</h2>
          <p style={sectionIntro}>
            Reddit rarely tells you that you are gone. the post sits there in your own browser looking fine while the views never move, and you keep talking to a room that stopped receiving you weeks ago. check first, then fix the account rather than the post.
          </p>

          <h3 style={subHeading}>three checks that take a minute</h3>
          {SHADOWBAN_CHECKS.map((c) => (
            <div key={c.check} style={zoneCard}>
              <p style={zoneName}>
                {c.emoji} {c.check}
              </p>
              <p style={zoneDesc}>{c.how}</p>
            </div>
          ))}

          <h3 style={subHeading}>what actually trips it</h3>
          {SHADOWBAN_TRIGGERS.map((t) => (
            <div key={t.trigger} style={ruleCard}>
              <span style={ruleNumber}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{t.trigger}</p>
                <p style={ruleDetail}>{t.detail}</p>
              </div>
            </div>
          ))}

          <h3 style={subHeading}>getting back</h3>
          {SHADOWBAN_RECOVERY.map((r) => (
            <div key={r.step} style={ruleCard}>
              <span style={ruleNumber}>{r.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{r.step}</p>
                <p style={ruleDetail}>{r.detail}</p>
              </div>
            </div>
          ))}

          <p style={receiptCallout}>
            this account has never been banned. not because it got away with anything, but because it never ran the plays that get you banned.
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── 07 · what AI cites ── */}
        <section id="ai-citations" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('ai-citations')}</p>
          <h2 style={sectionTitle}>what AI cites: no-link mentions still index</h2>
          <p style={sectionIntro}>
            mention a product by name, in context, answering a real question, and it gets indexed with zero URLs involved. Google indexes Reddit within hours. LLMs cite Reddit threads. an unlinked brand mention inside a high-signal answer becomes retrievable, and the model repeats it to the next person who asks.
          </p>

          <p style={receiptCallout}>
            the receipt: {redditStats.wins} tracked wins came through this pipeline. {fmtViews(redditStats.trackedViews)} live-tracked views is the surface those wins came from.
          </p>

          <h3 style={subHeading}>every conversation is worth more than the close</h3>
          <p style={sectionIntro}>
            buy-intent threads are under 1% of the value. the other 99% is qualification surface area. every thread your buyers post sorts into one of three labels, and each label tells you the next move:
          </p>

          {SIGNAL_LABELS.map((s) => (
            <div key={s.name} style={zoneCard}>
              <p style={zoneName}>
                {s.emoji} {s.name}
              </p>
              <p style={zoneDesc}>{s.desc}</p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: mentions that converted" sublabel="2 threads · 5 tracked wins">
              <EvidenceCard
                title="Intent signals are qualification scores, not buying intent."
                sub="r/GTMbuilders"
                tag="Lead Signal"
                tagColor="#fbbf24"
                upvotes={7}
                comments={14}
                views="~2K"
                image="/images/reddit-evidence/intent-signals-qualification-7.png"
                body="the Clearbox thesis stated in plain English. someone scrolling a problem thread is showing you which problem to solve first."
                lesson="low post-score, high conversion. 3 of the 14 commenters turned into Clearbox early-access signups."
              />
              <EvidenceCard
                title="Supabase + Google Sheets + Claude Code replaced Clay for me. here is how."
                sub="r/gtmengineering"
                tag="Competitor Signal"
                tagColor="#f87171"
                upvotes={65}
                comments={42}
                views="~30K"
                image="/images/reddit-evidence/supabase-replaced-clay-65.png"
                body="workflow-by-workflow swap after Clay re-priced. each task: what Clay did, what replaced it, what it now costs."
                lesson="competitor-mention magnet. the swap diagram attracts competitor-shopping readers on its own."
              />
            </Collapse>
          </div>

          <div style={bridgeBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clearbox/aura-logo.png"
              alt="Clearbox Aura"
              style={{
                width: '72px',
                height: 'auto',
                margin: '0 auto 16px',
                display: 'block',
                borderRadius: '8px',
              }}
            />
            <p style={bridgeText}>
              this report is the manual version of the same three-label system Clearbox runs at scale. every Reddit thread, X reply, and LinkedIn comment your buyers post: labeled, scored by Aura, ranked by what to act on first.
            </p>
            <a href="https://clearbox.to" target="_blank" rel="noopener noreferrer" style={bridgeLink}>
              See your market. Move first. →
            </a>
          </div>
          <hr style={sectionDivider} />
        </section>

        {/* ── 08 · LLMO ── */}
        <section id="llmo" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('llmo')}</p>
          <h2 style={sectionTitle}>LLMO: language-level model optimization</h2>
          <p style={sectionIntro}>
            the discipline on top of SEO and GEO. you&apos;re injecting your language, your phrasing, your voice into the places models read, so the model&apos;s answer sounds like you and points back to you.
          </p>
          <p style={sectionIntro}>
            the mechanism is voice consistency. the same voice across Reddit, blog, and site teaches the model one coherent entity, and one coherent entity is what gets cited. this is why the same voice DNA files run everything I publish, from a one-liner comment to a 2,000-word post.
          </p>

          <p style={{ textAlign: 'center', margin: '24px 0 0' }}>
            <a href="/vault" style={vaultLinkStyle}>
              the actual files: /vault → reddit/ →
            </a>
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── delegation ── */}
        <section id="delegation" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('delegation')}</p>
          <h2 style={sectionTitle}>delegation: handing the account to someone else</h2>
          <p style={sectionIntro}>
            everything above assumes a person is reading the thread and a person is writing the reply. that person does not have to be you. a VA is a human, which is the entire requirement. it fails when the VA is handed an account and a goal and nothing else, because you cannot run this blind.
          </p>

          {DELEGATION.map((d) => (
            <div key={d.name} style={commentCard}>
              <h3 style={commentName}>
                {d.emoji} {d.name}
              </h3>
              <p style={commentDesc}>{d.desc}</p>
            </div>
          ))}

          <p style={receiptCallout}>
            the 24-hour pull is what makes this safe. your VA opens a scored list of the threads worth answering, with the rules for each sub attached, instead of a blank search bar and an instruction to go be helpful. the account stays human. the work stops depending on you being awake.
          </p>
          <hr style={sectionDivider} />
        </section>

        {/* ── 09 · closer: the weekly report ── */}
        <section id="newsletter" className="rr-section" style={sectionStyle}>
          <p style={sectionKicker}>section {sectionNo('newsletter')}</p>
          <div style={newsletterBlock}>
            <p style={newsletterTitle}>the weekly version of this report</p>
            <p style={newsletterDesc}>
              I mine Reddit for GTM signal every week and send the report on Thursdays. the threads that matter, the competitor moves, and what the AI answer engines picked up.
            </p>
            <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" style={bridgeLink}>
              get the Thursday report →
            </a>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px' }}>
            <a href="https://reddit.com/r/GTMBuilders" target="_blank" rel="noopener noreferrer" style={vaultLinkStyle}>
              or join r/GTMBuilders if you want to build alongside us →
            </a>
          </p>
        </section>

        {/* related */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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
