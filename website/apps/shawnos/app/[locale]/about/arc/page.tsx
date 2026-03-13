import type { Metadata } from 'next'
import { Link } from '../../../../i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'
import { PageHero, ScrollRevealSection } from '../../../WikiReveal'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutArc' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'plumber to tech',
      'SDR career path',
      'self-taught developer',
      'career transition into tech',
      'non-traditional tech background',
      'GTM engineer origin story',
      'sales development representative',
      'blue collar to software engineer',
      'build in public journey',
      'unconventional career path',
    ],
    alternates: { canonical: 'https://shawnos.ai/about/arc', languages: hreflang('/about/arc') },
    openGraph: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      url: 'https://shawnos.ai/about/arc',
      images: [{ url: '/og?title=The+Arc&subtitle=Plumber.+SDR.+GTM+Engineer.', width: 1200, height: 630 }],
    },
    twitter: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      images: ['/og?title=The+Arc&subtitle=Plumber.+SDR.+GTM+Engineer.'],
    },
  }
}

/* ── styles ───────────────────────────────────────── */

const section: React.CSSProperties = {
  marginBottom: '48px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}

const mutedText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '12px',
  transition: 'border-color 0.15s ease',
}

/* ── page ─────────────────────────────────────────── */

export default async function ArcPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('AboutArc')

  const layers = [
    {
      title: t('layers.plumber.title'),
      subtitle: t('layers.plumber.subtitle'),
      body: t('layers.plumber.body'),
      lesson: t('layers.plumber.lesson'),
    },
    {
      title: t('layers.sdr.title'),
      subtitle: t('layers.sdr.subtitle'),
      body: t('layers.sdr.body'),
      lesson: t('layers.sdr.lesson'),
    },
    {
      title: t('layers.gtmEngineer.title'),
      subtitle: t('layers.gtmEngineer.subtitle'),
      body: t('layers.gtmEngineer.body'),
      lesson: t('layers.gtmEngineer.lesson'),
    },
  ]

  const sites = [
    {
      name: t('threeSites.shawnos.name'),
      desc: t('threeSites.shawnos.description'),
      accent: 'var(--accent)',
    },
    {
      name: t('threeSites.gtmos.name'),
      desc: t('threeSites.gtmos.description'),
      accent: 'var(--gtmos-teal, #4ec3a0)',
    },
    {
      name: t('threeSites.contentos.name'),
      desc: t('threeSites.contentos.description'),
      accent: 'var(--contentos-purple, #a78bfa)',
    },
  ]

  const buildLinks = [
    { href: '/api', label: t('buildWithMe.theApi.label'), desc: t('buildWithMe.theApi.description') },
    { href: '/log/quests', label: t('buildWithMe.questBoard.label'), desc: t('buildWithMe.questBoard.description') },
    { href: '/log/build-your-own', label: t('buildWithMe.buildYourOwn.label'), desc: t('buildWithMe.buildYourOwn.description') },
    { href: '/log/skill-guide', label: t('buildWithMe.skillGuide.label'), desc: t('buildWithMe.skillGuide.description') },
  ]

  const socials = [
    { label: t('connect.linkedin'), url: 'https://linkedin.com/in/shawntenam' },
    { label: t('connect.xTwitter'), url: 'https://x.com/shawntenam' },
    { label: t('connect.substack'), url: 'https://shawntenam.substack.com' },
    { label: t('connect.github'), url: 'https://github.com/shawnla90' },
  ]

  return (
    <>
    <BreadcrumbSchema items={[{ name: 'About', url: 'https://shawnos.ai/about' }, { name: t('hero.title'), url: 'https://shawnos.ai/about/arc' }]} />

    <PageHero
      compact
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
    />

    {/* ── Intro ── */}
    <ScrollRevealSection background="var(--canvas)">
      <p style={paragraph}>
        {t('intro.line1')}
      </p>
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.75,
          color: 'var(--text-muted)',
          marginBottom: '12px',
          fontStyle: 'italic',
        }}
      >
        {t('intro.quote')}
      </p>
      <p style={paragraph}>{t('intro.line2')}</p>
      <p style={paragraph}>
        {t('intro.line3')}
      </p>
    </ScrollRevealSection>

    {/* ── The Layers ── */}
    <ScrollRevealSection background="var(--canvas-subtle)">
      <h2 style={sectionTitle}>{t('layers.heading')}</h2>

      <p style={{ ...mutedText, marginBottom: '20px' }}>
        {t('layers.description')}
      </p>

      {layers.map((layer) => (
        <div key={layer.title} style={card}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent)',
              }}
            >
              {layer.title}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                padding: '1px 8px',
                border: '1px solid var(--border)',
                borderRadius: '3px',
              }}
            >
              {layer.subtitle}
            </span>
          </div>
          <p style={{ ...mutedText, marginBottom: '12px' }}>{layer.body}</p>
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '10px',
              marginTop: '4px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                marginRight: '8px',
              }}
            >
              {t('layers.whatItTaughtMe')}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {layer.lesson}
            </span>
          </div>
        </div>
      ))}

      <p style={{ ...paragraph, marginTop: '16px', marginBottom: 0 }}>
        {t('layers.conclusion')}
      </p>
    </ScrollRevealSection>

    {/* ── The Thesis ── */}
    <ScrollRevealSection background="var(--canvas)">
      <h2 style={sectionTitle}>{t('thesis.heading')}</h2>

      <p style={{ ...paragraph, fontWeight: 600, color: 'var(--accent)' }}>
        {t('thesis.bold')}
      </p>

      <p style={paragraph}>
        {t('thesis.p1')}
      </p>

      <p style={paragraph}>
        {t('thesis.p2')}
      </p>

      <p style={paragraph}>
        {t('thesis.p3')}
      </p>

      <p style={{ ...paragraph, marginBottom: 0, color: 'var(--text-muted)' }}>
        {t('thesis.p4')}
      </p>
    </ScrollRevealSection>

    {/* ── Three Sites ── */}
    <ScrollRevealSection background="var(--canvas-subtle)">
      <h2 style={sectionTitle}>{t('threeSites.heading')}</h2>

      <p style={{ ...mutedText, marginBottom: '20px' }}>
        {t('threeSites.description')}
      </p>

      {sites.map((site) => (
        <div key={site.name} style={card}>
          <span
            style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: 700,
              color: site.accent,
              marginBottom: '6px',
            }}
          >
            {site.name}
          </span>
          <span style={mutedText}>{site.desc}</span>
        </div>
      ))}

      <p style={{ ...mutedText, marginTop: '16px' }}>
        {t('threeSites.footer')}
      </p>
    </ScrollRevealSection>

    {/* ── Build With Me ── */}
    <ScrollRevealSection background="var(--canvas)">
      <h2 style={sectionTitle}>{t('buildWithMe.heading')}</h2>

      <p style={{ ...paragraph, marginBottom: '20px' }}>
        {t('buildWithMe.description')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {buildLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label} &rarr;
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {link.desc}
            </span>
          </Link>
        ))}
      </div>
    </ScrollRevealSection>

    {/* ── Connect ── */}
    <ScrollRevealSection background="var(--canvas-subtle)">
      <h2 style={sectionTitle}>{t('connect.heading')}</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <Link
          href="/about"
          style={{
            display: 'inline-block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          &larr; {t('connect.backToAbout')}
        </Link>
      </div>
    </ScrollRevealSection>
    </>
  )
}
