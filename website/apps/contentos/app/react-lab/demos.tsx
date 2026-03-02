'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ── shared styles ── */

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
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 4,
  color: disabled ? 'var(--text-muted)' : 'var(--accent)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  cursor: disabled ? 'not-allowed' : 'pointer',
})

/* ================================================================== */
/*  01 — TERMINAL BOOT SEQUENCE                                       */
/* ================================================================== */

const BOOT_LINES = [
  { text: '> AI/os boot --mode=content', color: '#4EC373', delay: 0 },
  { text: '> loading voice.config...', color: '#8B949E', delay: 400 },
  { text: '[OK] core-voice.md loaded (3 tiers)', color: '#4EC373', delay: 800 },
  { text: '[OK] viral-hooks.md loaded (12 styles)', color: '#4EC373', delay: 1100 },
  { text: '> scanning content pipeline...', color: '#8B949E', delay: 1500 },
  { text: '[PHASE 1] draft generation', color: '#E05555', delay: 1900 },
  { text: '[PHASE 2] voice normalization', color: '#D2A53C', delay: 2300 },
  { text: '[PHASE 3] platform formatting', color: '#50BED2', delay: 2700 },
  { text: '[PHASE 4] publish + distribute', color: '#4EC373', delay: 3100 },
  { text: '', color: '', delay: 3400 },
  { text: '> content OS operational.', color: '#4EC373', delay: 3500 },
  { text: '> the system is the content.', color: '#FF69B4', delay: 3900 },
]

