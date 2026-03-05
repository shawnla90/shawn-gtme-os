import Link from 'next/link'
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
} from '@shawnos/shared/components'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'
import { MEDIA_APPEARANCES } from '@shawnos/shared/data/media-appearances'
import { StatsStrip } from './StatsStrip'
import { BuiltWithStrip } from './BuiltWithStrip'
import { CaseStudyGrid } from './components/CaseStudyCard'
import { WorkTogetherCTA } from './components/WorkTogetherCTA'

/* ── data ────────────────────────────────────────── */

const bootLines = [
  { status: 'OK', label: 'content engine ... online' },
  { status: 'OK', label: 'three-site network ... synced' },
  { status: 'OK', label: 'gtm engine ... theGTMOS.ai' },
  { status: 'OK', label: 'content os ... theContentOS.ai' },
  { status: 'OK', label: 'cursor agent ... active' },
  { status: 'OK', label: 'blog pipeline ... mounted' },
  { status: 'OK', label: 'build-in-public mode ... engaged' },
  { status: 'OK', label: 'daily tracker ... streaming' },
]

const processSteps = [
  {
    command: 'explore',
    title: 'Explore',
    description: 'Audit the landscape. Find where the pipeline leaks, what content gaps exist, and where automation can replace manual work.',
  },
  {
    command: 'plan',
    title: 'Plan',
    description: 'Map the build order. Define what ships this week, what compounds over time, and what gets cut.',
  },
  {
    command: 'build',
    title: 'Build',
    description: 'Ship real infrastructure. Code the pipelines, write the content, wire the automations. Every piece lives in the monorepo.',
  },
  {
    command: 'ship',
    title: 'Ship',
    description: 'Push to production. Every commit deploys. Every post publishes. No staging purgatory — build, test, ship.',
  },
  {
    command: 'compound',
    title: 'Compound',
    description: 'Let it stack. SEO compounds. Content libraries grow. Automations run while you sleep. The system gets stronger every day.',
  },
]

const faqLinkStyle: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'none',
  fontWeight: 600,
}

const faqItems: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What is GTM engineering?',
    answer: (
      <>
        GTM engineering is the practice of building go-to-market systems with code. Instead of clicking through CRMs and spreadsheets, you write pipelines, automate outbound, build enrichment workflows, and ship content systems — all version-controlled and composable.{' '}
        <Link href="https://thegtmos.ai" style={faqLinkStyle}>explore the GTM playbook &rarr;</Link>
      </>
    ),
  },
  {
    question: 'What is ShawnOS?',
    answer: (
      <>
        ShawnOS is a monorepo that runs my entire professional operating system.{' '}
        <Link href="/showcase" style={faqLinkStyle}>Three websites</Link>, a{' '}
        <Link href="/rpg-preview" style={faqLinkStyle}>progression engine</Link>, AI agents, content pipelines, and GTM tools — all in one codebase. It&apos;s an experiment in running your career like a software product.
      </>
    ),
  },
  {
    question: 'Why build in public?',
    answer: (
      <>
        Building in public turns your learning process into content, your commits into proof of work, and your failures into lessons others can learn from. It compounds — every post, every update, every shipped feature is a permanent artifact that builds trust over time.{' '}
        <Link href="/log" style={faqLinkStyle}>see the build log &rarr;</Link>
      </>
    ),
  },
  {
    question: 'What stack does this run on?',
    answer: (
      <>
        TypeScript monorepo with Next.js (3 sites on Vercel), Python for scripting and content generation, Claude AI for the agent layer, and launchd crons for automation. Everything ships from one git repo.{' '}
        <Link href="/about" style={faqLinkStyle}>see the full stack &rarr;</Link>
      </>
    ),
  },
  {
    question: 'Can I use this approach for my own career?',
    answer: (
      <>
        Absolutely. The core idea — treat your career like a product, ship artifacts daily, automate what you can, and let everything compound — works for any discipline. You don&apos;t need this exact stack. You need the mindset of systematic, visible output.{' '}
        <Link href="/log/build-your-own" style={faqLinkStyle}>start building &rarr;</Link>
      </>
    ),
  },
  {
    question: 'What\'s the progression engine?',
    answer: (
      <>
        A gamification layer that tracks real daily output — blog posts, code commits, shipped features — and converts them to XP. You level up through 11 tiers with evolving pixel art avatars. It&apos;s not decorative; it reflects actual work done.{' '}
        <Link href="/rpg-preview" style={faqLinkStyle}>see the tiers &rarr;</Link>
      </>
    ),
  },
]

