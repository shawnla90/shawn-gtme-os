import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { fetchUserProfile } from '@shawnos/shared/lib/reddit'
import { RedditTabs } from './RedditTabs'
import { EvidenceCard } from './EvidenceCard'

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

/* ── evidence data ─────────────────────────────────── */

const EVIDENCE = [
  {
    title: 'I spent 10 years as a plumber in NYC alongside my dad. Now I\'m using tech to share everything he knows. for free.',
    sub: 'r/NYCapartments',
    tag: 'Advice/Question',
    tagColor: '#58a6ff',
    upvotes: 188,
    comments: 26,
    views: '28K',
    type: 'crossover' as const,
    image: '/images/reddit-evidence/dad-plumber-nyc.png',
    body: 'I\'m Shawn. For 10 years I worked plumbing in New York City with my father, Reuven. Not holding tools. running jobs. Every borough. Pre-war brownstones where nothing is where the blueprints say it is. High-rises where one bad valve floods six floors.',
    lesson: 'personal story in an unexpected subreddit. authenticity wins. highest single-post upvotes.',
  },
  {
    title: 'life now with cc remote control',
    sub: 'r/ClaudeCode',
    tag: 'Humor',
    tagColor: '#f472b6',
    upvotes: 95,
    comments: 23,
    views: '18K',
    type: 'meme' as const,
    image: '/images/reddit-evidence/cc-remote-gosling.png',
    body: 'Ryan Gosling meme — posted the morning Claude Code remote access dropped. zero effort, maximum relatability.',
    lesson: 'memes work. posted right when Claude Code remote dropped. timing is everything.',
  },
  {
    title: 'been mass building with Claude Code every day for 6 weeks straight. just left my agency a week ago betting on this stack full time.',
    sub: 'r/ClaudeCode',
    tag: 'Showcase',
    tagColor: '#4ade80',
    upvotes: 46,
    comments: 164,
    views: '145K',
    type: 'showcase' as const,
    image: '/images/reddit-evidence/6week-claude-code.png',
    body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms, and cron jobs running nightly on a single Mac Mini. all Claude Code. the 4-6 concurrent terminal sessions lifestyle is real.',
    lesson: '145K views, 164 comments. the post was the hook, the comments were the delivery.',
  },
  {
    title: 'anyone running Claude Code over SSH from a thin client?',
    sub: 'r/ClaudeCode',
    tag: 'Question',
    tagColor: '#58a6ff',
    upvotes: 22,
    comments: 46,
    views: '45K',
    type: 'question' as const,
    image: '/images/reddit-evidence/ssh-thin-client.png',
    body: 'picking up a MacBook Neo (the new $699 one with the A18 Pro chip) as a portable terminal. all my actual compute lives on a Mac Mini that runs 24/7. the plan is basically: SSH in, tmux attach, run Claude Code on the Mini\'s hardware.',
    lesson: 'genuine question — I was actually buying the MacBook Neo. 46 comments of real technical answers.',
  },
  {
    title: 'from SDR to solo GTM engineer. the AI development method behind my entire operation',
    sub: 'r/gtmengineering',
    tag: 'Showcase',
    tagColor: '#4ade80',
    upvotes: 18,
    comments: 9,
    views: '4.1K',
    type: 'thought-leadership' as const,
    image: '/images/reddit-evidence/sdr-to-gtm-engineer.png',
    body: '4 weeks ago I started using Claude Code heavy. since then I\'ve shipped four full stack websites, built a arsenal of reusable skills, a voice system for content, a progression engine. all one monorepo, one Mac Mini.',
    lesson: 'career arc story. linked repos, not landing pages. showed the method, not just the results.',
  },
  {
    title: 'Testing the new 1M context window be like...',
    sub: 'r/ClaudeCode',
    tag: 'Humor',
    tagColor: '#f472b6',
    upvotes: 12,
    comments: 3,
    views: '3.4K',
    type: 'meme' as const,
    image: '/images/reddit-evidence/1m-context-meme.png',
    body: 'anime meme — "claude code 40 files deep executing a plan with full confidence" vs "me with my finger on ctrl+c deciding if this is genius or a disaster"',
    lesson: 'anime meme on launch day. low effort, high relatability. keeps you visible between big posts.',
  },
  {
    title: 'tool devotion is a trap. Clay just proved the thesis.',
    sub: 'r/GTMbuilders + r/gtmengineering',
    tag: 'Hot Take',
    tagColor: '#f87171',
    upvotes: 16,
    comments: 14,
    views: '3.1K',
    type: 'hot-take' as const,
    image: '/images/reddit-evidence/tool-devotion-trap.png',
    body: 'for the past two months I\'ve been pushing the same thesis. the builder is the moat, not the tool. if your entire value proposition is proficiency with a specific platform, you\'re one pricing change away from a career problem.',
    lesson: 'timely contrarian take. backed by 18 months of daily Clay usage. cross-posted to both subs.',
  },
  {
    title: 'stop renting your audience. build your own website.',
    sub: 'r/gtmengineering + r/GTMbuilders',
    tag: 'Blog Posts',
    tagColor: '#4ade80',
    upvotes: 1,
    comments: 0,
    views: '365',
    type: 'thesis' as const,
    image: '/images/reddit-evidence/stop-renting-audience.png',
    body: 'stop renting your audience. build your own website. I said the tools are a trap, that you shouldn\'t tie your career to someone else\'s roadmap.',
    lesson: 'not every post hits. this one was too preachy. lesson: lead with story, not advice.',
  },
  {
    title: 'Before You Hire a Clay Agency. Free Audit Checklist.',
    sub: 'r/gtmengineering',
    tag: 'Resource',
    tagColor: '#c084fc',
    upvotes: 10,
    comments: 6,
    views: '2K',
    type: 'value-first' as const,
    image: '/images/reddit-evidence/clay-agency-audit.png',
    body: 'I\'ve been building in Clay daily for over a year. 60+ Clay Wiki entries, open-source GTM OS. I keep getting asked "should I hire a Clay agency?" so I put together the 5-question audit I run before answering.',
    lesson: 'pure value. no email gate. just the checklist. people saved this one.',
  },
  {
    title: 'the new GTM resume is a GitHub repo and Reddit karma',
    sub: 'r/GTMbuilders',
    tag: 'Blog Posts',
    tagColor: '#4ade80',
    upvotes: 3,
    comments: 8,
    views: '738',
    type: 'thesis' as const,
    image: '/images/reddit-evidence/gtm-resume-github-repo.png',
    body: 'I spent 2 years getting good at Clay. learned every enrichment, every Claygent pattern, every HTTP API workaround. documented 60+ entries in a public wiki. then I realized something. Clay could change their pricing tomorrow.',
    lesson: 'thesis post for the community. small numbers but seeded the conversation for future posts.',
  },
]

