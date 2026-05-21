'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Link } from '../i18n/navigation'
import {
  BentoGrid,
  BentoGridItem,
  GlowingEffect,
  FloatingDock,
} from '@shawnos/shared/components/ui'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'

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
        marginBottom: '24px',
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

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
}

interface HomeContentProps {
  posts: Post[]
  latestLog: DailyLogSummary | null
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.95 10.95 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zm13.5 12.27h-3v-5.5c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.43-2.12 2.92v5.6h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z" />
  </svg>
)
const SubstackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
)
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M20.32 4.37A19.79 19.79 0 0 0 16.06 3a14.7 14.7 0 0 0-.66 1.35 18.27 18.27 0 0 0-5.4 0A14.7 14.7 0 0 0 9.34 3 19.79 19.79 0 0 0 5.08 4.37 21 21 0 0 0 1.5 18.61a19.96 19.96 0 0 0 6.04 3.05c.49-.66.92-1.36 1.29-2.09a13.05 13.05 0 0 1-2.03-.97c.17-.13.34-.26.5-.4a14.27 14.27 0 0 0 12.4 0c.16.14.33.27.5.4-.65.38-1.33.71-2.04.97.37.73.8 1.43 1.29 2.09a19.94 19.94 0 0 0 6.05-3.05 21 21 0 0 0-3.58-14.24zM8.52 15.7c-1.18 0-2.16-1.1-2.16-2.45 0-1.35.95-2.46 2.16-2.46s2.18 1.11 2.16 2.46c0 1.35-.95 2.45-2.16 2.45zm6.96 0c-1.18 0-2.16-1.1-2.16-2.45 0-1.35.95-2.46 2.16-2.46s2.18 1.11 2.16 2.46c0 1.35-.95 2.45-2.16 2.45z" />
  </svg>
)

const socials = [
  { title: 'X', icon: <XIcon />, href: 'https://x.com/shawntenam' },
  { title: 'GitHub', icon: <GithubIcon />, href: 'https://github.com/shawnla90' },
  { title: 'LinkedIn', icon: <LinkedInIcon />, href: 'https://linkedin.com/in/shawntenam' },
  { title: 'Substack', icon: <SubstackIcon />, href: 'https://shawntenam.substack.com' },
  { title: 'Discord', icon: <DiscordIcon />, href: 'https://discord.gg/6eKe49nth' },
]

const tileBase =
  'group/bento relative row-span-1 flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--canvas-subtle)] transition duration-200 hover:border-[var(--accent)]/40 overflow-hidden'

export function HomeContent({ posts, latestLog }: HomeContentProps) {
  return (
    <section style={{ position: 'relative', padding: '40px 24px 120px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
        <header style={{ marginBottom: '32px', maxWidth: '720px' }}>
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
            Shawn Tenam
          </h1>
          <p
            style={{
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              maxWidth: '560px',
            }}
          >
            GTM engineer. Building AI-native pipelines, content systems, and the front end of how
            B2B finds its market.
          </p>
        </header>

        <ComingSoonStrip />

        <BentoGrid className="md:grid-cols-3 md:auto-rows-[14rem]">
          {/* Clearbox — 2x2 hero (clean, no glow/ripple/orange) */}
          <BentoGridItem
            className={`${tileBase} md:col-span-2 md:row-span-2`}
            header={
              <Link
                href={'/clearbox' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  height: '100%',
                  width: '100%',
                  padding: '32px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <Image
                    src="/clearbox/aura-logo.png"
                    alt="Clearbox"
                    width={56}
                    height={56}
                    style={{ marginBottom: '20px', opacity: 0.95 }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Now shipping →
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(28px, 3.4vw, 44px)',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Clearbox
                  </h2>
                  <p
                    style={{
                      marginTop: '10px',
                      fontSize: '17px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      maxWidth: '420px',
                    }}
                  >
                    See your market. Move first.
                  </p>
                </div>
              </Link>
            }
          />

          {/* Context Engineering — 1x2 */}
          <BentoGridItem
            className={`${tileBase} md:row-span-2`}
            header={
              <Link
                href={'/context-wiki' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  padding: '24px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={48} disabled={false} />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    $ wiki
                  </div>
                  <h3
                    style={{
                      marginTop: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Context Engineering
                  </h3>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7 }}>
                  <div style={{ color: 'var(--text-muted)' }}>&gt; cat CLAUDE.md</div>
                  <div style={{ color: 'var(--text-secondary)' }}>// memory shapes output</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>&gt; ls skills/</div>
                  <div style={{ color: 'var(--text-secondary)' }}>// agents that compound</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>&gt; explore →</div>
                </div>
              </Link>
            }
          />

          {/* Reddit Growth Playbook — 2x1 */}
          <BentoGridItem
            className={`${tileBase} md:col-span-2`}
            header={
              <Link
                href={'/reddit' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  height: '100%',
                  width: '100%',
                  padding: '24px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={48} disabled={false} />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Reddit Growth Playbook
                  </div>
                  <h3
                    style={{
                      marginTop: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                      maxWidth: '320px',
                    }}
                  >
                    Zero to a community in 30 days
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(40px, 5vw, 64px)',
                      fontWeight: 800,
                      lineHeight: 1,
                      color: 'var(--accent)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    1,089
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                    }}
                  >
                    karma · 30 days
                  </div>
                </div>
              </Link>
            }
          />

          {/* Blog — 2x1 latest 3 */}
          <BentoGridItem
            className={`${tileBase} md:col-span-2`}
            header={
              <Link
                href={'/blog' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  width: '100%',
                  padding: '24px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={48} disabled={false} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  Blog · latest
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {posts.slice(0, 3).map((post) => (
                    <li key={post.slug} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', minWidth: '72px' }}>
                        {post.date}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.35 }}>
                        {post.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </Link>
            }
          />

          {/* How-To — 1x1 */}
          <BentoGridItem
            className={tileBase}
            header={
              <Link
                href={'/how-to' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={36} disabled={false} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Playbooks
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}
                >
                  How-To <span style={{ color: 'var(--accent)' }}>→</span>
                </h3>
              </Link>
            }
          />

          {/* Cloud Code Daily — 1x1 */}
          <BentoGridItem
            className={tileBase}
            header={
              <Link
                href={'/claude-daily' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={36} disabled={false} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Cloud Code Daily
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {latestLog
                      ? `${latestLog.date} · grade ${latestLog.letter_grade} · ${latestLog.accomplishment_count} ships`
                      : 'Multi-subreddit pulse, daily.'}
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                    }}
                  >
                    Read latest →
                  </div>
                </div>
              </Link>
            }
          />

          {/* Founder's Journey — 1x1 */}
          <BentoGridItem
            className={tileBase}
            header={
              <Link
                href={'/about/arc' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={36} disabled={false} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Founder&apos;s journey
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  &ldquo;Trades to tech. SDR to engineer. Still shipping.&rdquo;
                </p>
              </Link>
            }
          />

          {/* Build / Showcase — 1x1 */}
          <BentoGridItem
            className={tileBase}
            header={
              <Link
                href={'/build' as never}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 'inherit',
                }}
              >
                <GlowingEffect variant="silver" glow proximity={36} disabled={false} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Build · live
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    What I&apos;m shipping this week.
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                    }}
                  >
                    See current →
                  </div>
                </div>
              </Link>
            }
          />
        </BentoGrid>
      </div>

      <FloatingDock
        items={socials}
        desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        mobileClassName="fixed bottom-6 right-6 z-40"
      />
    </section>
  )
}
