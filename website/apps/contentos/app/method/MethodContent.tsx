'use client'

import Link from 'next/link'
import {
  MotionReveal,
  ScrollRevealSection,
  StaggerContainer,
  StaggerItem,
  ScrambleCycler,
  SectionHeadline,
} from '@shawnos/shared/components'

/* ── tier data ────────────────────────────────────── */

const voiceDNAComponents = [
  {
    icon: '🎙',
    name: 'Core Voice',
    file: 'core-voice.md',
    desc: 'Personality, tone, priority hierarchy, voice modes, builder code, identity anchors, audience definition.',
  },
  {
    icon: '🚫',
    name: 'Anti-Slop',
    file: 'anti-slop.md',
    desc: '14 patterns to catch and kill. Em-dashes, authority signaling, narrator setups, dramatic framing, bookend summaries.',
  },
  {
    icon: '🎯',
    name: 'Viral Hooks',
    file: 'viral-hooks.md',
    desc: '6 hook styles: curiosity pings, contrarian POVs, data bombs, story openers, problem-first, direct challenge.',
  },
  {
    icon: '🛡',
    name: 'Safety Filters',
    file: 'safety-filters.md',
    desc: 'Pattern vs. person test. What you can critique (systems, approaches) vs. what you protect (people, companies).',
  },
]

const platformGrid = [
  {
    name: 'LinkedIn',
    format: '1-2 sentence paragraphs, emoji markers, screen recordings',
    keyRule: 'The post is the hook. The comments are the delivery.',
  },
  {
    name: 'X / Twitter',
    format: '280-char tweets, 4-6 tweet threads, single-tweet hot takes',
    keyRule: 'Every tweet stands alone. No context required.',
  },
  {
    name: 'Substack',
    format: '300-800 words, markdown-native, inline code + screenshots',
    keyRule: 'Deeper version of what you already wrote on social.',
  },
  {
    name: 'TikTok',
    format: '16-sec videos, on-screen text IS the hook, screen recordings',
    keyRule: 'The demo IS the content. No intros.',
  },
  {
    name: 'YouTube',
    format: '5-15 min walkthroughs, episode format, expanded plays',
    keyRule: 'LinkedIn screen recordings expanded with voiceover.',
  },
  {
    name: 'Reddit',
    format: 'Conversational long-form, subreddit-native, SEO-driven',
    keyRule: 'Written for a smart friend in a niche community.',
  },
]

const pipelineSteps = [
  { label: 'Signal', desc: 'Daily research via Exa MCP, industry feeds, build logs' },
  { label: 'Draft', desc: 'Agent skill generates from signal + voice files + pillar template' },
  { label: 'Voice', desc: 'Anti-slop check, substance validation, voice verification' },
  { label: 'Format', desc: 'Platform playbook applies: length, structure, CTA, sign-off' },
  { label: 'Publish', desc: 'Typefully queue, Substack schedule, cross-platform distribution' },
  { label: 'Loop', desc: 'Performance data refines voice rules. Output feeds back as input.' },
]

const contentPillars = [
  'Plays Series',
  'Building & Sharing',
  'GTM Memes',
  'Release Reactions',
  'Skill System Shares',
  'Newsletter Editorial',
  'Newsletter Growth',
  'Newsletter Repurpose',
  'Reddit Growth & SEO',
  'YouTube Builder Systems',
  'X Micro-Tips',
  'Twitch Gaming + Discord',
]

const tierConnections = [
  {
    flow: 'Voice DNA feeds Playbooks',
    color: '#4EC373',
    desc: 'Voice DNA rules get applied per-platform. The LinkedIn playbook inherits from core-voice.md. TikTok inherits the same rules but compresses for 16-second video.',
  },
  {
    flow: 'Playbooks feed Content Ops',
    color: '#FF69B4',
    desc: 'Platform-formatted content gets automated into production. The pre-publish checklist validates that playbook rules were followed.',
  },
  {
    flow: 'Content Ops feeds back to Voice DNA',
    color: '#D2A53C',
    desc: 'Performance data and production failures refine voice rules. The system improves itself with every piece of content.',
  },
]

const methodStats = [
  { value: '4', label: 'Voice DNA Files' },
  { value: '7', label: 'Context Playbooks' },
  { value: '12', label: 'Content Pillars' },
  { value: '14+', label: 'Anti-Slop Patterns' },
]

/* ── styles ────────────────────────────────────────── */

const tierCard: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '20px 24px',
}

/* ── component ─────────────────────────────────────── */

