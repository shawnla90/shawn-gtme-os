'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Link } from '../i18n/navigation'
import { SmartAnimateText } from '../components/unlumen-ui/smart-animate-text'
import { ButtonLink } from '@shawnos/shared/components/ui'
import type { TimelineItem } from '@shawnos/shared/lib'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
}

interface HomeContentProps {
  posts: Post[]
  timeline: TimelineItem[]
  karma: string
}

const COMING_SOON_KEY = 'shawnos-clearbox-strip-dismissed'

function ComingSoonStrip() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(COMING_SOON_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  if (dismissed) return null

  return (
    <div
      style={{
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--canvas-border)',
        borderRadius: '9999px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '32px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
      }}
    >
      <Link
        href={'/clearbox' as never}
        style={{
          color: 'var(--text-primary)',
          textDecoration: 'none',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        // clearbox ships this week. join early access →
      </Link>
      <button
        onClick={() => {
          try { localStorage.setItem(COMING_SOON_KEY, '1') } catch {}
          setDismissed(true)
        }}
        aria-label="dismiss announcement"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px 6px',
          fontSize: '14px',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}

const ARC = [
  {
    eyebrow: 'PLUMBER',
    sentence: 'before tech, I was a plumber. not a metaphor. actual plumbing.',
    lesson: 'every system has a logic. follow the flow.',
  },
  {
    eyebrow: 'SDR',
    sentence: '200+ cold emails a day. primary domains, SalesLoft sequences.',
    lesson: 'volume is a teacher. rejection is data.',
  },
  {
    eyebrow: 'GTM ENGINEER',
    sentence: 'I stopped working inside the systems and started building them.',
    lesson: 'you can’t engineer what you don’t understand.',
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
  substack: '#ff6719',
  reddit: '#ff4500',
}

export function HomeContent({ posts, timeline, karma }: HomeContentProps) {
  return (
    <section style={{ position: 'relative', padding: '40px 24px 120px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', paddingRight: '88px' /* right-rail space */ }}>
        <ComingSoonStrip />

        {/* HERO */}
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '64px',
            flexWrap: 'wrap',
          }}
        >
          <Image
            src="/clearbox/pfp.png"
            alt="Shawn Tenam"
            width={80}
            height={80}
            style={{
              borderRadius: '9999px',
              border: '1px solid var(--canvas-border)',
              flexShrink: 0,
            }}
            priority
          />
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}
            >
              // hello
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                margin: '0 0 8px',
              }}
            >
              Shawn Tenam
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '20px',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                margin: '0 0 16px',
                fontWeight: 500,
              }}
            >
              GTM engineer. Plumber for 10 years before that.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                margin: 0,
                maxWidth: '560px',
              }}
            >
              I build AI-native pipelines, agent-driven workflows, and content systems that
              compound. Every skill, every post, every campaign runs through a single codebase.
            </p>
          </div>
        </header>

        {/* 3-ACT STORY */}
        <section style={{ marginBottom: '64px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            {ARC.map((act) => (
              <article
                key={act.eyebrow}
                style={{
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--canvas-border)',
                  borderRadius: '16px',
                  padding: '24px',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  cursor: 'default',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.14em',
                    margin: '0 0 12px',
                  }}
                >
                  {act.eyebrow}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '17px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    margin: '0 0 12px',
                    fontWeight: 500,
                  }}
                >
                  {act.sentence}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {act.lesson}
                </p>
              </article>
            ))}
          </div>
          <ButtonLink href="/about/arc" variant="secondary" size="md">
            Read the full arc →
          </ButtonLink>
        </section>

        {/* 3 DESTINATIONS */}
        <section style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 20px',
            }}
          >
            // start here
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Clearbox */}
            <Link
              href={'/clearbox' as never}
              style={{
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--canvas-border)',
                borderRadius: '20px',
                padding: '28px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '260px',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              <Image
                src="/clearbox/icon-dark.svg"
                alt="Clearbox"
                width={48}
                height={48}
                style={{ opacity: 0.95 }}
              />
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  // launching this week
                </p>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: '0 0 8px' }}>
                  Clearbox
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  See your market. Move first.
                </p>
              </div>
              <span style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                Open Clearbox →
              </span>
            </Link>

            {/* Reddit Growth Playbook */}
            <Link
              href={'/reddit' as never}
              style={{
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--canvas-border)',
                borderRadius: '20px',
                padding: '28px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '260px',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/reddit.svg"
                alt="Reddit"
                width={48}
                height={48}
                style={{ opacity: 0.95, color: 'var(--text-primary)' }}
              />
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  // reddit growth playbook
                </p>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: '0 0 8px' }}>
                  Zero to a community in 30 days
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <SmartAnimateText
                    value={karma}
                    className="text-[40px] font-extrabold leading-none text-[var(--text-primary)]"
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    karma · live
                  </span>
                </div>
              </div>
              <span style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                Read the playbook →
              </span>
            </Link>

            {/* Knowledge Hub */}
            <Link
              href={'/knowledge' as never}
              style={{
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--canvas-border)',
                borderRadius: '20px',
                padding: '28px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '260px',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  // 200+ entries
                </p>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: '0 0 8px' }}>
                  Knowledge
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0, fontFamily: 'var(--font-mono)' }}>
                  knowledge · how-to · context · geo · guide · daily · contacts
                </p>
              </div>
              <span style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                Open the hub →
              </span>
            </Link>
          </div>
        </section>

        {/* WHAT I'M SHIPPING — feed */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 6px',
                }}
              >
                // what I&apos;m shipping right now
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                blog · substack · reddit · live
              </p>
            </div>
            <Link href={'/blog' as never} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              See all →
            </Link>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {timeline.slice(0, 8).map((item) => (
              <li
                key={item.id}
                style={{
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--canvas-border)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: sourceColor[item.source] ?? 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    minWidth: '72px',
                  }}
                >
                  {item.badge.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', minWidth: '64px' }}>
                  {formatRelative(item.timestamp)}
                </span>
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    lineHeight: 1.4,
                    minWidth: '240px',
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
            {posts.length > 0 && timeline.length === 0 && (
              <li style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Feed loading. Check back in a moment.
              </li>
            )}
          </ul>
        </section>
      </div>
    </section>
  )
}