function TerminalBootDemo() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [isBooting, setIsBooting] = useState(false)
  const [cursorOn, setCursorOn] = useState(true)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const boot = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisibleLines(0)
    setIsBooting(true)

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1)
        if (i === BOOT_LINES.length - 1) setIsBooting(false)
      }, line.delay)
      timersRef.current.push(t)
    })
  }, [])

  /* auto-boot on mount */
  useEffect(() => {
    boot()
    return () => timersRef.current.forEach(clearTimeout)
  }, [boot])

  /* blinking cursor */
  useEffect(() => {
    if (!isBooting) return
    const id = setInterval(() => setCursorOn((v) => !v), 530)
    return () => clearInterval(id)
  }, [isBooting])

  return (
    <div style={card}>
      <div style={sectionTitle}>// 01 — TERMINAL BOOT SEQUENCE</div>
      <p style={sectionDesc}>
        the aios-image aesthetic rendered as a live React component. every
        content image starts from this design system.
      </p>

      <div
        style={{
          background: '#0D1117',
          borderRadius: 8,
          padding: '16px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.8,
          minHeight: 280,
          overflow: 'hidden',
        }}
      >
        {/* traffic-light dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
          {['#FF5F56', '#FFBD2E', '#27C93F'].map((c) => (
            <div
              key={c}
              style={{ width: 10, height: 10, borderRadius: '50%', background: c }}
            />
          ))}
          <span style={{ marginLeft: 12, color: '#8B949E', fontSize: 11 }}>
            Shawn<span style={{ color: '#4EC373' }}> AI</span>/os command
          </span>
        </div>

        {BOOT_LINES.slice(0, visibleLines).map((line, i) =>
          line.text ? (
            <div key={i} style={{ color: line.color }}>
              {line.text}
            </div>
          ) : (
            <div key={i} style={{ height: 8 }} />
          ),
        )}

        {isBooting && (
          <span style={{ color: '#4EC373', opacity: cursorOn ? 1 : 0 }}>
            ▋
          </span>
        )}
      </div>

      <button
        onClick={boot}
        disabled={isBooting}
        style={{ ...smallBtn(false, isBooting), marginTop: 12 }}
      >
        {isBooting ? 'booting...' : '↻ reboot'}
      </button>
    </div>
  )
}

/* ================================================================== */
/*  02 — HOOK STYLE SWITCHER                                          */
/* ================================================================== */

const HOOK_STYLES = [
  {
    name: 'Question',
    hook: 'what if your content strategy was a git repo?',
    why: 'Opens with curiosity. Forces the reader to answer internally before scrolling.',
  },
  {
    name: 'Bold Claim',
    hook: "most content creators don't have a voice problem. they have a system problem.",
    why: 'Challenges conventional thinking. Positions the post as contrarian insight.',
  },
  {
    name: 'Number',
    hook: "I spent 47 hours building a content OS. here's what broke first.",
    why: 'Specific numbers create credibility. "What broke" creates tension.',
  },
  {
    name: 'Story',
    hook: 'last Tuesday at 2am I deleted my entire content calendar.',
    why: 'Drops into a scene. Time + action = immediate narrative pull.',
  },
  {
    name: 'Pattern',
    hook: 'every creator who scales past 10K followers has one thing in common: they stopped writing content and started building systems.',
    why: "Names a pattern others haven't articulated. Reader self-selects into the audience.",
  },
]

function HookStyleDemo() {
  const [active, setActive] = useState(0)

  return (
    <div style={card}>
      <div style={sectionTitle}>// 02 — HOOK STYLE SWITCHER</div>
      <p style={sectionDesc}>
        same topic, five different openers. hook style is a content operation —
        you choose it, you don&apos;t discover it.
      </p>

      {/* tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 20,
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
        }}
      >
        {HOOK_STYLES.map((h, i) => (
          <button
            key={h.name}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: i === active ? 'var(--accent)' : 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              borderBottom:
                i === active
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {h.name}
          </button>
        ))}
      </div>

      {/* hook text */}
      <div
        style={{
          fontSize: 18,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          minHeight: 60,
        }}
      >
        {HOOK_STYLES[active].hook}
      </div>

      {/* explanation */}
      <div
        style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginTop: 16,
          lineHeight: 1.6,
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
        }}
      >
        <span style={{ color: 'var(--accent)' }}>why it works: </span>
        {HOOK_STYLES[active].why}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  03 — CONTENT PIPELINE                                             */
/* ================================================================== */

const PIPELINE_STAGES = [
  { name: 'Idea', icon: '◇', color: '#E05555', output: 'raw thought captured in daily log' },
  { name: 'Draft', icon: '◆', color: '#D2A53C', output: 'structured post with hook + body + CTA' },
  { name: 'Voice', icon: '◈', color: '#50BED2', output: 'voice-normalized: slop removed, DNA applied' },
  { name: 'Format', icon: '▣', color: '#FF69B4', output: 'platform-specific: LinkedIn / X / Substack' },
  { name: 'Publish', icon: '✦', color: '#4EC373', output: 'live on platform + indexed in content OS' },
]

function ContentPipelineDemo() {
  const [activeStage, setActiveStage] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const runPipeline = () => {
    if (isRunning) return
    setIsRunning(true)
    setActiveStage(0)
    let stage = 0

    intervalRef.current = setInterval(() => {
      stage++
      if (stage >= PIPELINE_STAGES.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsRunning(false)
      } else {
        setActiveStage(stage)
      }
    }, 800)
  }

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    },
    [],
  )

  return (
    <div style={card}>
      <div style={sectionTitle}>// 03 — CONTENT PIPELINE</div>
      <p style={sectionDesc}>
        content moves through stages, not steps. each stage is a transformation
        with its own rules and output format.
      </p>

      {/* pipeline row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => {
                if (!isRunning) setActiveStage(i)
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 16px',
                minWidth: 80,
                borderRadius: 6,
                border: `1px solid ${i <= activeStage ? s.color : 'var(--border)'}`,
                background: i <= activeStage ? `${s.color}11` : 'transparent',
                cursor: isRunning ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  color: i <= activeStage ? s.color : 'var(--text-muted)',
                  transition: 'color 0.3s',
                }}
              >
                {s.icon}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: i <= activeStage ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginTop: 4,
                  transition: 'color 0.3s',
                }}
              >
                {s.name}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: 'var(--border)',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* output panel */}
      <div
        style={{
          padding: '12px 16px',
          background: '#0D1117',
          borderRadius: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          minHeight: 40,
        }}
      >
        <span style={{ color: PIPELINE_STAGES[activeStage].color }}>
          [{PIPELINE_STAGES[activeStage].name.toLowerCase()}]
        </span>
        <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
          {'\u2192'} {PIPELINE_STAGES[activeStage].output}
        </span>
      </div>

      <button
        onClick={runPipeline}
        disabled={isRunning}
        style={{ ...smallBtn(false, isRunning), marginTop: 12 }}
      >
        {isRunning ? 'running...' : '\u25B6 run pipeline'}
      </button>
    </div>
  )
}

/* ================================================================== */
/*  04 — PALETTE EXPLORER                                             */
/* ================================================================== */

const PALETTES = [
  {
    name: 'Terminal',
    bg: '#0D0D0D',
    primary: '#4EC373',
    secondary: '#C9D1D9',
    accent: '#D2A53C',
    muted: '#484F58',
    use: 'Technical content, system outputs, boot sequences',
  },
  {
    name: 'Synthwave',
    bg: '#1A0A2E',
    primary: '#FF2D95',
    secondary: '#E0E0E0',
    accent: '#00F0FF',
    muted: '#6B4D8A',
    use: 'Launch content, hype posts, creative showcases',
  },
  {
    name: 'Minimal Dark',
    bg: '#1C1C1E',
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    accent: '#FF69B4',
    muted: '#505050',
    use: 'Professional content, LinkedIn carousels, article headers',
  },
]