const POST_TYPES = [
  {
    name: 'the showcase',
    emoji: '🏗️',
    desc: 'show what you shipped. numbers, repos, screenshots. the post is the hook, the comments deliver the depth.',
    example: '43 upvotes, 163 comments, 143K views',
  },
  {
    name: 'the question',
    emoji: '❓',
    desc: "ask something you genuinely want to know. technical depth invites technical answers. don't fake it.",
    example: '22 upvotes, 46 comments, 45K views',
  },
  {
    name: 'the meme',
    emoji: '😂',
    desc: 'relatable humor, perfectly timed. post when a feature drops or a trend is peaking.',
    example: '95 upvotes, 23 comments, 18K views',
  },
  {
    name: 'the crossover',
    emoji: '🔀',
    desc: "find unexpected subreddits where your story resonates. a plumber's son in r/NYCapartments shouldn't work — but it does.",
    example: '188 upvotes, 26 comments, 28K views',
  },
  {
    name: 'the hot take',
    emoji: '🔥',
    desc: 'ride breaking news within hours. have a real opinion backed by experience, not just outrage.',
    example: '16 upvotes, 14 comments, 3.1K views',
  },
  {
    name: 'the value drop',
    emoji: '🎁',
    desc: 'give away something useful. checklists, frameworks, audits. no gate, no DM, no email capture.',
    example: '10 upvotes, 6 comments, 2K views',
  },
  {
    name: 'the thought piece',
    emoji: '🧠',
    desc: 'career arc, methodology, thesis. show the journey, link the receipts.',
    example: '18 upvotes, 9 comments, 4.1K views',
  },
]

