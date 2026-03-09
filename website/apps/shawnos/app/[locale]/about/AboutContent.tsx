'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
  SectionHeadline,
} from '@shawnos/shared/components'
import { PageHero } from '../../components/PageHero'
import { TechStackGrid } from './TechStackGrid'

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}
const mutedText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

export function AboutContent() {
  const t = useTranslations('About')

  const network = [
    {
      label: t('network.gtmos.label'),
      url: 'https://thegtmos.ai',
      accent: 'var(--gtmos-teal)',
      desc: t('network.gtmos.description'),
    },
    {
      label: t('network.contentos.label'),
      url: 'https://thecontentos.ai',
      accent: 'var(--contentos-purple)',
      desc: t('network.contentos.description'),
    },
  ]

  const socials = [
    { label: t('connect.linkedin'), url: 'https://linkedin.com/in/shawntenam' },
    { label: t('connect.xTwitter'), url: 'https://x.com/shawntenam' },
    { label: t('connect.substack'), url: 'https://shawntenam.substack.com' },
    { label: t('connect.github'), url: 'https://github.com/shawnla90' },
  ]

  return (
    <>
      <PageHero
        compact
        title={t('hero.title')}
        titleAccent={t('hero.titleAccent')}
        subtitle={t('hero.subtitle')}
      />

      {/* Identity */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle={t('identity.subtitle')}>{t('identity.headline')}</SectionHeadline>
        <p style={paragraph}>
          {t('identity.paragraph')}
        </p>
      </ScrollRevealSection>

      {/* Tech Stack */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle={t('techStack.subtitle')}>{t('techStack.headline')}</SectionHeadline>
        <TechStackGrid />
      </ScrollRevealSection>

      {/* The Network */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle={t('network.subtitle')}>{t('network.headline')}</SectionHeadline>
        <p style={{ ...mutedText, marginBottom: '16px' }}>
          {t('network.description')}
        </p>
        <StaggerContainer stagger={0.1} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {network.map((site) => (
            <StaggerItem key={site.label}>
              <MagneticHover strength={0.15} style={{ display: 'block' }}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '16px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: site.accent,
                      marginBottom: '6px',
                    }}
                  >
                    {site.label} &rarr;
                  </span>
                  <span style={mutedText}>{site.desc}</span>
                </a>
              </MagneticHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* Connect */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline>{t('connect.headline')}</SectionHeadline>
        <StaggerContainer stagger={0.06} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {socials.map((s) => (
            <StaggerItem key={s.label}>
              <MagneticHover>
                <a
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
                    display: 'inline-block',
                  }}
                >
                  {s.label}
                </a>
              </MagneticHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* Showcase CTA */}
      <ScrollRevealSection background="var(--canvas)" variant="scale">
        <div
          style={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {t('showcaseCta.title')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {t('showcaseCta.description')}
            </div>
          </div>
          <MagneticHover>
            <Link
              href="/showcase"
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                borderRadius: 6,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('showcaseCta.button')} &rarr;
            </Link>
          </MagneticHover>
        </div>
      </ScrollRevealSection>

      {/* Arc CTA */}
      <ScrollRevealSection background="var(--canvas-subtle)" variant="scale">
        <div
          style={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>
            {t('arcCta.title')}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {t('arcCta.description')}
          </p>
          <MagneticHover>
            <Link
              href="/about/arc"
              style={{
                display: 'inline-block',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: 'var(--canvas)',
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 6,
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
            >
              {t('arcCta.button')} &rarr;
            </Link>
          </MagneticHover>
        </div>
      </ScrollRevealSection>
    </>
  )
}
