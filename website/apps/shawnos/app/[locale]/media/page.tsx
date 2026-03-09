import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { MEDIA_APPEARANCES } from '@shawnos/shared/data/media-appearances'
import type { MediaAppearance } from '@shawnos/shared/data/media-appearances'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero } from '../../components/PageHero'
import { ScrollRevealSection, StatsStagger, StatItem } from '../updates/UpdatesReveal'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Media')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'shawn tenam podcast',
      'shawn tenam interview',
      'gtm engineering podcast',
      'ai agent podcast',
      'build in public podcast',
      'outbound wizards podcast',
      'salesrobot podcast',
      'shawnos media',
      'gtm engineer appearances',
      'shawn tenam speaking',
    ],
    alternates: {
      canonical: `${SITE_URL}/media`,
    },
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: `${SITE_URL}/media`,
      images: [
        {
          url: `/og?title=${encodeURIComponent('Media')}&subtitle=${encodeURIComponent('Podcasts, Interviews & Appearances')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: [
        `/og?title=${encodeURIComponent('Media')}&subtitle=${encodeURIComponent('Podcasts, Interviews & Appearances')}`,
      ],
    },
  }
}

/* ── helpers ───────────────────────────────────────── */

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const categoryColors: Record<MediaAppearance['category'], string> = {
  podcast: '#c084fc',
  interview: '#60a5fa',
  panel: '#4ade80',
  speaking: '#facc15',
  article: '#fb923c',
}

function platformIcon(platform: string): string {
  const lower = platform.toLowerCase()
  if (lower.includes('apple')) return '\u{1F34E}'
  if (lower.includes('spotify')) return '\u{1F3B5}'
  if (lower.includes('youtube')) return '\u{25B6}\u{FE0F}'
  return '\u{1F517}'
}

/* ── styles ────────────────────────────────────────── */

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const statNum: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const typeBadge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '9px',
  fontWeight: 700,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '3px',
  padding: '1px 6px',
  marginBottom: '6px',
  letterSpacing: '0.06em',
})

const featuredCard: React.CSSProperties = {
  padding: '24px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--accent)',
  borderRadius: '8px',
  marginBottom: '16px',
}

const featuredTitle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '4px',
  lineHeight: 1.3,
}

const featuredShow: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '8px',
}

const featuredDesc: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const topicTag: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '3px',
  padding: '2px 8px',
  letterSpacing: '0.04em',
}

const linkButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '8px 16px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
}

const timelineScroll: React.CSSProperties = {
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: '12px',
  marginBottom: '8px',
}

const timelineTrack: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  minWidth: 'max-content',
}

const timelineCard: React.CSSProperties = {
  flex: '0 0 300px',
  padding: '16px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
}

const timelineDate: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: '6px',
}

const timelineTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '4px',
  lineHeight: 1.3,
}

const timelineShow: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '6px',
}

const timelineDesc: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const scrollHint: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  textAlign: 'right',
}

const backlinkNote: React.CSSProperties = {
  padding: '16px 20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
}

const navRow: React.CSSProperties = {
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
}

const navLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── JSON-LD ──────────────────────────────────────── */

function buildPodcastSchema(appearance: MediaAppearance) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: appearance.title,
    description: appearance.description,
    datePublished: appearance.date,
    duration: appearance.duration,
    url: `${SITE_URL}/media`,
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: appearance.show,
    },
    performer: {
      '@type': 'Person',
      name: 'Shawn Tenam',
      url: SITE_URL,
    },
    ...(appearance.host
      ? {
          creator: {
            '@type': 'Person',
            name: appearance.host,
          },
        }
      : {}),
  }
}

/* ── page component (server) ─────────────────────── */

export default async function MediaPage() {
  const t = await getTranslations('Media')
  const featured = MEDIA_APPEARANCES.find((a) => a.featured)
  const allAppearances = [...MEDIA_APPEARANCES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const uniquePlatforms = new Set(
    MEDIA_APPEARANCES.flatMap((a) => a.links.map((l) => l.platform))
  )

  const latestDate = allAppearances[0]?.date
    ? formatDate(allAppearances[0].date)
    : 'N/A'

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Media', url: `${SITE_URL}/media` },
        ]}
      />

      {MEDIA_APPEARANCES.filter((a) => a.category === 'podcast').map((a) => (
        <script
          key={a.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPodcastSchema(a)) }}
        />
      ))}

      {/* Hero */}
      <PageHero
        compact
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />

      {/* Stats */}
      <ScrollRevealSection background="var(--canvas)">
        <StatsStagger>
          <StatItem>
            <div style={statBox}>
              <span style={statNum}>{MEDIA_APPEARANCES.length}</span>
              <span style={statLabel}>{t('stats.appearances')}</span>
            </div>
          </StatItem>
          <StatItem>
            <div style={statBox}>
              <span style={statNum}>{uniquePlatforms.size}</span>
              <span style={statLabel}>{t('stats.platforms')}</span>
            </div>
          </StatItem>
          <StatItem>
            <div style={statBox}>
              <span style={statNum}>{latestDate}</span>
              <span style={statLabel}>{t('stats.latest')}</span>
            </div>
          </StatItem>
        </StatsStagger>
      </ScrollRevealSection>

      {/* Featured Appearance */}
      {featured && (
        <ScrollRevealSection background="var(--canvas-subtle)">
          <div style={sectionTitle}>{t('sections.featured')}</div>
          <div style={featuredCard}>
            <div style={typeBadge(categoryColors[featured.category])}>
              {t(`categories.${featured.category}`)}
            </div>
            <div style={featuredTitle}>{featured.title}</div>
            <div style={featuredShow}>
              {featured.show} &middot; {featured.host} &middot; {formatDate(featured.date)} &middot; {featured.duration}
            </div>
            <div style={featuredDesc}>{featured.description}</div>

            {/* Topics */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {featured.topics.map((topic) => (
                <span key={topic} style={topicTag}>{topic}</span>
              ))}
            </div>

            {/* Listen Links */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {featured.links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkButton}
                >
                  <span>{platformIcon(link.platform)}</span>
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </ScrollRevealSection>
      )}

      {/* All Appearances Timeline */}
      <ScrollRevealSection background="var(--canvas)">
        <div style={sectionTitle}>{t('sections.allAppearances')}</div>

        <div style={timelineScroll}>
          <div style={timelineTrack}>
            {allAppearances.map((appearance) => {
              const catColor = categoryColors[appearance.category]
              return (
                <div key={appearance.id} style={timelineCard}>
                  <div style={typeBadge(catColor)}>{t(`categories.${appearance.category}`)}</div>
                  <div style={timelineDate}>{formatDate(appearance.date)}</div>
                  <div style={timelineTitle}>{appearance.title}</div>
                  <div style={timelineShow}>
                    {appearance.show} &middot; {appearance.host}
                  </div>
                  <div style={timelineDesc}>{appearance.description}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {appearance.links.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...linkButton,
                          fontSize: '11px',
                          padding: '6px 12px',
                        }}
                      >
                        <span>{platformIcon(link.platform)}</span>
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {allAppearances.length > 2 && <div style={scrollHint}>scroll &rarr;</div>}
      </ScrollRevealSection>

      {/* Backlink Note */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div style={backlinkNote}>
          <strong style={{ color: 'var(--text-primary)' }}>{t('backlink.heading')}</strong>{' '}
          Link back to{' '}
          <a
            href={`${SITE_URL}/media`}
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            shawnos.ai/media
          </a>{' '}
          in your show notes. This is the canonical URL for all of Shawn&apos;s media appearances.
          Want to have Shawn on your show? Reach out on{' '}
          <a
            href="https://linkedin.com/in/shawntenam"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            LinkedIn
          </a>
          .
        </div>
      </ScrollRevealSection>

      {/* Navigation */}
      <ScrollRevealSection background="var(--canvas)">
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; {t('nav.home')}
          </Link>
          <Link href="/about" style={navLink}>
            {t('nav.about')} &rarr;
          </Link>
        </div>
      </ScrollRevealSection>
    </>
  )
}
