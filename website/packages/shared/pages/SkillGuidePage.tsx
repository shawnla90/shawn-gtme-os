import React from 'react'
import Link from 'next/link'
import { TITLE_TABLE, tierColor } from '../lib/rpg'
import type { TitleTier } from '../lib/rpg'
import { AvatarBadge } from '../components/AvatarBadge'

/* ── styles ──────────────────────────────────────── */

const container: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '40px 20px 60px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '32px',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--accent)',
  fontWeight: 400,
  letterSpacing: '0.5px',
  marginBottom: '16px',
  fontFamily: 'var(--font-mono)',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '12px',
  lineHeight: 1.3,
}

const body: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '24px',
}

const bodyMuted: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-muted)',
  marginBottom: '24px',
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '12px',
}

const cardTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '4px',
  letterSpacing: '0.02em',
}

const cardMeta: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '10px',
}

const cardBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
}

const timelineItem: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
}

const timelineDot: React.CSSProperties = {
  flex: '0 0 auto',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: 'var(--accent)',
  marginTop: '6px',
  boxShadow: '0 0 6px var(--accent)',
}

const timelineText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
}

const backLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

const ctaBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--accent)',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
}

const ctaTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
}

const ctaBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const ctaLink: React.CSSProperties = {
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
}

const ctaSecondary: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 18px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 6,
  textDecoration: 'none',
  marginTop: '10px',
  transition: 'border-color 0.15s ease',
}

/* ── Stack layer cards data ── */

const STACK_LAYERS = [
  {
    name: 'daily_scan.py',
    label: 'Scanner',
    tech: 'Python · stdlib · git',
    description:
      'Auto-detects output from git commits, file modification times, and content directories. Classifies each file, computes weighted point scores, and merges into a structured JSON log. Safe to run multiple times per day.',
  },
  {
    name: 'daily_dashboard.py',
    label: 'Dashboard',
    tech: 'Python · Pillow',
    description:
      'Reads the daily JSON log and renders a visual receipt card. Header row with letter grade, stat boxes, platform breakdown bar, three-column accomplishments/pipeline/tokens layout, and a footer with summary stats. All monospace, all code-generated.',
  },
  {
    name: 'progression_engine.py',
    label: 'Progression Engine',
    tech: 'Python · XP formulas',
    description:
      'Takes daily output scores and converts them into RPG progression. XP accumulation, level-ups, title promotions, class specialization, and milestone unlocks. The bridge between "I shipped today" and "my character evolved."',
  },
  {
    name: 'avatar_generator.py',
    label: 'Avatar Generator',
    tech: 'Python · Pillow · 6-tier system',
    description:
      'Renders the RPG avatar badge you see on the landing page. Six visual tiers that evolve as you level up, from a blinking cursor placeholder to a fully rendered character with class insignia, XP bar, and title.',
  },
  {
    name: '_gen_skill_tree.py',
    label: 'Skill Tree',
    tech: 'Python · Pillow · sector visualization',
    description:
      'Maps the entire GTM OS ecosystem into an RPG-style skill tree. Content engine, GTM operations, voice system, agent skills, infrastructure. Each node represents a real capability in the codebase.',
  },
]

/* ── Evolution timeline data ── */

const EVOLUTION_STEPS = [
  {
    text: 'Started as a Cursor skill prompt. "Scan my work and tell me what I shipped today." One command, one text summary.',
  },
  {
    text: 'Became a Python scanner + Pillow dashboard. The text summary wasn\'t enough. I wanted a visual receipt. So I wrote a scanner that outputs JSON and a renderer that draws a PNG. The daily log was born.',
  },
  {
    text: 'Realized the images were generated code, not static assets. Every pixel is computed from real data. The dashboard doesn\'t screenshot anything. It reads a JSON file and draws every element with coordinates, colors, and layout logic.',
  },
  {
    text: 'Added the RPG progression layer on top. If you\'re already computing daily output scores, why not accumulate XP? If you\'re already grading performance, why not assign titles? The progression engine turned a tracker into a game.',
  },
  {
    text: 'Now renders a character that evolves based on real output. The avatar you saw on the landing page? It\'s not a JPEG I uploaded. It\'s a Pillow-rendered badge that changes as the character levels up. Six tiers, each with distinct visual treatment.',
  },
]