const caseStudies = [
  {
    title: 'Three-Site Network',
    description: 'One monorepo powering ShawnOS.ai, theGTMOS.ai, and theContentOS.ai. Shared components, shared data layer, independent deploys.',
    tags: ['Next.js', 'Turborepo', 'Vercel'],
    href: '/showcase',
  },
  {
    title: 'AI Content Pipeline',
    description: 'Automated blog generation with Claude + SEO keyword research + automated publishing. Runs on a daily cron, writes drafts for human review.',
    tags: ['Claude AI', 'Python', 'SEO'],
    href: '/blog',
  },
  {
    title: 'Progression Engine',
    description: '11-tier RPG system that gamifies real work output. Pixel art avatars evolve based on XP earned from daily commits and content shipped.',
    tags: ['Gamification', 'TypeScript', 'Pixel Art'],
    href: '/rpg-preview',
  },
  {
    title: 'Mission Control',
    description: 'Internal dashboard for monitoring all systems — agent status, content pipelines, SEO metrics, and team coordination.',
    tags: ['Dashboard', 'Real-time', 'React'],
    href: '/showcase',
  },
]

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

export function HomeContent({ posts, latestLog }: HomeContentProps) {
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
            <span style={{ color: 'var(--text-primary)' }}>GTM Engineering,</span>{' '}
            <span style={{ color: 'var(--accent)' }}>Built in Public</span>
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
            One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.
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
                read the blog &rarr;
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
                about
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
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="How everything gets built">The Method</SectionHeadline>
        <ProcessSteps steps={processSteps} />
      </ScrollRevealSection>

      {/* ── Latest Posts ── */}
      {posts.length > 0 && (
        <ScrollRevealSection background="var(--canvas)">
          <SectionHeadline subtitle="What shipped recently">Latest Posts</SectionHeadline>

          <StaggerContainer stagger={0.1}>
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <PostCard
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  slug={post.slug}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

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
              view all posts &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── Latest Log ── */}
      {latestLog && (
        <ScrollRevealSection background="var(--canvas-subtle)">
          <SectionHeadline subtitle="Today's build log">Latest Log</SectionHeadline>

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
              view all logs &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── FAQ ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="Common questions answered">FAQ</SectionHeadline>
        <FAQAccordion items={faqItems} />
      </ScrollRevealSection>

      {/* ── Case Studies ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="Featured projects from the monorepo">Case Studies</SectionHeadline>
        <CaseStudyGrid studies={caseStudies} />
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
              as heard on
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
              all appearances &rarr;
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
          system status
        </h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <StaggerContainer stagger={0.05}>
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
            &gt; all systems operational_
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
            Choose Your Path
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
            {[
              { label: 'Building content systems?', href: 'https://thecontentos.ai', text: 'theContentOS.ai' },
              { label: 'Building GTM pipelines?', href: 'https://thegtmos.ai', text: 'theGTMOS.ai' },
              { label: 'Want to see how it works?', href: '/blog', text: 'Read the Blog', internal: true },
              { label: 'Want to see the components?', href: '/showcase', text: 'Showcase', internal: true },
            ].map((item) => {
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
                    border: '1px solid var(--border)',
                    borderRadius: 6,
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
