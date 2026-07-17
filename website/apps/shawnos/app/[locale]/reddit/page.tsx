import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { fetchUserProfile } from '@shawnos/shared/lib/reddit'
import redditStats from '@shawnos/shared/data/reddit-stats.json'
import { EvidenceCard } from './EvidenceCard'
import { Collapse } from './Collapse'
import {
  ChromeProvider,
  ProgressBar,
  NavStrip,
  NavRail,
  RightRail,
} from './ReportChrome'
import { buildRails } from './ReportRails'
import { ReportIcon } from './ReportIcon'
import { Shell, Column, Bleed, Step, Note } from './PlaybookShell'
import { CompoundChart } from './CompoundChart'
import { RampChart } from './RampChart'
import { CalibrationChart, ConversationChart } from './RankedBars'
import './report.css'
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
  statLine,
  stat,
  type Evidence,
} from './reportData'

/** Collapse sublabel, from the db. Comments carry no view count, so they get a score. */
const collapseSub = (e: Evidence) => {
  const s = stat(e.redditId)
  if (!s) return e.sub
  return s.views != null
    ? `${e.sub} · ${fmtViews(s.views)} views`
    : `${e.sub} · ${s.score} upvotes`
}

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'

const SUBSCRIBE_URL = 'https://clearbox.beehiiv.com'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const karma = redditStats.totalKarma.toLocaleString()
  // Every figure here is generated. The headline is trackedViews (posts only —
  // reddit reports no view counts on comments), never a rounded-up estimate:
  // a number with a query behind it survives being challenged.
  const views = `${(redditStats.trackedViews / 1_000_000).toFixed(1)}M`
  const title = `The Reddit Growth Report: ${views} Tracked Views, ${karma} Karma, in ${redditStats.accountMonths} Months`
  const ogSubtitle = `${views} tracked views. ${karma} karma. ${redditStats.accountMonths} months. the system.`
  const description = `The full report on building ${karma} karma and ${views} tracked views on Reddit from a standing start in ${redditStats.accountMonths} months, every number read live from the journey db. The ramp, karma gating, the link map, how to get readers to ask for the link, shadowban recovery, and LLMO: the discipline of getting your language into the places models read.`
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

/**
 * Reddit orange, but only where it passes. #FF4500 is 3.15:1 on the light
 * canvas and 2.74:1 on light cards — both fail WCAG AA for text. --rr-accent
 * darkens it in light mode and keeps the real orange in dark. Large display
 * numbers can still use ORANGE directly; body-sized text must not.
 */
const ORANGE = '#FF4500'
const ACCENT = 'var(--rr-accent)'

const heroGlow: React.CSSProperties = {
  position: 'absolute',
  top: '-40px',
  left: '50%',
  transform: 'translateX(-50%)',
  // decorative, but a flat 420px is wider than a phone and it dragged the
  // document sideways with it
  width: 'min(420px, 100%)',
  height: '260px',
  borderRadius: '50%',
  background: 'radial-gradient(ellipse, rgba(109, 94, 233, 0.18), rgba(255, 69, 0, 0.06) 60%, transparent 75%)',
  filter: 'blur(60px)',
  pointerEvents: 'none',
}



const heroAccent: React.CSSProperties = {
  color: ORANGE,
  fontWeight: 500,
}














/* era timeline */





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
  color: ACCENT,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}






/* comment type cards */




