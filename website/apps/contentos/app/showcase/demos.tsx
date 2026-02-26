'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ReactLabDemos } from '../react-lab/demos'

/* ── shared styles (match react-lab) ── */

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 24,
  marginBottom: 32,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  marginBottom: 8,
  letterSpacing: '0.05em',
}

const sectionDesc: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
  marginBottom: 20,
  lineHeight: 1.6,
}

const smallBtn = (
  active: boolean,
  disabled = false,
): React.CSSProperties => ({
  padding: '6px 16px',
  background: active ? 'var(--accent)' : 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 4,
  color: disabled
    ? 'var(--text-muted)'
    : active
      ? '#fff'
      : 'var(--accent)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  cursor: disabled ? 'not-allowed' : 'pointer',
})

/* ================================================================== */
/*  07 — CONTENT PILLAR MAP                                            */
/* ================================================================== */

const PILLARS = [
  {
    name: 'Building + Sharing',
    tag: 'primary',
    color: '#9B72CF',
    description:
      'The core pillar. Document what you build as you build it. Every commit, every system, every deployment becomes content. The process is the product.',
    exampleFormat:
      'Long-form LinkedIn post: "I just shipped [thing]. Here\'s the architecture and what broke." + terminal screenshot.',
    platforms: ['LinkedIn', 'Substack'],
    cadence: '3-4x per week',
  },
  {
    name: 'Plays Series',
    tag: 'gtm-workflows',
    color: '#4EC373',
    description:
      'Step-by-step GTM workflow breakdowns. Each Play is a repeatable system — lead scoring, signal detection, enrichment, outbound sequences. Tactical, not theoretical.',
    exampleFormat:
      'Numbered thread or carousel: "Play #07 — Signal-Triggered Outbound" with before/after pipeline metrics.',
    platforms: ['LinkedIn', 'X'],
    cadence: '1x per week',
  },
  {
    name: 'Skill/System Shares',
    tag: 'tools-frameworks',
    color: '#50BED2',
    description:
      'Tools, frameworks, and integrations that power the OS. MCP servers, Clay workflows, Exa enrichment, Smartlead configs. Show the stack, not just the result.',
    exampleFormat:
      'Screenshot + breakdown: "This Clay table replaced 3 hours of manual enrichment. Here\'s the column logic."',
    platforms: ['LinkedIn', 'X', 'Substack'],
    cadence: '2x per week',
  },
  {
    name: 'GTM Memes',
    tag: 'engagement',
    color: '#D2A53C',
    description:
      'Low-effort, high-engagement content. Terminal-styled memes, hot takes on outbound trends, relatable GTM pain. Algorithmic surface area that feeds the serious content.',
    exampleFormat:
      'Image post or one-liner: terminal screenshot with a punchline. "$ rm -rf vanity-metrics/" + caption.',
    platforms: ['LinkedIn', 'X', 'TikTok'],
    cadence: '2-3x per week',
  },
  {
    name: 'Micro-Tips',
    tag: 'x-native',
    color: '#E05555',
    description:
      'Bite-sized tactical advice optimized for X. Single-tweet insights that can stand alone. No threads needed — just one clean thought that earns a bookmark.',
    exampleFormat:
      'Single tweet: "Stop writing \'I\'m excited to announce\'. Start with what changed and why anyone should care."',
    platforms: ['X'],
    cadence: 'daily',
  },
  {
    name: 'Newsletter',
    tag: 'substack',
    color: '#FF6B6B',
    description:
      'Weekly deep-dives on Substack. Longer format, more context, more story. The newsletter is where one week of building gets distilled into one essay with takeaways.',
    exampleFormat:
      'Essay: "Week 12 — I rebuilt the content pipeline from scratch. Here\'s the new architecture and what I\'d skip next time."',
    platforms: ['Substack'],
    cadence: '1x per week',
  },
]