/* ── RPG class data ── */

const RPG_CLASSES = [
  {
    name: 'Builder',
    domain: 'Code & Infrastructure',
    trigger: 'Majority of cumulative points from monorepo builds, landing pages, feature systems, and code infra.',
    description: 'Focused on shipping. Code, scripts, infrastructure. 1.5x XP multiplier on all technical output.',
  },
  {
    name: 'Scribe',
    domain: 'Content',
    trigger: 'Majority of cumulative points from finalized posts, newsletters, long-form writing, and content drafts.',
    description: 'Content-first. 1.5x XP multiplier on finalized posts, newsletters, and long-form writing.',
  },
  {
    name: 'Strategist',
    domain: 'GTM Operations',
    trigger: 'Majority of cumulative points from workflows, campaign copy, partner operations, and outreach.',
    description: 'GTM operator. 1.5x XP multiplier on workflows, campaign copy, and partner operations.',
  },
  {
    name: 'Alchemist',
    domain: 'Efficiency',
    trigger: 'Highest cumulative efficiency rating (output per token dollar spent) across all tracked days.',
    description: 'AI-native. 1.5x XP multiplier on efficiency-rated output. Maximizes output per token dollar.',
  },
  {
    name: 'Polymath',
    domain: 'Balanced',
    trigger: 'No single domain exceeds 40% of cumulative output. Consistent spread across code, content, and GTM.',
    description: 'Balanced across all domains. 1.5x XP multiplier on the lowest-scoring domain to encourage balance.',
  },
]

/* ── Component ───────────────────────────────────── */

/**
 * Shared skill guide page component.
 * The "aha" page — origin story, stack breakdown, RPG title table, and evolution timeline.
 * Used by all three apps at `/log/skill-guide`.
 */
