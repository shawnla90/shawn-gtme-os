'use client'

import Image from 'next/image'
import { Link } from '../i18n/navigation'
import { SmartAnimateText } from '../components/unlumen-ui/smart-animate-text'
import { FileTree, type FileTreeElement } from '../components/unlumen-ui/file-tree'
import MagneticButton from '../components/smoothui/magnetic-button'
import { ButtonLink } from '@shawnos/shared/components/ui'
import type { TimelineItem, LearningDiscipline } from '@shawnos/shared/lib'
import { ClearboxModeDemo } from '../components/clearbox/ClearboxModeDemo'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  category?: string
  featured?: boolean
}

interface HomeContentProps {
  posts: Post[]
  timeline: TimelineItem[]
  karma: string
  learning: LearningDiscipline[]
}

const ARC = [
  {
    eyebrow: 'Plumber',
    sentence: 'Before tech, I was a plumber. Not a metaphor — actual plumbing.',
    lesson: 'Every system has a logic. Follow the flow.',
  },
  {
    eyebrow: 'SDR',
    sentence: 'SDR years. Manual buying committees, primary-domain sends, the grind that taught me what to automate.',
    lesson: 'Volume is a teacher. Rejection is data.',
  },
  {
    eyebrow: 'GTM Engineer',
    sentence: 'I stopped working inside the systems and started building them.',
    lesson: 'You can’t engineer what you don’t understand.',
  },
  {
    eyebrow: 'Founder',
    sentence: 'Now I’m building Clearbox. The system became the product.',
    lesson: 'Build the tool you wish existed.',
  },
]

const VAULT_TREE: FileTreeElement[] = [
  {
    id: 'voice-dna',
    name: 'voice-dna/',
    type: 'folder',
    defaultOpen: true,
    children: [
      { id: 'voice-dna/core-voice', name: 'core-voice.md', href: '/vault/voice-dna/core-voice' },
      { id: 'voice-dna/voice-principles', name: 'voice-principles.md', href: '/vault/voice-dna/voice-principles' },
      { id: 'voice-dna/viral-hooks', name: 'viral-hooks.md', href: '/vault/voice-dna/viral-hooks' },
    ],
  },
  {
    id: 'anti-slop',
    name: 'anti-slop/',
    type: 'folder',
    children: [
      { id: 'anti-slop/anti-slop-core', name: 'anti-slop-core.md', href: '/vault/anti-slop/anti-slop-core' },
      { id: 'anti-slop/ai-pattern-detection', name: 'ai-pattern-detection.md', href: '/vault/anti-slop/ai-pattern-detection' },
    ],
  },
  {
    id: 'reddit',
    name: 'reddit/',
    type: 'folder',
    children: [
      { id: 'reddit/reddit-growth-seo', name: 'reddit-growth-seo.md', href: '/vault/reddit/reddit-growth-seo' },
      { id: 'reddit/reddit-strategy', name: 'reddit-strategy.md', href: '/vault/reddit/reddit-strategy' },
    ],
  },
]

