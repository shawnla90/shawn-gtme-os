import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { setRequestLocale } from 'next-intl/server'
import { getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { Link } from '../../../i18n/navigation'

const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

function getContentDir(locale: string) {
  const localeDir = path.join(CONTENT_BASE, locale)
  if (locale !== 'en' && fs.existsSync(localeDir)) return localeDir
  return CONTENT_BASE
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Shows | shawnos.ai'
  const description =
    'Two shows, one engine. Claude Code Daily every weekday, Level Up GTM every Friday. Reddit-mined, narrator-hosted, zero filler.'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://shawnos.ai/shows',
      languages: hreflang('/shows'),
    },
    openGraph: {
      title,
      description,
      url: 'https://shawnos.ai/shows',
      images: [{ url: '/og?title=Shows&subtitle=daily+and+weekly', width: 1200, height: 630 }],
    },
    twitter: { title, description, images: ['/og?title=Shows&subtitle=daily+and+weekly'] },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ShowsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const allPosts = getAllPosts(getContentDir(locale))
  const dailyCount = allPosts.filter((p) => p.category === 'claude-daily').length
  const weeklyCount = allPosts.filter((p) => p.category === 'level-up-gtm').length

  const shows = [
    {
      href: '/claude-daily',
      kicker: 'daily · mon-fri + weekend edition',
      title: 'Claude Code Daily',
      blurb:
        'The daily show for Claude Code builders. News, repos, roasts, and the Reddit comments you missed. Repo of the day, best comment award, troll of the day.',
      count: `${dailyCount} episodes`,
    },
    {
      href: '/level-up-gtm',
      kicker: 'weekly · fridays',
      title: 'Level Up GTM',
      blurb:
        'The weekly GTM show, mined from the lead-gen and GTM engineering subreddits. Prospecting tool of the week, what worked, what faceplanted, and the thread where operators actually helped someone.',
      count: weeklyCount > 0 ? `${weeklyCount} episodes` : 'episode 001 loading',
    },
  ]

  const card: React.CSSProperties = {
    display: 'block',
    padding: '28px',
    background: 'var(--canvas-subtle)',
    border: '1px solid var(--canvas-border)',
    borderRadius: 'var(--radius-lg)',
    textDecoration: 'none',
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Shows', url: 'https://shawnos.ai/shows' }]} />
      <section className="full-bleed" style={{ padding: '72px 24px 12px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(34px, 5vw, 54px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--text-primary)',
              margin: '0 0 10px',
            }}
          >
            Shows
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, maxWidth: 540 }}>
            Two shows, one engine. A narrator reads the subreddits so you get the signal
            with the entertainment included. Pick your cadence.
          </p>
        </div>
      </section>

      <section style={{ padding: '32px 24px 96px', maxWidth: 960, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {shows.map((s) => (
            <Link key={s.href} href={s.href} style={card}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 12,
                }}
              >
                {s.kicker}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 10 }}>
                {s.title}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                {s.blurb}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{s.count}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  watch the feed →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