export function SkillGuidePage() {
  return (
    <>
      <style>{`
        .sg-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: sg-blink-kf 1s step-end infinite;
        }
        @keyframes sg-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .sg-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          font-family: var(--font-mono);
        }
        .sg-table th {
          text-align: left;
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border);
          background: var(--canvas);
        }
        .sg-table td {
          padding: 10px 12px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
          line-height: 1.4;
        }
        .sg-table tr:last-child td {
          border-bottom: none;
        }
        .sg-table tr:hover td {
          background: rgba(78, 195, 115, 0.03);
        }
        .sg-card-hover:hover {
          border-color: var(--accent) !important;
        }
        @media (max-width: 600px) {
          .sg-table th, .sg-table td {
            padding: 8px 8px;
            font-size: 12px;
          }
          .sg-class-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={container}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/system/origin.log
          <span className="sg-blink" />
        </h1>

        {/* ═══════════════════════════════════════════
            Section 1: What You're Looking At
            ═══════════════════════════════════════════ */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <AvatarBadge size="compact" />
          </div>
          <h2 style={sectionTitle}>What You're Looking At</h2>
          <p style={body}>
            The avatar you saw? It's not a static image. It's a Pillow-rendered
            badge generated from real activity data. Every day this system scans git commits,
            the content pipeline, and AI sessions. Scores them, grades them, and levels
            up an RPG character.
          </p>
          <p style={bodyMuted}>
            Here's how it all works.
          </p>
        </section>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════
            Section 2: The Stack
            ═══════════════════════════════════════════ */}
        <section>
          <div style={sectionPrompt}>$ ls ~/system/stack/</div>
          <h2 style={{ ...sectionTitle, marginBottom: '24px' }}>The Stack</h2>

          {STACK_LAYERS.map((layer) => (
            <div key={layer.name} className="sg-card-hover" style={{ ...card, transition: 'border-color 0.15s ease' }}>
              <div style={cardTitle}>{layer.label}</div>
              <div style={cardMeta}>{layer.name} &middot; {layer.tech}</div>
              <p style={cardBody}>{layer.description}</p>
            </div>
          ))}
        </section>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════
            Section 3: The Evolution
            ═══════════════════════════════════════════ */}
        <section>
          <div style={sectionPrompt}>$ git log --oneline ~/system/evolution</div>
          <h2 style={{ ...sectionTitle, marginBottom: '24px' }}>The Evolution</h2>

          <p style={bodyMuted}>
            This didn't start as an RPG. It started as a question:
            "Can I prove I actually ship?"
          </p>

          <div style={{ marginTop: '8px' }}>
            {EVOLUTION_STEPS.map((step, i) => (
              <div key={i} style={timelineItem}>
                <div style={timelineDot} />
                <div style={timelineText}>{step.text}</div>
              </div>
            ))}
          </div>

          <p style={{ ...bodyMuted, marginTop: '8px', marginBottom: 0 }}>
            The point: this is achievable. It's Python + Pillow + a few hundred lines of
            logic. No SaaS, no dashboard product, no API subscriptions. Just a codebase that
            tracks itself.
          </p>
        </section>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════
            Section 4: The Title Table
            ═══════════════════════════════════════════ */}
        <section>
          <div style={sectionPrompt}>$ cat ~/system/titles.json</div>
          <h2 style={{ ...sectionTitle, marginBottom: '8px' }}>The Title Table</h2>
          <p style={bodyMuted}>
            Every level range unlocks a new title and avatar tier. Here's the full
            progression from Terminal Initiate to Grand Master Cursor Slayer.
          </p>

          {/* Title progression table */}
          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '32px',
            }}
          >
            <table className="sg-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Title</th>
                  <th>XP Required</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {TITLE_TABLE.map((row: TitleTier) => (
                  <tr key={row.level}>
                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {row.level}
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {row.title}
                    </td>
                    <td>
                      {row.xp_required === 0
                        ? '—'
                        : row.xp_required.toLocaleString()}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '4px',
                          background: 'var(--canvas)',
                          border: `1px solid ${tierColor(row.avatar_tier)}`,
                          color: tierColor(row.avatar_tier),
                        }}
                      >
                        T{row.avatar_tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Class system */}
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Class System
          </h3>
          <p style={bodyMuted}>
            Your class is assigned based on your cumulative output distribution across
            all tracked days. The progression engine recalculates class on each daily
            scan. To shift class, you need sustained output in a new domain — a single
            day won't flip it. Each class applies a 1.5x XP multiplier to its primary
            domain while all other domains earn at the base 1.0x rate.
          </p>

          <div
            className="sg-class-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            {RPG_CLASSES.map((cls) => (
              <div
                key={cls.name}
                style={{
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '14px 16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  {/* Class sprite */}
                  <img
                    src={`/progression/avatars/class-${cls.name.toLowerCase()}-idle-128.gif`}
                    alt={`${cls.name} class sprite`}
                    width={64}
                    height={64}
                    style={{
                      imageRendering: 'pixelated',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--accent)',
                        }}
                      >
                        {cls.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.06em',
                          padding: '1px 6px',
                          border: '1px solid var(--border)',
                          borderRadius: '3px',
                        }}
                      >
                        {cls.domain}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        color: 'var(--text-secondary)',
                        marginBottom: '6px',
                      }}
                    >
                      {cls.description}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        lineHeight: 1.5,
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                      }}
                    >
                      {cls.trigger}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════
            Section 5: Build Your Own
            ═══════════════════════════════════════════ */}
        <section>
          <div style={sectionPrompt}>$ ./build --ready</div>

          <div style={ctaBlock}>
            <div style={ctaTitle}>Ready to build this?</div>
            <p style={ctaBody}>
              Start with the basics. The daily tracker prompt gives you the scanner + dashboard.
              Everything you need to generate your own build receipts.
            </p>
            <Link href="/log/build-your-own" style={ctaLink}>
              grab the prompt &rarr;
            </Link>
            <br />
            <Link href="/log/build-your-own#rpg" style={ctaSecondary}>
              want the RPG layer too? &rarr;
            </Link>
          </div>
        </section>

        {/* ── Navigation ── */}
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/log" style={backLink}>
            &larr; back to the log
          </Link>
          <Link href="/log/build-your-own" style={backLink}>
            build your own &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