function ContentPillarMapDemo() {
  const [activePillar, setActivePillar] = useState<number | null>(null)
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null)

  return (
    <div style={card}>
      <div style={sectionTitle}>// 07 — CONTENT PILLAR MAP</div>
      <p style={sectionDesc}>
        six content pillars, each with its own cadence, platform, and format.
        click any pillar to expand. this is the editorial calendar as
        infrastructure.
      </p>

      {/* pillar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: activePillar !== null ? 20 : 0,
        }}
      >
        {PILLARS.map((p, i) => {
          const isActive = activePillar === i
          const isHovered = hoveredPillar === i
          return (
            <div
              key={p.name}
              onClick={() => setActivePillar(isActive ? null : i)}
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              style={{
                padding: '14px 16px',
                borderRadius: 6,
                border: `1px solid ${isActive || isHovered ? p.color : 'var(--border)'}`,
                background: isActive ? `${p.color}15` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: p.color,
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                [{p.tag}]
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  color:
                    isActive || isHovered
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}
              >
                {p.cadence}
              </div>
            </div>
          )
        })}
      </div>

      {/* expanded detail panel */}
      {activePillar !== null && (
        <div
          style={{
            padding: 20,
            background: '#0D1117',
            borderRadius: 8,
            borderLeft: `3px solid ${PILLARS[activePillar].color}`,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: PILLARS[activePillar].color,
              marginBottom: 12,
              letterSpacing: '0.05em',
            }}
          >
            [{PILLARS[activePillar].tag.toUpperCase()}] —{' '}
            {PILLARS[activePillar].name}
          </div>

          <div style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            {PILLARS[activePillar].description}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 12,
              marginBottom: 12,
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              EXAMPLE FORMAT:
            </span>
            <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              {PILLARS[activePillar].exampleFormat}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                PLATFORMS:
              </span>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {PILLARS[activePillar].platforms.map((pl) => (
                  <span
                    key={pl}
                    style={{
                      padding: '2px 8px',
                      fontSize: 11,
                      color: PILLARS[activePillar].color,
                      background: `${PILLARS[activePillar].color}15`,
                      border: `1px solid ${PILLARS[activePillar].color}40`,
                      borderRadius: 3,
                    }}
                  >
                    {pl}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                CADENCE:
              </span>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                {PILLARS[activePillar].cadence}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  08 — RECURSIVE CONTENT LOOP                                        */
/* ================================================================== */

const BRANCHES = [
  {
    name: 'LinkedIn Post',
    color: '#0A66C2',
    icon: 'LI',
    rules: [
      { label: 'Length', value: '800-1,400 characters' },
      { label: 'Tone', value: 'conversational authority — lowercase, personal' },
      { label: 'Format', value: 'hook + 3 body blocks + CTA with line breaks' },
      { label: 'Additions', value: '3-5 hashtags, sign-off identity marker' },
    ],
  },
  {
    name: 'X Thread',
    color: '#1DA1F2',
    icon: 'X',
    rules: [
      { label: 'Length', value: '5-8 tweets, each under 280 chars' },
      { label: 'Tone', value: 'punchy, compressed — every word earns its spot' },
      { label: 'Format', value: 'numbered thread: 1/ hook, 2-6/ points, 7/ summary + CTA' },
      { label: 'Additions', value: 'no hashtags in thread body, optional retweet hook' },
    ],
  },
  {
    name: 'Substack Essay',
    color: '#FF6719',
    icon: 'SS',
    rules: [
      { label: 'Length', value: '1,200-2,500 words' },
      { label: 'Tone', value: 'reflective builder — more context, more story' },
      { label: 'Format', value: 'headline + TL;DR + 3-5 sections with H2s + takeaways' },
      { label: 'Additions', value: 'email subject line, preview text, related post links' },
    ],
  },
  {
    name: 'TikTok Script',
    color: '#FE2C55',
    icon: 'TT',
    rules: [
      { label: 'Length', value: '45-90 seconds spoken (120-250 words)' },
      { label: 'Tone', value: 'direct to camera energy — hook in first 2 seconds' },
      { label: 'Format', value: '[0:00] hook | [0:03] context | [0:15] value | [0:40] CTA' },
      { label: 'Additions', value: 'on-screen text overlays, trending audio optional' },
    ],
  },
  {
    name: 'Image Asset',
    color: '#4EC373',
    icon: 'IMG',
    rules: [
      { label: 'Length', value: 'n/a — visual only' },
      { label: 'Tone', value: 'terminal aesthetic — dark bg, monospace, accent color' },
      { label: 'Format', value: '1080x1350 (4:5) or 1080x1080 (1:1), PNG export' },
      { label: 'Additions', value: 'boot sequence text, branded watermark, aios palette' },
    ],
  },
]

function RecursiveContentLoopDemo() {
  const [activeBranch, setActiveBranch] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const [visibleBranches, setVisibleBranches] = useState<number[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const runAnimation = useCallback(() => {
    if (animating) return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisibleBranches([])
    setActiveBranch(null)
    setAnimating(true)

    BRANCHES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleBranches((prev) => [...prev, i])
        if (i === BRANCHES.length - 1) {
          setTimeout(() => setAnimating(false), 400)
        }
      }, 300 + i * 350)
      timersRef.current.push(t)
    })
  }, [animating])

  useEffect(() => {
    runAnimation()
    return () => timersRef.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={card}>
      <div style={sectionTitle}>// 08 — RECURSIVE CONTENT LOOP</div>
      <p style={sectionDesc}>
        one insight becomes five pieces of content. same idea, different format,
        different platform. click any branch to see the transformation rules.
      </p>

      {/* center node + branches */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          marginBottom: activeBranch !== null ? 20 : 0,
        }}
      >
        {/* center insight */}
        <div
          style={{
            padding: '14px 24px',
            background: '#0D1117',
            border: '2px solid var(--accent)',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--accent)',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          one insight
        </div>

        {/* connector line */}
        <div
          style={{
            width: 2,
            height: 20,
            background: 'var(--accent)',
            opacity: visibleBranches.length > 0 ? 1 : 0.2,
            transition: 'opacity 0.3s',
          }}
        />

        {/* branch row */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {BRANCHES.map((b, i) => {
            const isVisible = visibleBranches.includes(i)
            const isActive = activeBranch === i
            return (
              <div
                key={b.name}
                onClick={() =>
                  setActiveBranch(isActive ? null : i)
                }
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0)'
                    : 'translateY(10px)',
                  transition: 'all 0.35s ease',
                }}
              >
                {/* connector dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: b.color,
                  }}
                />
                {/* branch card */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 6,
                    border: `1px solid ${isActive ? b.color : 'var(--border)'}`,
                    background: isActive ? `${b.color}15` : '#0D1117',
                    minWidth: 110,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: b.color,
                      marginBottom: 4,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: isActive
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {b.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* transformation rules panel */}
      {activeBranch !== null && (
        <div
          style={{
            padding: 20,
            background: '#0D1117',
            borderRadius: 8,
            borderLeft: `3px solid ${BRANCHES[activeBranch].color}`,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: BRANCHES[activeBranch].color,
              marginBottom: 12,
              letterSpacing: '0.05em',
            }}
          >
            TRANSFORMATION RULES — {BRANCHES[activeBranch].name.toUpperCase()}
          </div>
          {BRANCHES[activeBranch].rules.map((rule) => (
            <div
              key={rule.label}
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 8,
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  minWidth: 80,
                  flexShrink: 0,
                }}
              >
                {rule.label}:
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {rule.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={runAnimation}
        disabled={animating}
        style={{ ...smallBtn(false, animating), marginTop: 12 }}
      >
        {animating ? 'expanding...' : '\u21BB replay'}
      </button>
    </div>
  )
}

/* ================================================================== */
/*  09 — ANTI-SLOP DETECTOR                                            */
/* ================================================================== */

const SLOP_WORDS: { word: string; replacement: string }[] = [
  { word: 'leverage', replacement: 'use' },
  { word: 'innovative', replacement: 'new' },
  { word: 'cutting-edge', replacement: 'modern' },
  { word: 'revolutionize', replacement: 'change' },
  { word: 'seamless', replacement: 'smooth' },
  { word: 'comprehensive', replacement: 'complete' },
  { word: 'robust', replacement: 'strong' },
  { word: 'synergy', replacement: 'collaboration' },
  { word: 'empower', replacement: 'help' },
  { word: 'utilize', replacement: 'use' },
  { word: 'streamline', replacement: 'simplify' },
  { word: 'paradigm', replacement: 'model' },
  { word: 'ecosystem', replacement: 'system' },
  { word: 'stakeholders', replacement: 'people involved' },
  { word: 'best-in-class', replacement: 'top' },
  { word: 'disruptive', replacement: 'different' },
  { word: 'scalable', replacement: 'growable' },
  { word: 'value-add', replacement: 'useful' },
  { word: 'game-changer', replacement: 'big shift' },
  { word: 'thought leader', replacement: 'person who writes' },
]

const PASSIVE_PATTERNS = [
  'has been',
  'have been',
  'was being',
  'were being',
  'will be',
  'is being',
  'had been',
  'are being',
  'was made',
  'was created',
  'was designed',
]

const VAGUE_OPENERS = [
  "In today's",
  "It's no secret",
  'As we all know',
  'In this day and age',
  'It goes without saying',
  'At the end of the day',
  'When it comes to',
  'The fact of the matter',
  'Needless to say',
  'Moving forward',
]

const SLOP_EXAMPLE =
  "In today's fast-paced digital landscape, it's no secret that leveraging innovative AI tools has been a game-changer. Our comprehensive and robust platform empowers stakeholders to utilize cutting-edge technology to revolutionize their content workflows. This seamless, best-in-class solution will be the scalable paradigm shift that streamlines your entire ecosystem. As we all know, synergy between disruptive tools creates value-add for every thought leader."

const CLEAN_EXAMPLE =
  "I built a content system that runs on three files and zero manual steps. it takes one draft, checks it against 20 anti-slop rules, and reformats for LinkedIn, X, and Substack. same voice, different shape. the whole thing deploys from a git push. no dashboards, no \"content calendars\" — just a repo that does the work."

function AntiSlopDetectorDemo() {
  const [text, setText] = useState(SLOP_EXAMPLE)
  const [analyzed, setAnalyzed] = useState(true)

  const analyze = useCallback(
    (input: string) => {
      const lower = input.toLowerCase()
      const foundSlop: { word: string; replacement: string; count: number }[] =
        []
      const foundPassive: string[] = []
      const foundOpeners: string[] = []

      for (const s of SLOP_WORDS) {
        const regex = new RegExp(`\\b${s.word.replace(/-/g, '[\\-\\s]?')}s?\\b`, 'gi')
        const matches = input.match(regex)
        if (matches) {
          foundSlop.push({
            word: s.word,
            replacement: s.replacement,
            count: matches.length,
          })
        }
      }

      for (const p of PASSIVE_PATTERNS) {
        if (lower.includes(p.toLowerCase())) {
          foundPassive.push(p)
        }
      }

      for (const o of VAGUE_OPENERS) {
        if (lower.includes(o.toLowerCase())) {
          foundOpeners.push(o)
        }
      }

      // score: 0 = perfect, 100 = maximum slop
      const slopPenalty = foundSlop.reduce((sum, s) => sum + s.count * 8, 0)
      const passivePenalty = foundPassive.length * 6
      const openerPenalty = foundOpeners.length * 10
      const rawScore = slopPenalty + passivePenalty + openerPenalty
      const score = Math.min(100, rawScore)

      return { foundSlop, foundPassive, foundOpeners, score }
    },
    [],
  )

  const result = analyze(text)

  // build highlighted text
  const getHighlightedText = useCallback(
    (input: string) => {
      if (!analyzed) return [{ text: input, type: 'normal' as const }]

      type Segment = { start: number; end: number; type: 'slop' | 'passive' | 'opener' }
      const segments: Segment[] = []

      // find slop words
      for (const s of SLOP_WORDS) {
        const regex = new RegExp(`\\b${s.word.replace(/-/g, '[\\-\\s]?')}s?\\b`, 'gi')
        let match
        while ((match = regex.exec(input)) !== null) {
          segments.push({
            start: match.index,
            end: match.index + match[0].length,
            type: 'slop',
          })
        }
      }

      // find passive patterns
      for (const p of PASSIVE_PATTERNS) {
        const regex = new RegExp(p.replace(/\s+/g, '\\s+'), 'gi')
        let match
        while ((match = regex.exec(input)) !== null) {
          segments.push({
            start: match.index,
            end: match.index + match[0].length,
            type: 'passive',
          })
        }
      }

      // find vague openers
      for (const o of VAGUE_OPENERS) {
        const regex = new RegExp(o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let match
        while ((match = regex.exec(input)) !== null) {
          segments.push({
            start: match.index,
            end: match.index + match[0].length,
            type: 'opener',
          })
        }
      }

      // sort by start position, remove overlaps
      segments.sort((a, b) => a.start - b.start)
      const merged: Segment[] = []
      for (const seg of segments) {
        const last = merged[merged.length - 1]
        if (last && seg.start < last.end) continue
        merged.push(seg)
      }

      // build fragments
      const fragments: { text: string; type: 'normal' | 'slop' | 'passive' | 'opener' }[] = []
      let pos = 0
      for (const seg of merged) {
        if (seg.start > pos) {
          fragments.push({ text: input.slice(pos, seg.start), type: 'normal' })
        }
        fragments.push({ text: input.slice(seg.start, seg.end), type: seg.type })
        pos = seg.end
      }
      if (pos < input.length) {
        fragments.push({ text: input.slice(pos), type: 'normal' })
      }

      return fragments.length > 0 ? fragments : [{ text: input, type: 'normal' as const }]
    },
    [analyzed],
  )

  const fragments = getHighlightedText(text)

  const getScoreColor = (score: number): string => {
    if (score <= 10) return '#4EC373'
    if (score <= 30) return '#D2A53C'
    if (score <= 60) return '#E08C45'
    return '#E05555'
  }

  const getScoreLabel = (score: number): string => {
    if (score === 0) return 'clean'
    if (score <= 10) return 'minimal slop'
    if (score <= 30) return 'some slop'
    if (score <= 60) return 'sloppy'
    return 'maximum slop'
  }

  return (
    <div style={card}>
      <div style={sectionTitle}>// 09 — ANTI-SLOP DETECTOR</div>
      <p style={sectionDesc}>
        paste any text and see it scored against 20 anti-slop rules. corporate
        filler words, passive voice, and vague openers get flagged in real time.
        lower score = cleaner copy.
      </p>

      {/* score display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16,
          padding: '12px 16px',
          background: '#0D1117',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: getScoreColor(result.score),
            lineHeight: 1,
            minWidth: 60,
          }}
        >
          {result.score}
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: getScoreColor(result.score),
              fontWeight: 600,
            }}
          >
            {getScoreLabel(result.score)}
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            slop score (0-100, lower = better)
          </div>
        </div>

        {/* score bar */}
        <div
          style={{
            flex: 1,
            height: 6,
            background: 'var(--border)',
            borderRadius: 3,
            overflow: 'hidden',
            minWidth: 80,
          }}
        >
          <div
            style={{
              width: `${result.score}%`,
              height: '100%',
              background: getScoreColor(result.score),
              borderRadius: 3,
              transition: 'width 0.3s, background 0.3s',
            }}
          />
        </div>
      </div>

      {/* text input with highlights */}
      <div
        style={{
          position: 'relative',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            marginBottom: 6,
            letterSpacing: '0.05em',
          }}
        >
          INPUT TEXT (type or paste below):
        </div>

        {/* highlight layer (behind textarea) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 26,
            left: 0,
            right: 0,
            padding: '12px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'transparent',
            pointerEvents: 'none',
            borderRadius: 6,
            border: '1px solid transparent',
          }}
        >
          {fragments.map((f, i) => (
            <span
              key={i}
              style={{
                background:
                  f.type === 'slop'
                    ? 'rgba(224, 85, 85, 0.25)'
                    : f.type === 'passive'
                      ? 'rgba(210, 165, 60, 0.25)'
                      : f.type === 'opener'
                        ? 'rgba(224, 140, 69, 0.25)'
                        : 'transparent',
                borderBottom:
                  f.type !== 'normal'
                    ? `2px solid ${f.type === 'slop' ? '#E05555' : f.type === 'passive' ? '#D2A53C' : '#E08C45'}`
                    : 'none',
                color: 'transparent',
              }}
            >
              {f.text}
            </span>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setAnalyzed(true)
          }}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 160,
            padding: '12px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 6,
            resize: 'vertical',
            outline: 'none',
            caretColor: 'var(--accent)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* findings */}
      {result.foundSlop.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: '#E05555',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            CORPORATE FILLER ({result.foundSlop.length} found):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.foundSlop.map((s) => (
              <span
                key={s.word}
                style={{
                  padding: '3px 10px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#E05555',
                  background: 'rgba(224, 85, 85, 0.1)',
                  border: '1px solid rgba(224, 85, 85, 0.25)',
                  borderRadius: 3,
                }}
              >
                &quot;{s.word}&quot; {'\u2192'} &quot;{s.replacement}&quot;
                {s.count > 1 ? ` (x${s.count})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.foundPassive.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: '#D2A53C',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            PASSIVE VOICE ({result.foundPassive.length} found):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.foundPassive.map((p) => (
              <span
                key={p}
                style={{
                  padding: '3px 10px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#D2A53C',
                  background: 'rgba(210, 165, 60, 0.1)',
                  border: '1px solid rgba(210, 165, 60, 0.25)',
                  borderRadius: 3,
                }}
              >
                &quot;{p}&quot;
              </span>
            ))}
          </div>
        </div>
      )}

      {result.foundOpeners.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: '#E08C45',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            VAGUE OPENERS ({result.foundOpeners.length} found):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.foundOpeners.map((o) => (
              <span
                key={o}
                style={{
                  padding: '3px 10px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#E08C45',
                  background: 'rgba(224, 140, 69, 0.1)',
                  border: '1px solid rgba(224, 140, 69, 0.25)',
                  borderRadius: 3,
                }}
              >
                &quot;{o}&quot;
              </span>
            ))}
          </div>
        </div>
      )}

      {result.score === 0 && text.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(78, 195, 115, 0.08)',
            border: '1px solid rgba(78, 195, 115, 0.25)',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: '#4EC373',
            marginBottom: 12,
          }}
        >
          zero slop detected. clean copy.
        </div>
      )}

      {/* legend */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 12,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}
      >
        {[
          { label: 'corporate filler', color: '#E05555', penalty: '8pts each' },
          { label: 'passive voice', color: '#D2A53C', penalty: '6pts each' },
          { label: 'vague opener', color: '#E08C45', penalty: '10pts each' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: item.color,
                opacity: 0.6,
              }}
            />
            {item.label} ({item.penalty})
          </div>
        ))}
      </div>

      {/* action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setText(SLOP_EXAMPLE)}
          style={smallBtn(false)}
        >
          load sloppy example
        </button>
        <button
          onClick={() => setText(CLEAN_EXAMPLE)}
          style={smallBtn(false)}
        >
          load clean example
        </button>
        <button
          onClick={() => {
            setText('')
            setAnalyzed(true)
          }}
          style={smallBtn(false)}
        >
          clear
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  10 — PLATFORM FORMATTER                                            */
/* ================================================================== */

const SAMPLE_CONTENT = `I built a content system that takes one draft and turns it into posts for four platforms.

Here's how it works:

1. Write one raw draft in markdown — just the core idea, no formatting.
2. Run it through the voice normalizer — removes corporate filler, applies lowercase style, adds specific numbers.
3. The formatter splits it into platform-specific outputs: LinkedIn gets the long-form with hashtags, X gets a compressed thread, Substack gets the deep-dive with headers, TikTok gets a 60-second script with timestamps.

The whole pipeline runs from a single git push. No content calendar. No scheduling tool. No copy-pasting between tabs.

Three files. Four platforms. Zero manual formatting.

The system is the content strategy.`

type PlatformKey = 'linkedin' | 'x' | 'substack' | 'tiktok'

interface PlatformConfig {
  name: string
  color: string
  maxLength: string
  formatRules: string[]
  transform: (raw: string) => string
}

const PLATFORMS: Record<PlatformKey, PlatformConfig> = {
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    maxLength: '3,000 chars',
    formatRules: [
      'Hook in first two lines (above the fold)',
      'Short paragraphs with line breaks for readability',
      'Bullet points for scannable lists',
      '3-5 hashtags at the bottom',
      'Sign-off with identity marker',
    ],
    transform: (raw: string) => {
      const lines = raw.split('\n').filter((l) => l.trim())
      const hook = lines[0] || ''
      const body = lines.slice(1, -1).join('\n\n')
      const closer = lines[lines.length - 1] || ''
      return `${hook}

${body}

${closer}

---

#ContentOS #ContentStrategy #BuildInPublic #GTMEngineering #AIContent`
    },
  },
  x: {
    name: 'X (Thread)',
    color: '#1DA1F2',
    maxLength: '280 chars/tweet',
    formatRules: [
      'First tweet is the hook — must stand alone',
      'Number each tweet: 1/, 2/, 3/ etc.',
      'Max 280 characters per tweet',
      'No hashtags in thread body',
      'Last tweet = summary + CTA',
    ],
    transform: (raw: string) => {
      const lines = raw.split('\n').filter((l) => l.trim())
      const tweets = [
        `1/ ${lines[0]}`,
        `2/ ${lines[1] || 'here\'s how it works:'}`,
        `3/ step one: write a raw draft in markdown. just the idea, no formatting. the system handles the rest.`,
        `4/ step two: voice normalizer strips the slop. no "leveraging", no "innovative", no passive voice. just clean copy.`,
        `5/ step three: the formatter splits one draft into four platform-native outputs. different shape, same voice.`,
        `6/ the whole pipeline runs from a git push. no content calendar. no scheduling tool. no copy-pasting.`,
        `7/ three files. four platforms. zero manual formatting.\n\nthe system is the content strategy.\n\nfollow for more content infrastructure builds.`,
      ]
      return tweets.join('\n\n---\n\n')
    },
  },
  substack: {
    name: 'Substack',
    color: '#FF6719',
    maxLength: 'no limit',
    formatRules: [
      'Headline + subtitle for email subject',
      'TL;DR section at the top',
      'H2 headers for scannable sections',
      'Longer paragraphs — more context, more story',
      'End with takeaways or next steps',
    ],
    transform: (raw: string) => {
      return `# One Draft, Four Platforms: How Content OS Actually Works

**TL;DR:** I built a pipeline that takes a single markdown file and outputs formatted content for LinkedIn, X, Substack, and TikTok. No manual formatting. No content calendar. Git push to publish.

---

## The Problem with Multi-Platform Content

Every creator faces the same bottleneck: writing once and reformatting everywhere. Copy-pasting between tabs, adjusting tone, adding platform-specific elements. It takes longer than the writing itself.

## How the Pipeline Works

The system has three stages:

**Stage 1 — Raw Draft.** Write one markdown file with the core idea. No formatting, no platform thinking. Just the insight.

**Stage 2 — Voice Normalization.** The draft runs through anti-slop rules: remove corporate filler, apply lowercase style, replace vague claims with specific numbers.

**Stage 3 — Platform Formatting.** One draft becomes four outputs. LinkedIn gets long-form with hashtags. X gets a compressed thread. Substack gets the deep-dive. TikTok gets a 60-second script.

## The Result

Three files power the whole thing. A single git push triggers the pipeline. No scheduling tools. No content calendars. No tab-switching.

## Takeaways

- Write once, format never. The system handles platform-specific output.
- Voice consistency matters more than platform-native tricks.
- Git is a better content management system than any SaaS tool.

---

*What's the most manual part of your content workflow? Reply and tell me — I might build a system for it.*`
    },
  },
  tiktok: {
    name: 'TikTok Script',
    color: '#FE2C55',
    maxLength: '60-90 seconds',
    formatRules: [
      'Hook in first 2 seconds — pattern interrupt',
      'Timestamp markers for pacing',
      'Direct-to-camera energy',
      'On-screen text callouts noted in brackets',
      'Clear CTA at the end',
    ],
    transform: () => {
      return `[0:00] HOOK
"I write one draft and it turns into content for four platforms automatically."

[0:03] CONTEXT
"Most creators spend half their time reformatting. Copy-paste from LinkedIn to X, adjust the tone for Substack, write a separate TikTok script. I built a system that does all of that from a single file."

[0:15] THE SYSTEM
[TEXT ON SCREEN: "1 draft -> 4 platforms"]
"Step one — I write a raw draft in markdown. Just the idea, nothing else."
[TEXT ON SCREEN: "Voice Normalizer"]
"Step two — it runs through my anti-slop detector. Removes corporate filler. Applies my actual voice."
[TEXT ON SCREEN: "Platform Formatter"]
"Step three — the formatter outputs LinkedIn, X, Substack, and TikTok versions. Different format, same voice."

[0:40] THE RESULT
[TEXT ON SCREEN: "3 files. 4 platforms. 0 manual formatting."]
"The whole thing runs from a git push. No content calendar. No scheduling tool."

[0:50] CTA
"Follow if you want to see how the system gets built — one commit at a time."

---
TOTAL: ~55 seconds
AUDIO: original / voiceover
STYLE: screen recording + face cam overlay`
    },
  },
}

function PlatformFormatterDemo() {
  const [activeTab, setActiveTab] = useState<PlatformKey>('linkedin')
  const [rawText, setRawText] = useState(SAMPLE_CONTENT)
  const [showRaw, setShowRaw] = useState(false)

  const platform = PLATFORMS[activeTab]
  const formatted = platform.transform(rawText)
  const charCount = formatted.length

  return (
    <div style={card}>
      <div style={sectionTitle}>// 10 — PLATFORM FORMATTER</div>
      <p style={sectionDesc}>
        one block of raw content, four platform-native outputs. click each tab
        to see how the same content adapts — different format, same voice.
      </p>

      {/* raw/formatted toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setShowRaw(false)}
          style={smallBtn(!showRaw)}
        >
          formatted output
        </button>
        <button
          onClick={() => setShowRaw(true)}
          style={smallBtn(showRaw)}
        >
          raw input
        </button>
      </div>

      {showRaw ? (
        <>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 6,
              letterSpacing: '0.05em',
            }}
          >
            RAW CONTENT (edit to see formatting change):
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{
              width: '100%',
              minHeight: 200,
              padding: '12px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              background: '#0D1117',
              border: '1px solid var(--border)',
              borderRadius: 6,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </>
      ) : (
        <>
          {/* platform tabs */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              marginBottom: 16,
              borderBottom: '1px solid var(--border)',
              overflowX: 'auto',
            }}
          >
            {(Object.keys(PLATFORMS) as PlatformKey[]).map((key) => {
              const p = PLATFORMS[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '8px 16px',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? p.color : 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive
                      ? `2px solid ${p.color}`
                      : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </button>
              )
            })}
          </div>

          {/* stats bar */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginBottom: 16,
              padding: '8px 12px',
              background: '#0D1117',
              borderRadius: 4,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}
            >
              platform:{' '}
              <span style={{ color: platform.color }}>{platform.name}</span>
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}
            >
              chars:{' '}
              <span style={{ color: 'var(--text-primary)' }}>
                {charCount.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}
            >
              limit:{' '}
              <span style={{ color: 'var(--text-primary)' }}>
                {platform.maxLength}
              </span>
            </div>
          </div>

          {/* formatted output */}
          <div
            style={{
              padding: '16px 20px',
              background: '#0D1117',
              borderRadius: 8,
              borderLeft: `3px solid ${platform.color}`,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {formatted}
          </div>

          {/* platform rules */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: platform.color,
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              {platform.name.toUpperCase()} FORMAT RULES:
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {platform.formatRules.map((rule, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    paddingLeft: 12,
                  }}
                >
                  <span style={{ color: platform.color, marginRight: 6 }}>
                    {'\u2022'}
                  </span>
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ================================================================== */
/*  TABLE OF CONTENTS                                                  */
/* ================================================================== */

const TOC_ITEMS = [
  { id: 'demo-01', label: '01 Terminal Boot Sequence', group: 'core' },
  { id: 'demo-02', label: '02 Hook Style Switcher', group: 'core' },
  { id: 'demo-03', label: '03 Content Pipeline', group: 'core' },
  { id: 'demo-04', label: '04 Palette Explorer', group: 'core' },
  { id: 'demo-05', label: '05 Voice DNA Transform', group: 'core' },
  { id: 'demo-06', label: '06 Post Anatomy', group: 'core' },
  { id: 'demo-07', label: '07 Content Pillar Map', group: 'advanced' },
  { id: 'demo-08', label: '08 Recursive Content Loop', group: 'advanced' },
  { id: 'demo-09', label: '09 Anti-Slop Detector', group: 'advanced' },
  { id: 'demo-10', label: '10 Platform Formatter', group: 'advanced' },
]

function TableOfContents() {
  return (
    <div style={{ ...card, padding: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginBottom: 12,
          letterSpacing: '0.06em',
        }}
      >
        TABLE OF CONTENTS
      </div>

      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          marginBottom: 8,
          letterSpacing: '0.05em',
        }}
      >
        CORE DEMOS
      </div>
      {TOC_ITEMS.filter((t) => t.group === 'core').map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            display: 'block',
            padding: '4px 0',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--accent)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--text-secondary)')
          }
        >
          {item.label}
        </a>
      ))}

      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          marginBottom: 8,
          marginTop: 16,
          letterSpacing: '0.05em',
        }}
      >
        ADVANCED DEMOS
      </div>
      {TOC_ITEMS.filter((t) => t.group === 'advanced').map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            display: 'block',
            padding: '4px 0',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--accent)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--text-secondary)')
          }
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

/* ================================================================== */
/*  SECTION DIVIDER                                                    */
/* ================================================================== */

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '40px 0 24px',
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'var(--border)',
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'var(--border)',
        }}
      />
    </div>
  )
}

/* ================================================================== */
/*  ANCHOR WRAPPER                                                     */
/* ================================================================== */

function DemoAnchor({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div id={id} style={{ scrollMarginTop: 80 }}>
      {children}
    </div>
  )
}

/* ================================================================== */
/*  EXPORT — SHOWCASE DEMOS                                            */
/* ================================================================== */

export function ShowcaseDemos() {
  return (
    <>
      <TableOfContents />

      <SectionDivider label="CORE DEMOS" />

      {/* wrap each react-lab demo in an anchor */}
      <div id="demo-01" style={{ scrollMarginTop: 80 }} />
      <div id="demo-02" style={{ scrollMarginTop: 80 }} />
      <div id="demo-03" style={{ scrollMarginTop: 80 }} />
      <div id="demo-04" style={{ scrollMarginTop: 80 }} />
      <div id="demo-05" style={{ scrollMarginTop: 80 }} />
      <div id="demo-06" style={{ scrollMarginTop: 80 }} />
      <ReactLabDemos />

      <SectionDivider label="ADVANCED DEMOS" />

      <DemoAnchor id="demo-07">
        <ContentPillarMapDemo />
      </DemoAnchor>

      <DemoAnchor id="demo-08">
        <RecursiveContentLoopDemo />
      </DemoAnchor>

      <DemoAnchor id="demo-09">
        <AntiSlopDetectorDemo />
      </DemoAnchor>

      <DemoAnchor id="demo-10">
        <PlatformFormatterDemo />
      </DemoAnchor>
    </>
  )
}