/* link map zone cards */




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
  fontSize: '17px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  maxWidth: '68ch',
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


      <Shell>
        <ChromeProvider sections={SECTIONS}>
        <ProgressBar />

        {/* ── 01 · report hero ── */}
        <section className="rr-hero">
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
          <p className="rr-hero-kicker">report · updated {redditStats.asOf} · u/Shawntenam</p>
          <h1 className="rr-hero-title">
            The <span style={heroAccent}>Reddit</span> Growth Report
          </h1>
          <p className="rr-hero-thesis">
            Reddit is where AI models learn what to recommend. this report is the system that got my work cited: the karma gates, the link map, and the language layer on top.
          </p>
          <p className="rr-hero-sub">
            {redditStats.accountMonths} months, from a standing start on {redditStats.firstItemDate}. {redditStats.totalPosts} posts and {redditStats.totalComments} comments across {redditStats.subredditsTouched} subreddits. every number below is read from the journey db at build time, not typed in.
          </p>
        </section>

        {/* the headline numbers — all four generated from the journey db */}
        <Bleed><div className="rr-stats">
          <div className="rr-stat">
            <p className="rr-stat-n">{(redditStats.trackedViews / 1_000_000).toFixed(1)}M</p>
            <p className="rr-stat-l">tracked views</p>
          </div>
          <div className="rr-stat">
            <p className="rr-stat-n">{liveKarma.toLocaleString()}</p>
            <p className="rr-stat-l">total karma</p>
          </div>
          <div className="rr-stat">
            <p className="rr-stat-n">{redditStats.wins}</p>
            <p className="rr-stat-l">flagged threads</p>
          </div>
          <div className="rr-stat">
            <p className="rr-stat-n">{redditStats.accountMonths}</p>
            <p className="rr-stat-l">months</p>
          </div>
        </div></Bleed>
        <p className="rr-caption">
          views are counted post-by-post in the journey db, {redditStats.totalPosts} posts deep · reddit reports no view count on comments, so the {redditStats.totalComments} comments here are not in that number · karma split: {redditStats.linkKarma.toLocaleString()} link / {redditStats.commentKarma} comment · top post: {redditStats.topPost.score}↑ in r/{redditStats.topPost.subreddit}
        </p>

        {/* ── sticky section nav: the strip below 1100px, the left rail above ── */}
        <NavStrip />

        {/* ── the three-column body: nav · reading column · exhibit ── */}
        <div className="rr-body">
          <aside className="rr-rail-l" aria-label="report sections">
            <NavRail />
          </aside>

          <div className="rr-main">

        {/* ── 02 · era timeline ── */}
        <section id="journey" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('journey')}</p>
          <h2 className="rr-h2">the journey: zero to cited-by-AI</h2>
          <p className="rr-standfirst">
            the account ran in two deliberate eras. the first built trust, the second cashed it in. the order matters: every shortcut I tested that skipped era one died in the automod queue.
          </p>

          <Step n="era 01" title="karma building" aside={<>{karmaEra.items} posts + comments · {fmtViews(karmaEra.views)} views · {karmaEra.score.toLocaleString()} score</>}>comments first, showcases later. earned karma on both sides of the ledger, learned each sub&apos;s gate, and became a known name in the home subs before asking anything of them.</Step>

          <Step n="era 02" title="clearbox" aside={<>{clearboxEra.items} posts + comments · {fmtViews(clearboxEra.views)} views · {clearboxEra.score.toLocaleString()} score</>}>trust converted into pipeline. named the product in context, tracked every thread, and flagged {redditStats.wins} of them as worth acting on: the questions, the competitor gripes, the people describing the problem I built for.</Step>

          <Step n="now" title="cited by AI" aside={<>the name travelling without a link on it</>}>the threads from both eras are now training material. AI answer engines cite them, and the product name travels without a URL attached. sections {sectionNo('ai-citations')} and {sectionNo('llmo')} break down the mechanism.</Step>

          <h3 className="rr-h3">where the views live</h3>
          </Column>

          <Bleed><div className="rr-table-wrap">
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
          </div></Bleed>

          <Column>
            <h3 className="rr-h3">the part nobody shows you</h3>
            <p className="rr-p">
              a post on a feed is dead in two days. these are not. every post in the chart below was already old when I started snapshotting, and {redditStats.compound.cohortGrew} of {redditStats.compound.cohortPosts} of them still gained views over the next {redditStats.compound.windowDays} days. the oldest one still climbing was published {redditStats.compound.oldestStillGrowing}.
            </p>
          </Column>
          <Bleed>
            <CompoundChart
              series={redditStats.compound.series}
              windowStart={redditStats.compound.windowStart}
              windowDays={redditStats.compound.windowDays}
              asOf={redditStats.asOf}
              cohortPosts={redditStats.compound.cohortPosts}
              cohortGrew={redditStats.compound.cohortGrew}
            />
          </Bleed>
        </section>

        {/* ── the ramp ── */}
        <section id="account-ramp" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('account-ramp')}</p>
          <h2 className="rr-h2">the ramp: starting an account that survives</h2>
          <p className="rr-standfirst">
            a new account that opens with a comment about its own product is the exact shape every filter on the platform was built to catch. Reddit reads behavior before it reads words. the ramp below is the slow part, and it decides whether anything after it works.
          </p>

          {ACCOUNT_RAMP.map((r) => (
            <div key={r.stage} style={archetypeCard}>
              <div style={archetypeTop}>
                <span style={archetypeName}>
                  <ReportIcon name={r.icon} className="rr-inline-icon" /> {r.stage}
                </span>
                <span style={archetypeStats}>{r.window}</span>
              </div>
              <p className="rr-p">{r.desc}</p>
            </div>
          ))}

          <p className="rr-note">
            era one on this account: {karmaEra.items} posts and comments, {fmtViews(karmaEra.views)} views, before Clearbox existed to mention.
          </p>
          </Column>

          {/* the ramp, as a shape rather than a claim: this chart proves the
              section it sits in */}
          <Bleed>
            <RampChart
              series={redditStats.ramp.series}
              eras={redditStats.ramp.eras}
              clearboxFrom={redditStats.ramp.clearboxFrom}
              asOf={redditStats.asOf}
            />
          </Bleed>

          <Column>
          <h3 className="rr-h3">the three ways people skip it</h3>
          {RAMP_DONTS.map((d) => (
            <Step key={d.rule} n={<ReportIcon name={d.icon} />} title={d.rule}>{d.detail}</Step>
          ))}
          </Column>
        </section>

        {/* ── karma engine ── */}
        <section id="karma-engine" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('karma-engine')}</p>
          <h2 className="rr-h2">karma: farm your own interests</h2>
          <p className="rr-standfirst">
            karma is the toll every gated sub charges before it lets you speak. the cheapest place to earn it is the subs you would be reading anyway, because the comments cost you nothing and read as real without you trying. the sections after this one are useless until the account clears the floors in section {sectionNo('karma-gating')}.
          </p>

          {KARMA_ENGINE.map((k) => (
            <Step key={k.move} n={<ReportIcon name={k.icon} />} title={k.move}>{k.desc}</Step>
          ))}

          {karmaSub && (
            <p className="rr-note">
              the receipt: r/{karmaSub.subreddit} on this account. {karmaSub.items} posts and comments, {fmtViews(karmaSub.views)} views, {karmaSub.score} score, and nothing to sell. more views than r/hubspot, r/UseApolloIo and r/buildinpublic combined. the interest was real first and the karma was the byproduct.
            </p>
          )}
          </Column>
        </section>

        {/* ── 03 · post types ── */}
        <section id="post-types" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('post-types')}</p>
          <h2 className="rr-h2">the 8 post types that work</h2>
          <p className="rr-standfirst">
            tested across {redditStats.accountMonths} months. each type below carries its flagship receipt: the real post, its live numbers, and the value-lead note for SaaS, B2B marketing, Clay, and GTM-engineering readers.
          </p>

          {POST_ARCHETYPES.map((a) => (
            <div key={a.name} className="rr-archetype">
              <div className="rr-archetype-top">
                <span className="rr-archetype-name">
                  <ReportIcon name={a.icon} className="rr-inline-icon" /> {a.name}
                </span>
                <span className="rr-archetype-stats">{statLine(a.evidence.redditId)}</span>
              </div>
              <p className="rr-p">{a.desc}</p>
              <p className="rr-valuelead">↳ {a.valueLead}</p>
              <Collapse label="the receipt" sublabel={collapseSub(a.evidence)}>
                <EvidenceCard {...a.evidence} />
              </Collapse>
            </div>
          ))}

          <h3 className="rr-h3">the 6 craft rules</h3>
          <p className="rr-standfirst">
            every rule came from watching what worked and what got me destroyed. the entry system that earns you the right to post at all lives in the karma gating section.
          </p>

          {CRAFT_RULES.map((r, i) => (
            <Step key={i} n={i + 1} title={r.rule}>{r.detail}</Step>
          ))}

          <div style={{ marginTop: '24px' }}>
            <Collapse label="more receipts" sublabel={`${EXTRA_RECEIPTS.length} additional posts with screenshots`}>
              <p className="rr-standfirst">
                every post below is real. screenshots straight from the Reddit dashboard, wins and flops included.
              </p>
              {EXTRA_RECEIPTS.map((e, i) => (
                <EvidenceCard key={i} {...e} />
              ))}
            </Collapse>
          </div>
          </Column>
        </section>

        {/* ── 04 · comments ── */}
        <section id="comments" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('comments')}</p>
          <h2 className="rr-h2">comments: where karma actually lives</h2>
          <p className="rr-standfirst">
            my highest-upvoted comment anywhere is one sentence about ADHD and Claude Code. reddit shows me view counts on comments but my tracker only scrapes them for posts, so upvotes are the number I can stand behind here. these are the 7 comment types I run and the flagship example for each.
          </p>
          </Column>

          {/* which subs actually talk back. pairs with the calibration chart
              in section 06: views and conversation are different products. */}
          <Bleed>
            <ConversationChart
              rows={redditStats.conversation.rows}
              minPosts={redditStats.conversation.minPosts}
              asOf={redditStats.asOf}
            />
          </Bleed>

          <Column>
          {COMMENT_TYPES.map((ct) => (
            <Step key={ct.name} n={<ReportIcon name={ct.icon} />} title={ct.name}>
              {ct.desc}
              <span className="rr-highlight">{ct.highlight}</span>
              <Collapse label="the comment" sublabel={ct.example.context}>
                <EvidenceCard
                  title={ct.example.context}
                  sub=""
                  tag="Comment"
                  tagColor={ORANGE}
                  redditId={ct.example.redditId}
                  image={ct.example.image}
                  body={ct.example.text}
                  lesson=""
                />
              </Collapse>
            </Step>
          ))}
          </Column>
        </section>

        {/* ── 05 · karma gating ── */}
        <section id="karma-gating" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('karma-gating')}</p>
          <h2 className="rr-h2">karma gating: the thresholds</h2>
          <p className="rr-standfirst">
            every sub you want to post in has a gate. some gates are posted in the rules: minimum karma, minimum account age. some are invisible: automod quietly removes your post and the views flatline at zero. know the gate before you post, or your best work dies in the queue.
          </p>
          </Column>

          <Bleed><div className="rr-table-wrap">
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
          </div></Bleed>

          <Column>
          <h3 className="rr-h3">the entry system</h3>
          {GATING_STEPS.map((r, i) => (
            <Step key={i} n={i + 1} title={r.rule}>{r.detail}</Step>
          ))}

          <p className="rr-note">
            the receipt: my karma-building era ran {karmaEra.items} posts and comments for {fmtViews(karmaEra.views)} views before the clearbox era started ({clearboxEra.items} items, {fmtViews(clearboxEra.views)} views). the gate-building phase came first. it always does.
          </p>
          </Column>

          {/* the gates are counted in karma, so it matters that an upvote is
              not a fixed quantity of anything */}
          <Bleed>
            <CalibrationChart
              rows={redditStats.calibration.rows}
              minPosts={redditStats.calibration.minPosts}
              asOf={redditStats.asOf}
            />
          </Bleed>

          <Column>

          <p style={{ textAlign: 'center', margin: '24px 0 0' }}>
            <a href="/vault" style={vaultLinkStyle}>
              the actual files: /vault → reddit/ →
            </a>
          </p>
          </Column>
        </section>

        {/* ── 06 · the link map ── */}
        <section id="link-map" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('link-map')}</p>
          <h2 className="rr-h2">the link map: three zones, three rules</h2>
          <p className="rr-standfirst">
            where a link lives decides whether a human ever votes on your post. get the zone wrong and the automod buries you first.
          </p>

          {LINK_ZONES.map((z) => (
            <Step key={z.zone} n={<ReportIcon name={z.icon} />} title={z.zone} aside={z.verdict}>{z.desc}</Step>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: a link that landed" sublabel={collapseSub(LINK_ZONE_EVIDENCE)}>
              <EvidenceCard {...LINK_ZONE_EVIDENCE} />
            </Collapse>
          </div>

          <p className="rr-note">
            the stronger move: skip the URL entirely. somebody asks, you describe what the thing does. &quot;I built a scanner that reads every complaint thread and labels each one lead, competitor, or engager.&quot; the reader who wants it will find it. the description is the link. section {sectionNo('the-ask')} is how you get asked on purpose.
          </p>
          </Column>
        </section>

        {/* ── the ask ── */}
        <section id="the-ask" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('the-ask')}</p>
          <h2 className="rr-h2">the ask: get them to request the link</h2>
          <p className="rr-standfirst">
            a link you drop is an ad. the same link, handed over because someone asked for it, is an answer. the sub scores those differently and so does everyone reading. the ask is the part you can engineer.
          </p>

          {THE_ASK.map((a) => (
            <Step key={a.move} n={<ReportIcon name={a.icon} />} title={a.move}>{a.desc}</Step>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: a post with no links, and the reply asking for them" sublabel={collapseSub(THE_ASK_EVIDENCE)}>
              <EvidenceCard {...THE_ASK_EVIDENCE} />
            </Collapse>
          </div>

          <p className="rr-note">
            the ask is the permission slip. it converts a URL from something you pushed into something the thread requested, and it is the only version of a link that a sub will let you post twice.
          </p>
          </Column>
        </section>

        {/* ── staying alive ── */}
        <section id="staying-alive" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('staying-alive')}</p>
          <h2 className="rr-h2">staying alive: shadowbans and silent removals</h2>
          <p className="rr-standfirst">
            Reddit rarely tells you that you are gone. the post sits there in your own browser looking fine while the views never move, and you keep talking to a room that stopped receiving you weeks ago. check first, then fix the account rather than the post.
          </p>

          <h3 className="rr-h3">three checks that take a minute</h3>
          {SHADOWBAN_CHECKS.map((c) => (
            <Step key={c.check} n={<ReportIcon name={c.icon} />} title={c.check}>{c.how}</Step>
          ))}

          <h3 className="rr-h3">what actually trips it</h3>
          {SHADOWBAN_TRIGGERS.map((t) => (
            <Step key={t.trigger} n={<ReportIcon name={t.icon} />} title={t.trigger}>{t.detail}</Step>
          ))}

          <h3 className="rr-h3">getting back</h3>
          {SHADOWBAN_RECOVERY.map((r) => (
            <Step key={r.step} n={<ReportIcon name={r.icon} />} title={r.step}>{r.detail}</Step>
          ))}

          <p className="rr-note">
            this account has never been banned. not because it got away with anything, but because it never ran the plays that get you banned.
          </p>
          </Column>
        </section>

        {/* ── 07 · what AI cites ── */}
        <section id="ai-citations" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('ai-citations')}</p>
          <h2 className="rr-h2">what AI cites: no-link mentions still index</h2>
          <p className="rr-standfirst">
            mention a product by name, in context, answering a real question, and it gets indexed with zero URLs involved. Reddit threads rank fast and LLMs cite them. an unlinked brand mention inside a high-signal answer becomes retrievable, and the model repeats it to the next person who asks.
          </p>

          <p className="rr-note">
            the receipt: {redditStats.wins} threads flagged high-value out of {redditStats.totalPosts + redditStats.totalComments} tracked, scored on the value of the conversation rather than the upvotes. {fmtViews(redditStats.trackedViews)} tracked views is the surface they came from.
          </p>

          <h3 className="rr-h3">every conversation is worth more than the close</h3>
          <p className="rr-standfirst">
            the threads where someone is ready to buy are a rounding error next to the threads that tell you who they are. every thread your buyers post sorts into one of three labels, and each label tells you the next move:
          </p>

          {SIGNAL_LABELS.map((s) => (
            <Step key={s.name} n={<ReportIcon name={s.icon} />} title={s.name}>{s.desc}</Step>
          ))}

          <div style={{ marginTop: '20px' }}>
            <Collapse label="the receipt: two mentions that did the work" sublabel="r/GTMbuilders · r/gtmengineering">
              <EvidenceCard
                title="Intent signals are qualification scores, not buying intent."
                sub="r/GTMbuilders"
                tag="Lead Signal"
                tagColor="#fbbf24"
                redditId="1su7zj1"
                image="/images/reddit-evidence/intent-signals-qualification-7.png"
                body="the Clearbox thesis stated in plain English. someone scrolling a problem thread is showing you which problem to solve first."
                lesson="low post-score, high conversion. commenters from this thread became early-access signups, which is the whole argument against reading upvotes as impact."
              />
              <EvidenceCard
                title="Supabase + Google Sheets + Claude Code replaced Clay for me. here is how."
                sub="r/gtmengineering"
                tag="Competitor Signal"
                tagColor="#f87171"
                redditId="1s9ylfe"
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
          </Column>
        </section>

        {/* ── 08 · LLMO ── */}
        <section id="llmo" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('llmo')}</p>
          <h2 className="rr-h2">LLMO: language-level model optimization</h2>
          <p className="rr-standfirst">
            the discipline on top of SEO and GEO. you&apos;re injecting your language, your phrasing, your voice into the places models read, so the model&apos;s answer sounds like you and points back to you.
          </p>
          <p className="rr-standfirst">
            the mechanism is voice consistency. the same voice across Reddit, blog, and site teaches the model one coherent entity, and one coherent entity is what gets cited. this is why the same voice DNA files run everything I publish, from a one-liner comment to a 2,000-word post.
          </p>

          <p style={{ textAlign: 'center', margin: '24px 0 0' }}>
            <a href="/vault" style={vaultLinkStyle}>
              the actual files: /vault → reddit/ →
            </a>
          </p>
          </Column>
        </section>

        {/* ── delegation ── */}
        <section id="delegation" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('delegation')}</p>
          <h2 className="rr-h2">delegation: handing the account to someone else</h2>
          <p className="rr-standfirst">
            everything above assumes a person is reading the thread and a person is writing the reply. that person does not have to be you. a VA is a human, which is the entire requirement. it fails when the VA is handed an account and a goal and nothing else, because you cannot run this blind.
          </p>

          {DELEGATION.map((d) => (
            <Step key={d.name} n={<ReportIcon name={d.icon} />} title={d.name}>{d.desc}</Step>
          ))}

          <p className="rr-note">
            the 24-hour pull is what makes this safe. your VA opens a scored list of the threads worth answering, with the rules for each sub attached, instead of a blank search bar and an instruction to go be helpful. the account stays human. the work stops depending on you being awake.
          </p>
          </Column>
        </section>

        {/* ── 09 · closer: the weekly report ── */}
        <section id="newsletter" className="rr-section">
          <Column>
          <p className="rr-kicker">section {sectionNo('newsletter')}</p>
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
          </Column>
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

          <RightRail rails={buildRails()} asOf={redditStats.asOf} />
        </div>
        </ChromeProvider>
      </Shell>
    </>
  )
}
