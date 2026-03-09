import { Link } from '../i18n/navigation'
import { getTranslations } from 'next-intl/server'
import {
  PostCard,
  LogCard,
  SectionHeadline,
  FAQAccordion,
  ProcessSteps,
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
  DotGrid,
  GraphGrid,
  DashedCard,
  DarkInterlude,
} from '@shawnos/shared/components'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'
import { MEDIA_APPEARANCES } from '@shawnos/shared/data/media-appearances'
import { StatsStrip } from './StatsStrip'
import { BuiltWithStrip } from './BuiltWithStrip'
// CaseStudyGrid inlined below for per-card MotionReveal animation
import { WorkTogetherCTA } from './components/WorkTogetherCTA'

/* ── data ────────────────────────────────────────── */

const faqLinkStyle: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'none',
  fontWeight: 600,
}

/* ── types ───────────────────────────────────────── */

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
}

interface AvatarUrls {
  static?: string
  idle?: string
  action?: string
}

interface HomeContentProps {
  posts: Post[]
  latestLog: DailyLogSummary | null
  profile: RPGProfile | null
  avatarUrls: AvatarUrls | null
}

/* ── component ──────────────────────────────────── */

export async function HomeContent({ posts, latestLog }: HomeContentProps) {
  const t = await getTranslations('Home')

  const bootLines = [
    { status: 'OK', label: t('systemStatus.bootLines.contentEngine') },
    { status: 'OK', label: t('systemStatus.bootLines.threeSiteNetwork') },
    { status: 'OK', label: t('systemStatus.bootLines.gtmEngine') },
    { status: 'OK', label: t('systemStatus.bootLines.contentOs') },
    { status: 'OK', label: t('systemStatus.bootLines.cursorAgent') },
    { status: 'OK', label: t('systemStatus.bootLines.blogPipeline') },
    { status: 'OK', label: t('systemStatus.bootLines.buildInPublic') },
    { status: 'OK', label: t('systemStatus.bootLines.dailyTracker') },
  ]

  const processSteps = [
    {
      command: 'explore',
      title: t('method.explore.title'),
      description: t('method.explore.description'),
    },
    {
      command: 'plan',
      title: t('method.plan.title'),
      description: t('method.plan.description'),
    },
    {
      command: 'build',
      title: t('method.build.title'),
      description: t('method.build.description'),
    },
    {
      command: 'ship',
      title: t('method.ship.title'),
      description: t('method.ship.description'),
    },
    {
      command: 'compound',
      title: t('method.compound.title'),
      description: t('method.compound.description'),
    },
  ]

  const faqItems: { question: string; answer: React.ReactNode }[] = [
    {
      question: t('faq.q1.question'),
      answer: (
        <>
          {t('faq.q1.answer')}{' '}
          <Link href="https://thegtmos.ai" style={faqLinkStyle}>{t('faq.q1.link')} &rarr;</Link>
        </>
      ),
    },
    {
      question: t('faq.q2.question'),
      answer: (
        <>
          {t('faq.q2.answer')}{' '}
          <Link href="/showcase" style={faqLinkStyle}>{t('faq.q2.linkShowcase')}</Link>, a{' '}
          <Link href="/rpg-preview" style={faqLinkStyle}>{t('faq.q2.linkRpg')}</Link>, {t('faq.q2.answerCont')}
        </>
      ),
    },
    {
      question: t('faq.q3.question'),
      answer: (
        <>
          {t('faq.q3.answer')}{' '}
          <Link href="/log" style={faqLinkStyle}>{t('faq.q3.link')} &rarr;</Link>
        </>
      ),
    },
    {
      question: t('faq.q4.question'),
      answer: (
        <>
          {t('faq.q4.answer')}{' '}
          <Link href="/about" style={faqLinkStyle}>{t('faq.q4.link')} &rarr;</Link>
        </>
      ),
    },
    {
      question: t('faq.q5.question'),
      answer: (
        <>
          {t('faq.q5.answer')}{' '}
          <Link href="/log/build-your-own" style={faqLinkStyle}>{t('faq.q5.link')} &rarr;</Link>
        </>
      ),
    },
    {
      question: t('faq.q6.question'),
      answer: (
        <>
          {t('faq.q6.answer')}{' '}
          <Link href="/rpg-preview" style={faqLinkStyle}>{t('faq.q6.link')} &rarr;</Link>
        </>
      ),
    },
  ]

  const caseStudies = [
    {
      title: t('caseStudies.threeSiteNetwork.title'),
      description: t('caseStudies.threeSiteNetwork.description'),
      tags: ['Next.js', 'Turborepo', 'Vercel'],
      href: '/showcase',
    },
    {
      title: t('caseStudies.aiContentPipeline.title'),
      description: t('caseStudies.aiContentPipeline.description'),
      tags: ['Claude AI', 'Python', 'SEO'],
      href: '/blog',
    },
    {
      title: t('caseStudies.progressionEngine.title'),
      description: t('caseStudies.progressionEngine.description'),
      tags: ['Gamification', 'TypeScript', 'Pixel Art'],
      href: '/rpg-preview',
    },
    {
      title: t('caseStudies.missionControl.title'),
      description: t('caseStudies.missionControl.description'),
      tags: ['Dashboard', 'Real-time', 'React'],
      href: '/showcase',
    },
  ]

  const chooseYourPathItems = [
    { label: t('chooseYourPath.contentSystems.label'), href: 'https://thecontentos.ai', text: t('chooseYourPath.contentSystems.text') },
    { label: t('chooseYourPath.gtmPipelines.label'), href: 'https://thegtmos.ai', text: t('chooseYourPath.gtmPipelines.text') },
    { label: t('chooseYourPath.stackAudit.label'), href: 'https://thegtmos.ai/why-independent', text: t('chooseYourPath.stackAudit.text') },
    { label: t('chooseYourPath.readBlog.label'), href: '/blog', text: t('chooseYourPath.readBlog.text'), internal: true },
    { label: t('chooseYourPath.showcase.label'), href: '/showcase', text: t('chooseYourPath.showcase.text'), internal: true },
  ]

  return (
    <>
      {/* ── Hero — 100dvh, centered, bold ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--canvas)',
          position: 'relative',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <GraphGrid spacing={40} opacity={0.45} lineWidth={1} />
        <MotionReveal variant="fadeUp" delay={0.1}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              maxWidth: 900,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>{t('hero.titleLine1')}</span>{' '}
            <span style={{ color: 'var(--accent)' }}>{t('hero.titleLine2')}</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 40px',
            }}
          >
            {t('hero.subtitle')}
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.4}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <Link
                href="/blog"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
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
                {t('hero.ctaBlog')} &rarr;
              </Link>
            </MagneticHover>
            <MagneticHover>
              <Link
                href="/about"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                {t('hero.ctaAbout')}
              </Link>
            </MagneticHover>
          </div>
        </MotionReveal>

        {/* Scroll indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--text-muted)',
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 48,
          paddingBottom: 48,
        }}
      >
        <StatsStrip />
      </ScrollRevealSection>

      {/* ── Method ── */}
      <ScrollRevealSection background="var(--canvas-warm-subtle)" style={{ position: 'relative' }}>
        <GraphGrid spacing={48} opacity={0.35} lineWidth={1} />
        <SectionHeadline subtitle={t('method.subtitle')}>{t('method.headline')}</SectionHeadline>
        <ProcessSteps steps={processSteps} />
      </ScrollRevealSection>

      {/* ── Dark Interlude ── */}
      <DarkInterlude
        title={t('darkInterlude.title')}
        subtitle={t('darkInterlude.subtitle')}
      />

      {/* ── Latest Posts ── */}
      {posts.length > 0 && (
        <ScrollRevealSection background="var(--canvas)">
          <SectionHeadline subtitle={t('latestPosts.subtitle')}>{t('latestPosts.headline')}</SectionHeadline>

          {/* Featured first post */}
          {posts[0] && (
            <MotionReveal variant="fadeUp" delay={0.05}>
              <div style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 20,
                marginBottom: 24,
              }}>
                <PostCard
                  title={posts[0].title}
                  date={posts[0].date}
                  excerpt={posts[0].excerpt}
                  slug={posts[0].slug}
                />
              </div>
            </MotionReveal>
          )}

          {/* Remaining posts in 2-col grid */}
          {posts.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16,
            }}>
              {posts.slice(1).map((post, i) => (
                <MotionReveal key={post.slug} variant="fadeUp" delay={0.1 + i * 0.08}>
                  <PostCard
                    title={post.title}
                    date={post.date}
                    excerpt={post.excerpt}
                    slug={post.slug}
                  />
                </MotionReveal>
              ))}
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <Link
              href="/blog"
              style={{
                fontSize: '15px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('latestPosts.viewAll')} &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── Latest Log ── */}
      {latestLog && (
        <ScrollRevealSection background="var(--canvas-subtle)">
          <SectionHeadline subtitle={t('latestLog.subtitle')}>{t('latestLog.headline')}</SectionHeadline>

          <LogCard {...latestLog} basePath="/log" />

          <div style={{ marginTop: 24 }}>
            <Link
              href="/log"
              style={{
                fontSize: '15px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('latestLog.viewAll')} &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── FAQ ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle={t('faq.subtitle')}>{t('faq.headline')}</SectionHeadline>
        <FAQAccordion items={faqItems} />
      </ScrollRevealSection>

      {/* ── Case Studies ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle={t('caseStudies.subtitle')}>{t('caseStudies.headline')}</SectionHeadline>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {caseStudies.map((study, i) => (
            <MotionReveal key={study.title} variant="scale" delay={i * 0.1}>
              <Link
                href={study.href}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className="case-study-card">
                  <div style={{
                    fontSize: '16px', fontWeight: 600,
                    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                    marginBottom: 8,
                  }}>
                    {study.title}
                  </div>
                  <div style={{
                    fontSize: '14px', color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', lineHeight: 1.6, marginBottom: 12,
                  }}>
                    {study.description}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {study.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: '11px', fontFamily: 'var(--font-mono)',
                        padding: '2px 8px', borderRadius: 4,
                        background: 'rgba(78, 195, 115, 0.1)',
                        color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </ScrollRevealSection>

      {/* ── As Heard On ── */}
      {MEDIA_APPEARANCES.length > 0 && (
        <ScrollRevealSection background="var(--canvas)">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              padding: '20px 24px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {t('asHeardOn')}
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              {MEDIA_APPEARANCES.map((appearance) => (
                <a
                  key={appearance.id}
                  href={appearance.links[0]?.url ?? '/media'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--canvas)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                    }}
                  >
                    {'\u{1F399}\u{FE0F}'}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      maxWidth: 80,
                      lineHeight: 1.2,
                    }}
                  >
                    {appearance.show}
                  </span>
                </a>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: 0 }} />

            <Link
              href="/media"
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                opacity: 0.8,
              }}
            >
              {t('allAppearances')} &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── Work Together CTA ── */}
      <ScrollRevealSection background="var(--canvas)">
        <WorkTogetherCTA />
      </ScrollRevealSection>

      {/* ── Boot Log — keeps terminal flavor ── */}
      <ScrollRevealSection background="var(--canvas)">
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {t('systemStatus.heading')}
        </h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <StaggerContainer stagger={0.08}>
            {bootLines.map((line) => (
              <StaggerItem key={line.label}>
                <div
                  style={{
                    fontSize: '13px',
                    lineHeight: 2,
                    color: 'var(--text-secondary)',
                  }}
                >
                  [<span style={{ color: 'var(--accent)', fontWeight: 600 }}>{line.status}</span>] {line.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            {t('systemStatus.allOperational')}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── Built With ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <BuiltWithStrip />
      </ScrollRevealSection>

      {/* ── Choose Your Path CTA ── */}
      <ScrollRevealSection background="var(--canvas)" variant="scale">
        <div
          style={{
            padding: '40px 32px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 32px',
            }}
          >
            {t('chooseYourPath.heading')}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            {chooseYourPathItems.map((item) => {
              const LinkEl = item.internal ? Link : 'a'
              return (
                <LinkEl
                  key={item.text}
                  href={item.href}
                  {...(!item.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    display: 'block',
                    padding: '20px 16px',
                    background: 'var(--canvas)',
                    border: '1px dashed var(--border-dashed)',
                    borderRadius: 12,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.text} &rarr;
                  </div>
                </LinkEl>
              )
            })}
          </div>
        </div>
      </ScrollRevealSection>
    </>
  )
}
