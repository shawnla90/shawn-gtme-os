import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getToolAvatarUrls } from '@shawnos/shared/lib/rpg'

export const metadata: Metadata = {
  title: 'The Method',
  description:
    'Recursive Drift. the non-linear method for building with AI. Six states, no fixed order, output feeds back as input.',
  keywords: [
    'recursive drift',
    'AI building method',
    'non-linear development',
    'building with AI',
    'AI workflow',
    'recursive development',
    'agent-driven development',
    'AI-native methodology',
    'build in public method',
    'compound building',
  ],
  alternates: { canonical: 'https://shawnos.ai/method' },
  openGraph: {
    title: 'The Method | shawnos.ai',
    description:
      'Recursive Drift. the non-linear method for building with AI.',
    url: 'https://shawnos.ai/method',
    images: [
      {
        url: '/og?title=The+Method&subtitle=Recursive+Drift',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'The Method | shawnos.ai',
    description:
      'Recursive Drift. the non-linear method for building with AI.',
    images: ['/og?title=The+Method&subtitle=Recursive+Drift'],
  },
}

/* ── data ─────────────────────────────────────────── */

const states: {
  name: string
  tag: string
  body: string
  example: string
}[] = [
  {
    name: 'freefall',
    tag: 'explore',
    body: 'explore without structure. let ideas collide. no outline, no destination. this is where unexpected connections surface. GTM campaigns next to avatar sprites next to newsletter drafts. the mess is the point.',
    example: 'the idea bank captures freefall output. unstructured sparks parked across domains with no obligation to ship.',
  },
  {
    name: 'plan',
    tag: 'crystallize',
    body: 'crystallize freefall into parallel tracks. multi-plan, not single-plan. plans are living documents. they rewrite themselves during execution as the build reveals what the plan got wrong.',
    example: 'the weekend three-site launch plan replaced a previous plan mid-execution. same destination, restructured after the build revealed the original architecture wouldn\'t scale.',
  },
  {
    name: 'build',
    tag: 'delegate',
    body: 'delegate to AI with full context and ship fast. context is the differentiator. skill files, voice playbooks, partner research, prior outputs all loaded before a single line gets written.',
    example: '42 invokable skills, each one a context payload that turns a slash command into a full workflow. the build runs because the context was set up first.',
  },
  {
    name: 'break',
    tag: 'redirect',
    body: 'stop mid-flow. question assumptions. redirect. this is the state most people skip, and it\'s the one that prevents the most wasted work.',
    example: 'the content OS meta post came from breaking mid-workflow to ask why the process felt slow. then rebuilding the process and documenting the rebuild as the content itself.',
  },
  {
    name: 'ask',
    tag: 'interrogate',
    body: 'interrogate the system. ask the AI about itself. ask the plan about the plan. this isn\'t prompting. it\'s using the system\'s self-awareness as a debugging tool.',
    example: 'the /arc page was built by asking the system to describe itself. the page explains the methodology by interrogating it.',
  },
  {
    name: 'seed',
    tag: 'plant',
    body: 'plant breadcrumbs and forward-references for future loops. seeds are one-sentence asides dropped into current content that tease future work. they create pull.',
    example: 'the screen teaser post includes internal notes: "comment 2 seeds the Mac Mini arc without naming it. full reveal comes later."',
  },
]

const recursiveExamples: { label: string; desc: string }[] = [
  {
    label: 'the website explains the system that built the website',
    desc: 'the /about page says: "every skill, every post, every campaign runs through a single codebase. the site you\'re on right now is the proof of work." the page is output. the system is input. they\'re the same thing.',
  },
  {
    label: 'plans rewrite themselves during execution',
    desc: 'a launch plan reached version three before shipping. each rewrite started from what the previous attempt revealed. the failure was the input.',
  },
  {
    label: 'content becomes infrastructure',
    desc: 'posts about the content OS led to codifying those workflows as reusable skills. the post was the prototype. the skill was the production version.',
  },
  {
    label: 'skills produce content that documents the skills',
    desc: 'every skill execution is a potential content draft. the system documents itself because it\'s already running when you need the documentation.',
  },
]

/* ── CHANGE 4: loop snapshot data ── */
const loopSnapshot: { state: string; action: string }[] = [
  { state: 'freefall', action: 'idea surfaces — "what if skills could describe themselves?"' },
  { state: 'plan', action: 'two-track split — self-documenting skill vs. meta content post' },
  { state: 'build', action: 'skill-play invoked on itself. first draft ships.' },
  { state: 'break', action: 'output reads too abstract. architecture pivot to concrete examples.' },
  { state: 'ask', action: 'system interrogation — "what made this post different from the last 5?"' },
  { state: 'seed', action: 'teaser dropped in current post: "the skill that writes about itself ships next week."' },
]

const antiPatterns: { label: string; desc: string }[] = [
  {
    label: 'not vibe coding',
    desc: 'freefall has intent. you explore to find connections, not to avoid planning. freefall without eventual crystallization is just procrastination.',
  },
  {
    label: 'not prompt engineering',
    desc: 'this isn\'t about crafting the perfect prompt. prompts are single-use. recursive drift builds context payloads that persist and compound across every interaction.',
  },
  {
    label: 'not "let AI do everything"',
    desc: 'the human decides when to switch states. the human recognizes when break is needed. AI executes within states. the human navigates between them.',
  },
  {
    label: 'not linear',
    desc: 'no phase 1 → phase 2 pipeline. the sequence is determined by the work, not by the method.',
  },
  {
    label: 'not a productivity hack',
    desc: 'this isn\'t about shipping faster (though it does). it\'s about shipping things that compound. each output makes the next build easier, the next content more grounded, the next plan more informed.',
  },
]

const contrasts: { from: string; diff: string }[] = [
  {
    from: 'prompt engineering',
    diff: 'those optimize a single interaction. recursive drift optimizes across interactions. the unit of work isn\'t a prompt. it\'s a loop.',
  },
  {
    from: 'linear build frameworks',
    diff: 'those assume the plan survives execution. recursive drift assumes the plan will rewrite itself and builds that rewriting into the method.',
  },
  {
    from: '"building in public"',
    diff: 'building in public treats the build as content source material. recursive drift treats the build and the content as the same artifact.',
  },
  {
    from: 'agent orchestration',
    diff: 'those automate the loop. recursive drift keeps the human in the loop as the state-switcher. the AI doesn\'t decide when to break or seed. you do.',
  },
]

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

export default function MethodPage() {
  const ouroborosSprite = getToolAvatarUrls('ouroboros')

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'The Method', url: 'https://shawnos.ai/method' }]}
      />
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* ── Terminal header ── */}
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-muted)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/method.md
        </h1>

        {/* ── Opening ── */}
        <div style={section}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ouroborosSprite.idle}
            alt="Recursive Drift ouroboros"
            width={96}
            height={96}
            style={{
              float: 'right',
              imageRendering: 'pixelated',
              marginLeft: '24px',
              marginBottom: '16px',
            }}
          />
          <p
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            recursive drift.
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              fontStyle: 'italic',
            }}
          >
            the non-linear method for building with AI.
          </p>

          {/* ── CHANGE 1: entry trigger — "who this is for" ── */}
          <p
            style={{
              fontSize: '13px',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '14px',
            }}
          >
            if you&apos;re building with AI and your plan keeps rewriting itself
            mid-execution — your content about the system keeps becoming part of
            the system — and the thing you shipped last week is already the
            input for the thing you&apos;re shipping next — this is why.
          </p>

          <p style={paragraph}>
            this isn&apos;t a framework you follow. it&apos;s a pattern you
            recognize after the fact. when you look at what you built and
            realize the plan rewrote itself three times during execution, the
            documentation documented itself, and the content about the system
            became part of the system.
          </p>
          <p style={paragraph}>
            six modes. no fixed order. you enter whichever one the work demands.
            each pass compounds on the last. the output of one loop becomes the
            context for the next.
          </p>
        </div>

        <hr style={divider} />

        {/* ── The States ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the states</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            a state machine with feedback loops. enter any state the work
            demands. leave when the state&apos;s job is done.
          </p>

          {states.map((state) => (
            <div key={state.name} style={card}>
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
                  {state.name}
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
                  {state.tag}
                </span>
              </div>
              <p style={{ ...mutedText, marginBottom: '12px' }}>
                {state.body}
              </p>
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
                  in practice:
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}
                >
                  {state.example}
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── Recursive ── */}
        <div style={section}>
          <h2 style={sectionTitle}>recursive</h2>

          <p
            style={{
              ...paragraph,
              fontWeight: 600,
              color: 'var(--accent)',
            }}
          >
            output feeds back as input. that&apos;s the core mechanic.
          </p>

          {/* ── CHANGE 3: tightened — removed "this isn't CS recursion" preamble,
              compressed to land the mechanic sharper ── */}
          <p style={paragraph}>
            the skill-play command was run on itself for its first execution.
            the post about the command that creates posts about skills was
            written by running that command on itself. recursion isn&apos;t a
            trick. it&apos;s a design constraint that forces generality — when
            your documentation tool has to document itself, it has to be general
            enough to document anything.
          </p>

          {recursiveExamples.map((ex) => (
            <div key={ex.label} style={card}>
              <span
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {ex.label}
              </span>
              <span style={mutedText}>{ex.desc}</span>
            </div>
          ))}

          <p style={{ ...paragraph, marginTop: '16px', marginBottom: 0 }}>
            the system gets denser over time without getting heavier. each pass
            adds context that makes the next pass faster. the 42nd skill is
            easier to build than the 1st because 41 skills worth of patterns
            already exist as input.
          </p>
        </div>

        <hr style={divider} />

        {/* ── CHANGE 4: one concrete loop snapshot ── */}
        <div style={section}>
          <h2 style={sectionTitle}>one loop</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            one idea, end-to-end through all six states.
          </p>

          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {loopSnapshot.map((step, i) => (
              <div
                key={step.state}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    minWidth: '16px',
                    textAlign: 'right',
                  }}
                >
                  {i + 1}.
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    minWidth: '70px',
                  }}
                >
                  {step.state}
                </span>
                <span style={{ ...mutedText, fontSize: '13px' }}>
                  {step.action}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              ...mutedText,
              marginTop: '16px',
              marginBottom: 0,
              fontStyle: 'italic',
            }}
          >
            no logs. no telemetry. just the shape of how one idea moves through
            the system.
          </p>
        </div>

        <hr style={divider} />

        {/* ── Anti-patterns ── */}
        <div style={section}>
          <h2 style={sectionTitle}>what this is not</h2>

          {/* ── CHANGE 3 continued: anti-patterns layout fix ──
              switched from side-by-side flex (broke on narrow screens)
              to stacked label + description ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {antiPatterns.map((ap) => (
              <div key={ap.label}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: '4px',
                  }}
                >
                  {ap.label}
                </span>
                <span style={mutedText}>{ap.desc}</span>
              </div>
            ))}
          </div>

          {/* ── CHANGE 2: state-switcher callout — isolated and emphasized ── */}
          <div
            style={{
              marginTop: '32px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '8px',
                lineHeight: 1.4,
              }}
            >
              AI executes within states.
              <br />
              the human navigates between them.
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              that&apos;s the difference between this and pure agent
              orchestration, automation maximalism, and vibe coding chaos. the
              differentiator is state awareness.
            </p>
          </div>
        </div>

        <hr style={divider} />

        {/* ── How It Differs ── */}
        <div style={section}>
          <h2 style={sectionTitle}>how it differs</h2>

          {contrasts.map((c) => (
            <div key={c.from} style={{ marginBottom: '16px' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  marginBottom: '4px',
                }}
              >
                from {c.from}:
              </span>
              <span style={mutedText}>{c.diff}</span>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── The Paradox ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the paradox</h2>

          <p
            style={{
              ...paragraph,
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '15px',
            }}
          >
            an unstructured process that produces structured output.
          </p>

          <p style={paragraph}>
            no fixed order. no required sequence. no checklist. and yet: 42
            skills, 4 voice playbooks, 3 websites, 93 content files, 15
            proprietary scripts, a progression engine, an avatar system, and an
            IP registry. all from the same recursive loop.
          </p>

          <p style={paragraph}>
            the structure emerges from the recursion. each pass adds a little
            more form. freefall produces raw ideas. plan gives them shape. build
            makes them real. break prevents drift. ask reveals what&apos;s
            missing. seed creates pull for the next loop.
          </p>

          <p
            style={{
              ...paragraph,
              marginBottom: 0,
              color: 'var(--text-muted)',
            }}
          >
            the output is structured because the loop ran enough times. not
            because the process was.
          </p>
        </div>

        <hr style={divider} />

        {/* ── The Principle — CHANGE 5: harder closing ── */}
        <div style={section}>
          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              if a system can&apos;t describe itself, it&apos;s not general
              enough.
            </p>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '16px',
              }}
            >
              this page was written by the method it documents. freefall
              produced the concept. plan structured the phases. build delegated
              the writing. break questioned the name. ask interrogated what made
              it different. seed planted forward-references before this page
              existed.
            </p>
            <p
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              can yours?
            </p>
          </div>
        </div>

        {/* ── See It Running ── */}
        <div style={section}>
          <h2 style={sectionTitle}>see it running</h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {[
              {
                href: '/about/arc',
                label: 'the arc',
                desc: 'where this started. plumber, SDR, GTM engineer',
              },
              {
                href: '/log',
                label: 'the log',
                desc: 'daily output from the loop',
              },
              {
                href: '/blog',
                label: 'the blog',
                desc: 'long-form content the system produced',
              },
              {
                href: '/api',
                label: 'the API',
                desc: 'endpoints, schemas, live data',
              },
            ].map((link) => (
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
                <span
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  {link.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Back to About ── */}
        <div style={{ marginTop: '48px' }}>
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
            &larr; back to about
          </Link>
        </div>
      </div>
    </>
  )
}