function PaletteExplorerDemo() {
  const [active, setActive] = useState(0)
  const p = PALETTES[active]

  return (
    <div style={card}>
      <div style={sectionTitle}>// 04 — PALETTE EXPLORER</div>
      <p style={sectionDesc}>
        three color schemas mapped to content types. each palette is
        infrastructure, not decoration.
      </p>

      {/* palette tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PALETTES.map((pal, i) => (
          <button
            key={pal.name}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: i === active ? pal.primary : 'var(--text-secondary)',
              background: i === active ? `${pal.primary}18` : 'transparent',
              border: `1px solid ${i === active ? pal.primary : 'var(--border)'}`,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {pal.name}
          </button>
        ))}
      </div>

      {/* preview terminal */}
      <div
        style={{
          background: p.bg,
          borderRadius: 8,
          padding: 20,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.8,
          transition: 'background 0.3s',
        }}
      >
        <div style={{ color: p.muted, fontSize: 11 }}>
          $ content generate --palette={p.name.toLowerCase().replace(' ', '-')}
        </div>
        <div style={{ color: p.primary, marginTop: 8 }}>
          [OK] palette loaded: {p.name}
        </div>
        <div style={{ color: p.secondary }}>
          primary: <span style={{ color: p.primary }}>{'\u25A0'}</span> {p.primary}
        </div>
        <div style={{ color: p.secondary }}>
          accent: <span style={{ color: p.accent }}>{'\u25A0'}</span> {p.accent}
        </div>
        <div style={{ color: p.muted, marginTop: 8 }}>// {p.use}</div>
      </div>

      {/* swatch strip */}
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {[
          { color: p.bg, label: 'bg' },
          { color: p.primary, label: 'primary' },
          { color: p.secondary, label: 'secondary' },
          { color: p.accent, label: 'accent' },
          { color: p.muted, label: 'muted' },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: color,
                border: '1px solid var(--border)',
              }}
            />
            {label}{' '}
            <span style={{ color: 'var(--text-muted)' }}>{color}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  05 — VOICE DNA TRANSFORM                                          */
/* ================================================================== */

const VOICE_EXAMPLES = [
  {
    before:
      "In today's fast-paced digital landscape, leveraging AI tools for content creation has become essential for modern marketers looking to scale their operations.",
    after:
      'most people use AI to write faster. I use it to build systems that write themselves.',
    rules: [
      'remove corporate filler',
      'lowercase opener',
      'first person, not third',
      'specific > vague',
    ],
  },
  {
    before:
      'We are excited to announce that our comprehensive content management system has been successfully deployed, enabling seamless workflow optimization across all channels.',
    after:
      'shipped the content OS last Tuesday. 47 files, 3 sites, zero manual steps. the system runs itself now.',
    rules: [
      'kill passive voice',
      'add specifics (47 files)',
      'casual tone',
      'show the result',
    ],
  },
  {
    before:
      'This innovative approach to content strategy utilizes cutting-edge technology to revolutionize how teams collaborate on cross-platform content distribution.',
    after:
      "I built a repo that turns one draft into posts for LinkedIn, X, and Substack. same voice, different format. that's it.",
    rules: [
      'no buzzwords',
      'explain like showing a friend',
      'end with simplicity',
      'builder not announcer',
    ],
  },
]

function VoiceBeforeAfterDemo() {
  const [active, setActive] = useState(0)
  const ex = VOICE_EXAMPLES[active]

  const panel = (type: 'before' | 'after'): React.CSSProperties => ({
    flex: 1,
    minWidth: 240,
    padding: 16,
    borderRadius: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    background: type === 'before' ? '#1C1215' : '#121C15',
    border: `1px solid ${type === 'before' ? '#3D2020' : '#203D20'}`,
  })

  return (
    <div style={card}>
      <div style={sectionTitle}>// 05 — VOICE DNA TRANSFORM</div>
      <p style={sectionDesc}>
        voice normalization is a content operation. it takes generic AI output
        and applies your voice DNA rules.
      </p>

      {/* example tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {VOICE_EXAMPLES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '4px 12px',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: i === active ? 'var(--accent)' : 'var(--text-muted)',
              background: 'transparent',
              border: `1px solid ${i === active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            example {i + 1}
          </button>
        ))}
      </div>

      {/* before / after panels */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={panel('before')}>
          <div
            style={{
              fontSize: 10,
              color: '#E05555',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            BEFORE — AI DEFAULT
          </div>
          <div style={{ color: '#A08080' }}>{ex.before}</div>
        </div>
        <div style={panel('after')}>
          <div
            style={{
              fontSize: 10,
              color: '#4EC373',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            AFTER — VOICE DNA
          </div>
          <div style={{ color: '#C9D1D9' }}>{ex.after}</div>
        </div>
      </div>

      {/* rule tags */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {ex.rules.map((rule) => (
          <span
            key={rule}
            style={{
              padding: '3px 10px',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              background: 'rgba(255, 105, 180, 0.08)',
              border: '1px solid rgba(255, 105, 180, 0.2)',
              borderRadius: 3,
            }}
          >
            {rule}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  06 — POST ANATOMY                                                 */
/* ================================================================== */

const POST_SECTIONS = [
  {
    id: 'hook',
    label: 'HOOK',
    color: '#E05555',
    text: 'I mass-deleted 200 contacts from my CRM last week.',
    note: 'Pattern interrupt. Specific number + unexpected action. Reader thinks: "why would you do that?"',
  },
  {
    id: 'tension',
    label: 'TENSION',
    color: '#D2A53C',
    text: "they were leads I'd been nurturing for 6 months.\n\nzero replies. zero opens. zero signal.\n\nbut every CRM dashboard said \"pipeline healthy\" because the count was high.",
    note: 'Builds the gap between expectation and reality. Short lines create rhythm. "Every dashboard said healthy" is the relatable pain.',
  },
  {
    id: 'insight',
    label: 'INSIGHT',
    color: '#50BED2',
    text: "here's what nobody tells you about outbound:\n\na big list isn't a pipeline.\na sent email isn't a touchpoint.\na \"maybe\" isn't a lead.\n\nvanity metrics in your CRM are the content equivalent of follower count.",
    note: 'The reframe. Three parallel negations create a pattern. Then the bridge to the reader\'s world (content equivalent).',
  },
  {
    id: 'proof',
    label: 'PROOF',
    color: '#FF69B4',
    text: 'after the purge:\n\u2022 reply rate went from 2% to 11%\n\u2022 booked meetings doubled\n\u2022 pipeline value actually went up\n\nfewer leads. better leads. same effort.',
    note: 'Concrete results with numbers. The paradox (fewer = better) is the memorable takeaway. Last line is quotable.',
  },
  {
    id: 'cta',
    label: 'CTA',
    color: '#4EC373',
    text: 'your CRM is lying to you.\ngo delete something.\n\nshawn \u26A1 the gtme alchemist \uD83E\uDDD9\u200D\u2642\uFE0F',
    note: 'Two-line CTA: provocative restatement + action. Sign-off with identity markers.',
  },
]

function PostAnatomyDemo() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <div style={card}>
      <div style={sectionTitle}>// 06 — POST ANATOMY</div>
      <p style={sectionDesc}>
        a LinkedIn post is five sections, not one blob. click any section label
        to see why it works.
      </p>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* post column */}
        <div
          style={{
            flex: '1 1 340px',
            background: '#0D1117',
            borderRadius: 8,
            padding: '20px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {POST_SECTIONS.map((s) => (
            <div
              key={s.id}
              onClick={() =>
                setActiveSection(activeSection === s.id ? null : s.id)
              }
              style={{
                padding: '8px 12px',
                marginBottom: 8,
                borderRadius: 4,
                borderLeft: `3px solid ${activeSection === s.id ? s.color : 'transparent'}`,
                background:
                  activeSection === s.id ? `${s.color}0D` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: s.color,
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                  opacity: activeSection === s.id ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              >
                [{s.label}]
              </div>
              <div
                style={{
                  color:
                    activeSection && activeSection !== s.id
                      ? 'var(--text-muted)'
                      : 'var(--text-primary)',
                  whiteSpace: 'pre-line',
                  transition: 'color 0.2s',
                }}
              >
                {s.text}
              </div>
            </div>
          ))}
        </div>

        {/* annotation panel */}
        <div
          style={{
            flex: '1 1 260px',
            padding: 16,
            borderRadius: 6,
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            minHeight: 120,
          }}
        >
          {activeSection ? (
            <>
              <div
                style={{
                  fontSize: 11,
                  color:
                    POST_SECTIONS.find((s) => s.id === activeSection)?.color,
                  marginBottom: 8,
                  letterSpacing: '0.05em',
                }}
              >
                [{POST_SECTIONS.find((s) => s.id === activeSection)?.label}]{' '}
                — WHY IT WORKS
              </div>
              <div>
                {POST_SECTIONS.find((s) => s.id === activeSection)?.note}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
              click a section label in the post to see the annotation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  EXPORT                                                            */
/* ================================================================== */

export function ReactLabDemos() {
  return (
    <>
      <TerminalBootDemo />
      <HookStyleDemo />
      <ContentPipelineDemo />
      <PaletteExplorerDemo />
      <VoiceBeforeAfterDemo />
      <PostAnatomyDemo />
    </>
  )
}
