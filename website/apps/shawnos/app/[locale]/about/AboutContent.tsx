'use client'

import { Link } from '../../../i18n/navigation'
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
import { ShortEmbed } from '../../components/ShortEmbed'
import { TechStackGrid } from './TechStackGrid'
import ContributionGraph from '../../../components/smoothui/contribution-graph'
import contributionsRaw from '@shawnos/shared/data/github-contributions.json'

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

  const contribYear = parseInt(contributionsRaw.pulledAt.slice(0, 4), 10)
  const contribDays = contributionsRaw.days.filter((d) => d.date.startsWith(String(contribYear)))

  const network = [
    {
      label: 'Clearbox',
      url: 'https://clearbox.to',
      accent: 'var(--aura-strong)',
      desc: 'See your market. Move first.',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/shawnla90',
      accent: 'var(--text-primary)',
      desc: 'The source. Agents, skills, pipelines, and this site, readable end to end.',
    },
  ]

  const socials = [
    { label: t('connect.linkedin'), url: 'https://linkedin.com/in/shawntenam' },
    { label: t('connect.xTwitter'), url: 'https://x.com/shawntenam' },
    { label: t('connect.reddit'), url: 'https://reddit.com/r/GTMBuilders' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatars/shawn.jpg"
            alt="Shawn Tenam"
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--border)',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <SectionHeadline subtitle={t('identity.subtitle')}>{t('identity.headline')}</SectionHeadline>
          </div>
        </div>
        <p style={paragraph}>
          {t('identity.paragraph')}
        </p>
      </ScrollRevealSection>

      {/* The human */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}
        >
          {'// the human'}
        </div>
        <p style={{ ...paragraph, maxWidth: '620px' }}>
          tech founder + anime nerd. sixty seconds of the person behind the commits.
        </p>
        <ShortEmbed videoId="il2iJFcFXWU" title="tech founder + anime nerd" />
      </ScrollRevealSection>

      {/* Built in public — the highlight */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="the receipts">built in public</SectionHeadline>
        <p style={{ ...paragraph, maxWidth: '620px' }}>
          Every commit, campaign, and content run happens in the open. The contribution graph is real.
        </p>
        <div style={{ overflowX: 'auto', paddingBottom: 8, margin: '20px 0 24px' }}>
          <ContributionGraph data={contribDays} year={contribYear} showLegend showTooltips />
        </div>
        <MagneticHover>
          <Link
            href="/built"
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
            }}
          >
            See the build &rarr;
          </Link>
        </MagneticHover>
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