const RULES = [
  {
    rule: 'find 3 subreddits that match your niche',
    detail:
      '5K-50K members is the sweet spot. look for engagement ratios, not subscriber count. mine: r/ClaudeCode, r/gtmengineering, r/GTMBuilders.',
  },
  {
    rule: 'comment like a madman',
    detail:
      "50/50 post-comment karma ratio is the goal. comment naturally, add value, comment again. don't say \"great post\" — say something worth reading.",
  },
  {
    rule: 'the post is the hook, the comments are the delivery',
    detail:
      'write a tight post. then drop the depth, the links, the repos in the comments. this is how you get 163 comments on a single post.',
  },
  {
    rule: 'no gatekeeping',
    detail:
      "never say \"comment PLAYBOOK and I'll DM it.\" never gate behind email. MIT license your repos. the people who watch you give it away are the ones who hire you later.",
  },
  {
    rule: 'be genuine',
    detail:
      "post real questions you actually have. share real work you actually shipped. give real takes you actually believe. Reddit's immune system detects performance instantly.",
  },
  {
    rule: 'mix your post types',
    detail:
      "memes one day, showcases the next, questions in between. monotone accounts get ignored. variety signals you're a real person, not a content machine.",
  },
  {
    rule: 'ride the wave',
    detail:
      'when news breaks, post within hours. my Clay pricing posts hit because I was there first with a real opinion and 18 months of daily usage behind it.',
  },
  {
    rule: "don't post AI slop",
    detail:
      "Reddit will destroy you. no ChatGPT-generated posts. no em-dashes. no \"here's the uncomfortable truth.\" write like you talk. dictate if you have to.",
  },
]

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

const sectionTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '56px 0 24px',
  letterSpacing: '-0.02em',
}

const sectionDivider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

/* evidence card styles moved to EvidenceCard.tsx */

const postTypeCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '12px',
}

const postTypeName: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '0 0 6px',
}

const postTypeDesc: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: '0 0 8px',
}

const postTypeExample: React.CSSProperties = {
  fontSize: '11px',
  color: '#FF4500',
  fontWeight: 600,
}

const ruleCard: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  marginBottom: '12px',
}

const ruleNumber: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#FF4500',
  minWidth: '28px',
  lineHeight: 1,
  paddingTop: '2px',
}

const ruleText: React.CSSProperties = {
  flex: 1,
}

const ruleTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '0 0 6px',
}

const ruleDetail: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: 0,
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

        {/* Tabs */}
        <RedditTabs />

        {/* Evidence */}
        <h2 style={sectionTitle}>the receipts</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          every post below is real. screenshots from my Reddit dashboard. no cherry-picking — this is the full picture of what worked and why.
        </p>

        {EVIDENCE.map((e, i) => (
          <EvidenceCard key={i} {...e} />
        ))}

        <hr style={sectionDivider} />

        {/* Post Types */}
        <h2 style={sectionTitle}>the 7 post types that work</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          I tested all of these in my first month. each one hits differently. the trick is mixing them so you look like a person, not a content calendar.
        </p>

        {POST_TYPES.map((pt, i) => (
          <div key={i} style={postTypeCard}>
            <p style={postTypeName}>
              {pt.emoji} {pt.name}
            </p>
            <p style={postTypeDesc}>{pt.desc}</p>
            <p style={postTypeExample}>{pt.example}</p>
          </div>
        ))}

        <hr style={sectionDivider} />

        {/* Rules */}
        <div style={{ textAlign: 'center', margin: '0 0 -16px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/reddit-evidence/reddit-dark-snoo.png"
            alt=""
            style={{
              width: '120px',
              height: 'auto',
              opacity: 0.5,
              borderRadius: '12px',
              filter: 'grayscale(0.3)',
            }}
          />
        </div>
        <h2 style={sectionTitle}>the 8 rules</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          these aren&apos;t theory. every rule came from watching what worked and what got me destroyed.
        </p>

        {RULES.map((r, i) => (
          <div key={i} style={ruleCard}>
            <span style={ruleNumber}>{i + 1}</span>
            <div style={ruleText}>
              <p style={ruleTitle}>{r.rule}</p>
              <p style={ruleDetail}>{r.detail}</p>
            </div>
          </div>
        ))}

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