export function MethodContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(ellipse 800px 600px at 50% 30%, rgba(255, 105, 180, 0.15), transparent 60%), var(--canvas)',
          textAlign: 'center',
          padding: '0 24px',
          position: 'relative',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.05}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'rgba(255, 105, 180, 0.08)',
              border: '1px solid rgba(255, 105, 180, 0.2)',
              borderRadius: 999,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            The Method
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.15}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Your voice,</span>{' '}
            <span style={{ color: 'var(--accent)' }}>
              <ScrambleCycler
                phrases={[
                  'systematized.',
                  'encoded as rules.',
                  'scaled across platforms.',
                  'compounding daily.',
                ]}
                holdMs={3000}
                scrambleSpeed={30}
                resolveSpeed={50}
              />
            </span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 40px',
            }}
          >
            Your content strategy should be a system, not a calendar.
            A repo, not a spreadsheet. Infrastructure, not inspiration.
          </p>
        </MotionReveal>

        {/* Pain points */}
        <MotionReveal variant="fadeUp" delay={0.35}>
          <div
            style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 900,
            }}
          >
            {[
              { label: 'No voice consistency', desc: 'Every post is a fresh prompt with no persistent rules.' },
              { label: 'No cross-platform rules', desc: 'Same content pasted everywhere. Wrong container, wrong format.' },
              { label: 'No feedback loops', desc: 'Content gets published and forgotten. Post 100 is as hard as post 1.' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  flex: '1 1 240px',
                  padding: '20px 24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

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

      {/* ── Architecture Intro ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div style={{ textAlign: 'center' }}>
          <SectionHeadline
            label="3-TIER SYSTEM"
            subtitle="Each tier builds on the one below it"
          >
            The Architecture
          </SectionHeadline>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Three layers that compose together. Voice DNA defines who you are.
            Context Playbooks adapt it per platform. Content Ops make it sustainable.
          </p>
        </div>
      </ScrollRevealSection>

      {/* ── Tier 1: Voice DNA ── */}
      <ScrollRevealSection
        background="var(--canvas)"
        style={{ borderTop: '3px solid #4EC373' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4EC373',
                background: 'rgba(78, 195, 115, 0.1)',
                border: '1px solid rgba(78, 195, 115, 0.25)',
                borderRadius: 4,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Tier 1 - Foundation
            </div>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.1}>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#4EC373',
                fontFamily: 'var(--font-mono)',
                marginBottom: 12,
              }}
            >
              Voice DNA
            </h2>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.15}>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: 32,
              }}
            >
              Your voice encoded as rules, not vibes. Sentence style, word choices,
              anti-patterns, identity markers. This tier inherits into everything above it.
            </p>
          </MotionReveal>

          <StaggerContainer stagger={0.08}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {voiceDNAComponents.map((comp) => (
                <StaggerItem key={comp.name}>
                  <div style={{ ...tierCard, borderColor: 'rgba(78, 195, 115, 0.15)', height: '100%' }}>
                    <div style={{ fontSize: '24px', marginBottom: 8 }}>{comp.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#4EC373', marginBottom: 4 }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                      {comp.file}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {comp.desc}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <MotionReveal variant="fadeUp" delay={0.3}>
            <div
              style={{
                padding: '14px 20px',
                borderLeft: '3px solid #4EC373',
                background: 'rgba(78, 195, 115, 0.05)',
                borderRadius: '0 6px 6px 0',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#4EC373', margin: 0, fontStyle: 'italic' }}>
                Voice is infrastructure. If it&apos;s not in a file, it doesn&apos;t scale.
              </p>
            </div>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── Tier 2: Context Playbooks ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{ borderTop: '3px solid #FF69B4' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FF69B4',
                background: 'rgba(255, 105, 180, 0.1)',
                border: '1px solid rgba(255, 105, 180, 0.25)',
                borderRadius: 4,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Tier 2 - Adaptation
            </div>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.1}>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#FF69B4',
                fontFamily: 'var(--font-mono)',
                marginBottom: 12,
              }}
            >
              Context Playbooks
            </h2>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.15}>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: 32,
              }}
            >
              Platform-specific rules that adapt your Voice DNA to each channel.
              The voice stays consistent but the format, length, and delivery adapt.
            </p>
          </MotionReveal>

          <StaggerContainer stagger={0.06}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
                marginBottom: 24,
              }}
            >
              {platformGrid.map((p) => (
                <StaggerItem key={p.name}>
                  <div style={{ ...tierCard, borderColor: 'rgba(255, 105, 180, 0.15)', height: '100%' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FF69B4', marginBottom: 8 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                      {p.format}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      {p.keyRule}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <MotionReveal variant="fadeUp" delay={0.3}>
            <div
              style={{
                padding: '14px 20px',
                borderLeft: '3px solid #FF69B4',
                background: 'rgba(255, 105, 180, 0.05)',
                borderRadius: '0 6px 6px 0',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#FF69B4', margin: 0, fontStyle: 'italic' }}>
                Same voice, different format. The playbook handles the translation.
              </p>
            </div>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── Tier 3: Content Ops ── */}
      <ScrollRevealSection
        background="var(--canvas)"
        style={{ borderTop: '3px solid #D2A53C' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#D2A53C',
                background: 'rgba(210, 165, 60, 0.1)',
                border: '1px solid rgba(210, 165, 60, 0.25)',
                borderRadius: 4,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Tier 3 - Execution
            </div>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.1}>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#D2A53C',
                fontFamily: 'var(--font-mono)',
                marginBottom: 12,
              }}
            >
              Content Ops
            </h2>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.15}>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: 32,
              }}
            >
              The automation and production infrastructure. Checklists, workflows, and
              content pipelines that turn principles into shipped content.
            </p>
          </MotionReveal>

          {/* Pipeline */}
          <MotionReveal variant="fadeUp" delay={0.2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginBottom: 32,
              }}
            >
              {pipelineSteps.map((step, i) => (
                <div
                  key={step.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 20px',
                    background: 'rgba(210, 165, 60, 0.04)',
                    border: '1px solid rgba(210, 165, 60, 0.12)',
                    borderRadius: i === 0 ? '8px 8px 2px 2px' : i === pipelineSteps.length - 1 ? '2px 2px 8px 8px' : '2px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#D2A53C', minWidth: 30, fontFamily: 'var(--font-mono)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#D2A53C', minWidth: 70 }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>
          </MotionReveal>

          {/* Content Pillars */}
          <MotionReveal variant="fadeUp" delay={0.3}>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#D2A53C',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                12 Content Pillars
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 8,
                }}
              >
                {contentPillars.map((pillar) => (
                  <div
                    key={pillar}
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(210, 165, 60, 0.06)',
                      border: '1px solid rgba(210, 165, 60, 0.15)',
                      borderRadius: 6,
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.35}>
            <div
              style={{
                padding: '14px 20px',
                borderLeft: '3px solid #D2A53C',
                background: 'rgba(210, 165, 60, 0.05)',
                borderRadius: '0 6px 6px 0',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#D2A53C', margin: 0, fontStyle: 'italic' }}>
                Ops is what makes it sustainable. Without it, you&apos;re just writing posts.
              </p>
            </div>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── How the Tiers Connect ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline
          label="FEEDBACK LOOP"
          subtitle="Each tier feeds the next, and the last feeds back to the first"
        >
          How the Tiers Connect
        </SectionHeadline>

        <StaggerContainer stagger={0.12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {tierConnections.map((item) => (
              <StaggerItem key={item.flow}>
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    borderLeft: `3px solid ${item.color}`,
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 700, color: item.color, marginBottom: 8 }}>
                    {item.flow}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {item.desc}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <MotionReveal variant="fadeIn" delay={0.3}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              padding: '24px',
              background: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#4EC373' }}>Voice DNA</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>&rarr;</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FF69B4' }}>Playbooks</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>&rarr;</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#D2A53C' }}>Content Ops</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>&rarr;</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#4EC373' }}>Voice DNA</span>
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.4}>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '15px', fontWeight: 600, color: 'var(--accent)' }}>
            The recursive part. The system improves itself.
          </p>
        </MotionReveal>
      </ScrollRevealSection>

      {/* ── What This Produces ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline label="OUTPUT" subtitle="One voice, six platforms, twelve pillars">
          What This Produces
        </SectionHeadline>

        <StaggerContainer stagger={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 2,
              marginBottom: 32,
            }}
          >
            {methodStats.map((s) => (
              <StaggerItem key={s.label}>
                <div style={{ padding: '24px 20px', background: 'var(--canvas-subtle)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <MotionReveal variant="fadeUp" delay={0.3}>
          <div
            style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.04), transparent), var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
              Voice rules are not prompts you paste into ChatGPT.
              <br />
              They are versioned documents that evolve over time.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              Prompts are single-use. They live in a chat window and disappear.
              A content operating system lives in a repo, is loaded by agent
              skills, and can be diffed to see how your voice has changed.
            </p>
          </div>
        </MotionReveal>
      </ScrollRevealSection>

      {/* ── CTA ── */}
      <ScrollRevealSection background="var(--canvas-subtle)" variant="scale">
        <SectionHeadline label="EXPLORE" subtitle="Dig deeper into the system">
          Explore the System
        </SectionHeadline>

        <StaggerContainer stagger={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { href: '/showcase', label: 'Showcase', desc: 'Interactive demos and tools built on the method.' },
              { href: '/content-wiki', label: 'Content Wiki', desc: 'Platform playbooks, voice systems, anti-slop rules.' },
              { href: '/how-to', label: 'How-To Guides', desc: 'Step-by-step guides to build your own content OS.' },
              { href: '/anti-slop', label: 'Anti-Slop Detector', desc: 'Paste any text and score it against 44 anti-slop rules.' },
            ].map((link) => (
              <StaggerItem key={link.href}>
                <Link
                  href={link.href}
                  style={{ display: 'block', padding: '24px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', height: '100%' }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
                    {link.label} &rarr;
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {link.desc}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ScrollRevealSection>
    </>
  )
}