function formatRelative(timestamp: string): string {
  const t = new Date(timestamp).getTime()
  if (!Number.isFinite(t)) return ''
  const diff = Date.now() - t
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

const sourceColor: Record<string, string> = {
  blog: 'var(--text-primary)',
  substack: 'var(--text-secondary)',
  reddit: 'var(--text-secondary)',
}

export function HomeContent({ posts, timeline, karma, learning }: HomeContentProps) {
  return (
    <div className="home">
      <style>{`
        .home {
          --home-max: 1080px;
          font-family: var(--font-sans);
          position: relative;
          overflow: clip;
        }
        .home-inner { max-width: var(--home-max); margin: 0 auto; padding: 0 24px 140px; }

        /* immersive hero */
        .home-hero { position: relative; text-align: center; padding: 24px 0 48px; }
        .home-hero-glow {
          position: absolute; inset: -150px 0 auto 0; height: 460px; z-index: 0; pointer-events: none;
          background:
            radial-gradient(36% 40% at 50% 18%, color-mix(in srgb, var(--aura-strong) 34%, transparent), transparent 60%),
            radial-gradient(58% 58% at 50% 12%, color-mix(in srgb, var(--aura) 18%, transparent), transparent 70%),
            radial-gradient(92% 82% at 50% 2%, color-mix(in srgb, var(--aura) 7%, transparent), transparent 80%);
          -webkit-mask-image: radial-gradient(76% 76% at 50% 24%, #000, transparent 82%);
          mask-image: radial-gradient(76% 76% at 50% 24%, #000, transparent 82%);
          animation: home-glow-breathe 9s ease-in-out infinite;
        }
        /* tight central bloom — the aura core, with its own pulse */
        .home-hero-glow::before {
          content: ''; position: absolute; left: 50%; top: 28px; transform: translateX(-50%);
          width: 360px; height: 220px; border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--aura-strong) 30%, transparent), transparent 72%);
          filter: blur(24px);
          animation: home-glow-core 7s ease-in-out infinite;
        }
        @keyframes home-glow-breathe {
          0%, 100% { opacity: 0.82; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-8px); }
        }
        @keyframes home-glow-core {
          0%, 100% { opacity: 0.65; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-hero-glow, .home-hero-glow::before { animation: none; }
        }
        .home-hero-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5;
          background-image:
            linear-gradient(color-mix(in srgb, var(--aura) 9%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--aura) 9%, transparent) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(60% 55% at 50% 30%, #000, transparent 70%);
          mask-image: radial-gradient(60% 55% at 50% 30%, #000, transparent 70%);
        }
        /* lift content above the decorative layers; leave the aria-hidden
           glow/grid on their own absolute positioning (don't drop them into flow) */
        .home-hero > *:not([aria-hidden]) { position: relative; z-index: 1; }
        .home-avatar { border-radius: 9999px; border: 1px solid var(--canvas-border); margin: 0 auto 22px; display: block; }
        .home-eyebrow {
          font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted);
          margin: 0 0 18px; font-weight: 600;
        }
        .home-name {
          font-size: clamp(40px, 6vw, 66px); font-weight: 700; line-height: 1.0; letter-spacing: -0.035em;
          color: var(--text-primary); margin: 0 0 16px;
        }
        .home-lead {
          font-size: clamp(18px, 2.4vw, 22px); font-weight: 500; color: var(--text-primary);
          line-height: 1.35; margin: 0 auto 16px; max-width: 640px;
        }
        .home-intro {
          font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin: 0 auto 30px; max-width: 600px;
        }
        .home-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* section scaffolding */
        .home-section { margin-top: 96px; }
        .home-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
          flex-wrap: wrap; margin-bottom: 28px; }
        .home-kicker { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted); font-weight: 600; margin: 0; }
        .home-section-link { font-size: 14px; color: var(--text-primary); text-decoration: none; }
        .home-section-link:hover { opacity: 0.7; }

        /* the path — connected sequence, not boxes */
        .path { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0; position: relative; }
        .path-step { padding: 0 28px; position: relative; }
        .path-step + .path-step { border-left: 1px solid var(--canvas-border); }
        .path-num { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); letter-spacing: 0.1em; }
        .path-role { font-size: 18px; font-weight: 600; color: var(--text-primary); margin: 10px 0 10px; letter-spacing: -0.01em; }
        .path-sentence { font-size: 15px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 14px; }
        .path-lesson { font-size: 14px; color: var(--text-primary); line-height: 1.45; margin: 0; font-weight: 500; }
        @media (max-width: 720px) {
          .path { grid-template-columns: 1fr; }
          .path-step { padding: 24px 0; }
          .path-step + .path-step { border-left: none; border-top: 1px solid var(--canvas-border); }
        }

        /* the vault — steal my files */
        .vault-feature {
          display: grid; grid-template-columns: minmax(280px, 460px) 1fr; gap: 48px; align-items: center;
          background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: 20px;
          padding: 36px;
        }
        .vault-feature-tree { min-width: 0; }
        .vault-feature-heading {
          font-size: clamp(26px, 3.4vw, 34px); font-weight: 700; letter-spacing: -0.02em;
          color: var(--text-primary); margin: 0 0 12px;
        }
        .vault-feature-copy { font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 24px; max-width: 480px; }
        @media (max-width: 820px) {
          .vault-feature { grid-template-columns: 1fr; gap: 28px; padding: 24px; }
        }

        /* destinations — elevated feature cards */
        .dest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
        .dest-card {
          background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: 20px;
          padding: 30px; text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 18px;
          min-height: 280px; transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .dest-card:hover { transform: translateY(-3px); border-color: var(--text-secondary);
          background: var(--canvas-card); }
        .dest-icon { width: 44px; height: 44px; color: var(--text-primary); }
        .dest-icon--light { display: none; }
        [data-theme='light'] .dest-icon--dark { display: none; }
        [data-theme='light'] .dest-icon--light { display: block; }
        .dest-kicker { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted);
          font-weight: 600; margin: 0 0 8px; }
        .dest-title { font-size: 23px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; margin: 0 0 10px; }
        .dest-sub { font-size: 15px; color: var(--text-secondary); line-height: 1.45; margin: 0; }
        .dest-go { margin-top: auto; font-size: 14px; color: var(--text-primary); font-weight: 600; }
        .dest-stat { display: flex; align-items: baseline; gap: 10px; }
        .dest-stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
          letter-spacing: 0.08em; text-transform: uppercase; }

        /* building-in-public feed */
        .feed-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .feed-item {
          display: flex; gap: 16px; align-items: baseline; flex-wrap: wrap;
          border: 1px solid transparent; border-bottom-color: var(--canvas-border); border-radius: 14px;
          padding: 14px 14px; transition: background 0.15s ease, border-color 0.15s ease;
        }
        .feed-item:hover { background: var(--canvas-subtle); border-color: var(--canvas-border); }
        .feed-badge { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; min-width: 72px; }
        .feed-time { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); min-width: 60px; }
        .feed-title { flex: 1; min-width: 240px; font-size: 15px; font-weight: 500; color: var(--text-primary);
          text-decoration: none; line-height: 1.4; }
        .feed-title:hover { color: var(--text-primary); opacity: 0.7; }

        /* currently-learning band */
        .learn-band { display: flex; flex-wrap: wrap; gap: 10px; }
        .learn-chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px;
          border: 1px solid var(--canvas-border); border-radius: 9999px; text-decoration: none;
          background: var(--canvas-subtle); transition: border-color 0.15s ease, transform 0.15s ease; }
        .learn-chip:hover { border-color: var(--text-secondary); transform: translateY(-2px); }
        .learn-chip-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .learn-chip-status { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-muted); }

        /* what clearbox is */
        .clearbox-lead { font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 28px; max-width: 640px; }
        .clearbox-inline-link { color: var(--text-primary); text-decoration: none; font-weight: 500; }
        .clearbox-inline-link:hover { opacity: 0.7; }

        /* writing — featured posts */
        .writing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
        .post-card {
          background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: var(--radius-lg);
          padding: 26px 24px; text-decoration: none; color: inherit; display: flex; flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .post-card:hover { transform: translateY(-3px); border-color: var(--text-secondary); background: var(--canvas-card); }
        .post-card-kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-muted); margin: 0 0 12px; }
        .post-card-title { font-size: 19px; font-weight: 700; color: var(--text-primary); line-height: 1.3;
          letter-spacing: -0.01em; margin: 0 0 10px; }
        .post-card-excerpt { font-size: 14px; color: var(--text-secondary); line-height: 1.55; margin: 0 0 18px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .post-card-go { margin-top: auto; font-size: 13px; font-weight: 600; color: var(--text-primary); }
      `}</style>

      <div className="home-inner">
        {/* HERO */}
        <header className="home-hero">
          <div className="home-hero-glow" aria-hidden />
          <div className="home-hero-grid" aria-hidden />
          <Image
            src="/clearbox/pfp.png"
            alt="Shawn Tenam"
            width={76}
            height={76}
            className="home-avatar"
            priority
          />
          <p className="home-eyebrow">Building in public</p>
          <h1 className="home-name">Shawn Tenam</h1>
          <p className="home-lead">Go-to-market engineer, now founder. Plumber for 10 years before that.</p>
          <p className="home-intro">
            I build my GTM engine in public. Campaigns, content, and the agents that run them live in one
            codebase you can read. Take what works.
          </p>
          <div className="home-cta">
            <ButtonLink href="https://clearbox.to" target="_blank" rel="noopener noreferrer" variant="primary" size="md">
              Open Clearbox →
            </ButtonLink>
            <ButtonLink href="/reddit" variant="secondary" size="md">
              Read the playbook
            </ButtonLink>
          </div>
        </header>

        {/* THE VAULT — steal my files */}
        <section className="home-section">
          <div className="home-section-head">
            <p className="home-kicker">Steal my files</p>
          </div>
          <div className="vault-feature">
            <div className="vault-feature-tree">
              <FileTree
                elements={VAULT_TREE}
                highlightColor="var(--aura-strong)"
                showIcons
              />
            </div>
            <div>
              <h2 className="vault-feature-heading">the vault</h2>
              <p className="vault-feature-copy">
                23 real files from my GTM agent stack. Voice DNA, anti-slop, the Reddit system.
                Browse them, download them, use them.
              </p>
              <MagneticButton asChild>
                <Link href={'/vault' as never}>Open the vault →</Link>
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* THE PATH */}
        <section className="home-section">
          <div className="home-section-head">
            <p className="home-kicker">The path</p>
            <Link href={'/about/arc' as never} className="home-section-link">Read the full arc →</Link>
          </div>
          <div className="path">
            {ARC.map((act, i) => (
              <article key={act.eyebrow} className="path-step">
                <span className="path-num">0{i + 1}</span>
                <h3 className="path-role">{act.eyebrow}</h3>
                <p className="path-sentence">{act.sentence}</p>
                <p className="path-lesson">{act.lesson}</p>
              </article>
            ))}
          </div>
        </section>

        {/* DESTINATIONS */}
        <section className="home-section">
          <div className="home-section-head">
            <p className="home-kicker">Start here</p>
          </div>
          <div className="dest-grid">
            {/* Clearbox */}
            <a href="https://clearbox.to" target="_blank" rel="noopener noreferrer" className="dest-card">
              <Image src="/clearbox/icon-dark.svg" alt="Clearbox" width={44} height={44} className="dest-icon dest-icon--dark" />
              <Image src="/clearbox/icon-light.svg" alt="" aria-hidden width={44} height={44} className="dest-icon dest-icon--light" />
              <div>
                <p className="dest-kicker">Now live</p>
                <h3 className="dest-title">Clearbox</h3>
                <p className="dest-sub">See your market. Move first.</p>
              </div>
              <span className="dest-go">Open Clearbox ↗</span>
            </a>

            {/* Reddit Growth Playbook */}
            <Link href={'/reddit' as never} className="dest-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/reddit.svg" alt="Reddit" width={44} height={44} className="dest-icon" />
              <div>
                <p className="dest-kicker">Reddit growth playbook</p>
                <h3 className="dest-title">Zero to a community in 30 days</h3>
                <div className="dest-stat">
                  <SmartAnimateText
                    value={karma}
                    className="text-[40px] font-extrabold leading-none text-[var(--text-primary)]"
                  />
                  <span className="dest-stat-label">reddit karma</span>
                </div>
              </div>
              <span className="dest-go">Read the playbook →</span>
            </Link>

            {/* Knowledge Hub */}
            <Link href={'/knowledge' as never} className="dest-card">
              <svg className="dest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <div>
                <p className="dest-kicker">200+ entries</p>
                <h3 className="dest-title">Knowledge</h3>
                <p className="dest-sub">Wikis, how-tos, context engineering, GEO, guides — everything in one place.</p>
              </div>
              <span className="dest-go">Open the hub →</span>
            </Link>

            {/* Built in public */}
            <Link href={'/built' as never} className="dest-card">
              <svg className="dest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
              </svg>
              <div>
                <p className="dest-kicker">open source · the git log</p>
                <h3 className="dest-title">Built in public</h3>
                <p className="dest-sub">The stars, the commit trail, and the one thing I won&apos;t claim.</p>
              </div>
              <span className="dest-go">See the build →</span>
            </Link>
          </div>
        </section>

        {/* WRITING — featured posts, surfaced high */}
        {posts.length > 0 && (
          <section className="home-section">
            <div className="home-section-head">
              <p className="home-kicker">Writing</p>
              <Link href={'/blog' as never} className="home-section-link">Read the blog →</Link>
            </div>
            <div className="writing-grid">
              {posts.map((p) => {
                const d = new Date(p.date)
                const dateLabel = Number.isFinite(d.getTime())
                  ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : ''
                const cat = p.category ? p.category.replace(/-/g, ' ') : ''
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}` as never} className="post-card">
                    <p className="post-card-kicker">{[cat, dateLabel].filter(Boolean).join(' · ')}</p>
                    <h3 className="post-card-title">{p.title}</h3>
                    <p className="post-card-excerpt">{p.excerpt}</p>
                    <span className="post-card-go">Read →</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* WHAT CLEARBOX IS */}
        <section className="home-section">
          <div className="home-section-head">
            <p className="home-kicker">What Clearbox is</p>
            <a href="https://clearbox.to" target="_blank" rel="noopener noreferrer" className="home-section-link">Open the full Clearbox ↗</a>
          </div>
          <p className="clearbox-lead">
            Signal-based market intelligence. Pick a mode — lead, competitor, or engager — and Clearbox scores
            the conversations worth showing up in.{' '}
            <a href="https://clearbox.to" target="_blank" rel="noopener noreferrer" className="clearbox-inline-link">See it live ↗</a>
          </p>
          <ClearboxModeDemo />
        </section>

        {/* CURRENTLY LEARNING */}
        {learning.length > 0 && (
          <section className="home-section">
            <div className="home-section-head">
              <p className="home-kicker">Currently learning</p>
              <Link href={'/log/skills' as never} className="home-section-link">See the craft log →</Link>
            </div>
            <div className="learn-band">
              {learning.map((d) => (
                <Link key={d.slug} href={'/log/skills' as never} className="learn-chip">
                  <span className="learn-chip-name">{d.discipline}</span>
                  <span className="learn-chip-status">{d.status}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BUILDING IN PUBLIC — feed */}
        <section className="home-section">
          <div className="home-section-head">
            <p className="home-kicker">Building in public · blog · substack · reddit</p>
            <Link href={'/blog' as never} className="home-section-link">See all →</Link>
          </div>
          <ul className="feed-list">
            {timeline.slice(0, 12).map((item) => (
              <li key={item.id} className="feed-item">
                <span className="feed-badge" style={{ color: sourceColor[item.source] ?? 'var(--text-muted)' }}>
                  {item.badge.label}
                </span>
                <span className="feed-time">{formatRelative(item.timestamp)}</span>
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className="feed-title"
                >
                  {item.title}
                </a>
              </li>
            ))}
            {posts.length > 0 && timeline.length === 0 && (
              <li className="feed-time">Feed loading. Check back in a moment.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
