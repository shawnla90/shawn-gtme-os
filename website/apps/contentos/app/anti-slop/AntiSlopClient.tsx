'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  MotionReveal,
  ScrollRevealSection,
  StaggerContainer,
  StaggerItem,
  SectionHeadline,
} from '@shawnos/shared/components'

/* ── detection data ────────────────────────────────── */

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
  { word: 'holistic', replacement: 'complete' },
  { word: 'proactive', replacement: 'early' },
  { word: 'actionable', replacement: 'specific' },
  { word: 'impactful', replacement: 'effective' },
  { word: 'deep dive', replacement: 'breakdown' },
  { word: 'unpack', replacement: 'explain' },
  { word: 'landscape', replacement: 'space' },
  { word: 'navigate', replacement: 'handle' },
  { word: 'double down', replacement: 'focus on' },
  { word: 'next-level', replacement: 'better' },
]

const AI_TELLS: { phrase: string; fix: string }[] = [
  { phrase: "It's worth noting", fix: 'Just state the thing.' },
  { phrase: "Let's dive in", fix: 'Start with the first point.' },
  { phrase: "Here's the thing", fix: 'Say the thing directly.' },
  { phrase: 'Interestingly enough', fix: 'If it is interesting, the content proves it.' },
  { phrase: "I'm excited to", fix: 'Skip the narrator setup. Show the work.' },
  { phrase: 'game-changing', fix: 'Say what specifically changed.' },
  { phrase: 'In conclusion', fix: 'The ending should be obvious without a label.' },
  { phrase: 'without further ado', fix: 'Just get to it.' },
  { phrase: 'buckle up', fix: 'Not a roller coaster. Deliver the insight.' },
  { phrase: 'spoiler alert', fix: 'State the point. Don\'t narrate yourself stating it.' },
  { phrase: 'not gonna lie', fix: 'Then don\'t. Just say the thing.' },
  { phrase: 'the reality is', fix: 'Assert it directly, no preamble.' },
  { phrase: 'at its core', fix: 'Just describe the core thing.' },
  { phrase: 'the bottom line', fix: 'Lead with the conclusion, skip the label.' },
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
  'were made',
  'were created',
  'were designed',
  'is considered',
  'are considered',
  'was built',
  'is known',
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
  'In the world of',
  'It is important to note',
  'There is no denying',
  'One thing is clear',
]

const SLOP_EXAMPLE =
  "In today's fast-paced digital landscape, it's no secret that leveraging innovative AI tools has been a game-changer. Here's the thing - our comprehensive and robust platform empowers stakeholders to utilize cutting-edge technology to revolutionize their content workflows. It's worth noting that this seamless, best-in-class solution will be the scalable paradigm shift that streamlines your entire ecosystem. Let's dive in - as we all know, synergy between disruptive tools creates value-add for every thought leader. The bottom line is that this holistic approach navigates the landscape of next-level content."

const CLEAN_EXAMPLE =
  "I built a content system that runs on three files and zero manual steps. it takes one draft, checks it against 44 anti-slop rules, and reformats for LinkedIn, X, and Substack. same voice, different shape. the whole thing deploys from a git push. no dashboards, no \"content calendars\" - just a repo that does the work."

/* ── analysis logic ────────────────────────────────── */

function analyze(input: string) {
  const foundSlop: { word: string; replacement: string; count: number }[] = []
  const foundPassive: string[] = []
  const foundOpeners: string[] = []
  const foundAiTells: { phrase: string; fix: string }[] = []

  for (const s of SLOP_WORDS) {
    const regex = new RegExp(`\\b${s.word.replace(/-/g, '[\\-\\s]?')}s?\\b`, 'gi')
    const matches = input.match(regex)
    if (matches) {
      foundSlop.push({ word: s.word, replacement: s.replacement, count: matches.length })
    }
  }

  const lower = input.toLowerCase()
  for (const p of PASSIVE_PATTERNS) {
    if (lower.includes(p.toLowerCase())) foundPassive.push(p)
  }
  for (const o of VAGUE_OPENERS) {
    if (lower.includes(o.toLowerCase())) foundOpeners.push(o)
  }
  for (const a of AI_TELLS) {
    if (lower.includes(a.phrase.toLowerCase())) foundAiTells.push(a)
  }

  const slopPenalty = foundSlop.reduce((sum, s) => sum + s.count * 8, 0)
  const passivePenalty = foundPassive.length * 6
  const openerPenalty = foundOpeners.length * 10
  const aiTellPenalty = foundAiTells.length * 7
  const score = Math.min(100, slopPenalty + passivePenalty + openerPenalty + aiTellPenalty)

  return { foundSlop, foundPassive, foundOpeners, foundAiTells, score }
}

type ViolationType = 'slop' | 'passive' | 'opener' | 'aitell'

function getHighlightedFragments(input: string) {
  type Segment = { start: number; end: number; type: ViolationType }
  const segments: Segment[] = []

  for (const s of SLOP_WORDS) {
    const regex = new RegExp(`\\b${s.word.replace(/-/g, '[\\-\\s]?')}s?\\b`, 'gi')
    let match
    while ((match = regex.exec(input)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'slop' })
    }
  }
  for (const p of PASSIVE_PATTERNS) {
    const regex = new RegExp(p.replace(/\s+/g, '\\s+'), 'gi')
    let match
    while ((match = regex.exec(input)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'passive' })
    }
  }
  for (const o of VAGUE_OPENERS) {
    const regex = new RegExp(o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    let match
    while ((match = regex.exec(input)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'opener' })
    }
  }
  for (const a of AI_TELLS) {
    const regex = new RegExp(a.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    let match
    while ((match = regex.exec(input)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'aitell' })
    }
  }

  segments.sort((a, b) => a.start - b.start)
  const merged: Segment[] = []
  for (const seg of segments) {
    const last = merged[merged.length - 1]
    if (last && seg.start < last.end) continue
    merged.push(seg)
  }

  const fragments: { text: string; type: 'normal' | ViolationType }[] = []
  let pos = 0
  for (const seg of merged) {
    if (seg.start > pos) fragments.push({ text: input.slice(pos, seg.start), type: 'normal' })
    fragments.push({ text: input.slice(seg.start, seg.end), type: seg.type })
    pos = seg.end
  }
  if (pos < input.length) fragments.push({ text: input.slice(pos), type: 'normal' })

  return fragments.length > 0 ? fragments : [{ text: input, type: 'normal' as const }]
}

function getScoreColor(score: number): string {
  if (score <= 10) return '#4EC373'
  if (score <= 30) return '#D2A53C'
  if (score <= 60) return '#E08C45'
  return '#E05555'
}

function getScoreLabel(score: number): string {
  if (score === 0) return 'Clean'
  if (score <= 10) return 'Minimal slop'
  if (score <= 30) return 'Some slop'
  if (score <= 60) return 'Sloppy'
  return 'Maximum slop'
}

/* ── violation type data ───────────────────────────── */

const violationTypes = [
  {
    label: 'Corporate Filler Words',
    color: '#E05555',
    penalty: '8 pts each',
    count: `${SLOP_WORDS.length} terms`,
    examples: ['leverage', 'innovative', 'seamless', 'robust', 'empower', 'holistic', 'actionable', 'landscape', 'navigate', 'next-level'],
    why: 'These words say nothing specific. They signal "I used AI" or "I copied a press release." Replace with plain language that actually describes what happened.',
    before: 'We leverage innovative AI to streamline your holistic content ecosystem.',
    after: 'We use AI to simplify your content system.',
  },
  {
    label: 'AI Tell Phrases',
    color: '#50BED2',
    penalty: '7 pts each',
    count: `${AI_TELLS.length} patterns`,
    examples: ["It's worth noting", "Let's dive in", "Here's the thing", 'buckle up', 'not gonna lie', 'the bottom line'],
    why: 'These are narrator setups - the writer announcing what they are about to say instead of saying it. AI loves these because they pad word count. Humans skip to the point.',
    before: "Here's the thing - it's worth noting that this approach is game-changing. Let's dive in.",
    after: 'This approach changed our conversion rate from 2% to 11%.',
  },
  {
    label: 'Passive Voice Patterns',
    color: '#D2A53C',
    penalty: '6 pts each',
    count: `${PASSIVE_PATTERNS.length} patterns`,
    examples: ['has been', 'was designed', 'is being', 'were created', 'is considered', 'was built'],
    why: 'Passive voice hides who did what. "The feature was built" vs "I built the feature." Active voice is clearer, shorter, and sounds like a real person wrote it.',
    before: 'The system was designed to be utilized by stakeholders who have been empowered.',
    after: 'I designed the system for the team to use.',
  },
  {
    label: 'Vague Openers',
    color: '#E08C45',
    penalty: '10 pts each',
    count: `${VAGUE_OPENERS.length} phrases`,
    examples: ["In today's", "It's no secret", 'As we all know', 'In the world of', 'There is no denying'],
    why: 'These waste the most valuable real estate in your content - the first line. Readers decide in 2 seconds. "In today\'s fast-paced world" earns zero attention.',
    before: "In today's fast-paced digital landscape, it's no secret that AI is transforming content.",
    after: 'AI writes 40% of LinkedIn posts now. Most of them sound identical.',
  },
]

/* ── component ─────────────────────────────────────── */

export function AntiSlopClient() {
  const [text, setText] = useState(SLOP_EXAMPLE)
  const result = analyze(text)
  const fragments = getHighlightedFragments(text)

  const loadExample = useCallback((example: string) => setText(example), [])

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '60dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(ellipse 800px 500px at 50% 40%, rgba(224, 85, 85, 0.1), transparent 60%), var(--canvas)',
          textAlign: 'center',
          padding: '80px 24px 60px',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.05}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#E05555',
              background: 'rgba(224, 85, 85, 0.08)',
              border: '1px solid rgba(224, 85, 85, 0.2)',
              borderRadius: 999,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Content Tool
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.15}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 16px',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Anti-Slop</span>{' '}
            <span style={{ color: '#E05555' }}>Detector</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto 32px',
            }}
          >
            AI-generated content sounds generic because nobody checks for it.
            This tool catches corporate filler, passive voice, and vague openers in real time.
          </p>
        </MotionReveal>

        {/* Animated score on load */}
        <MotionReveal variant="scale" delay={0.35}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 32px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: getScoreColor(result.score),
                lineHeight: 1,
              }}
            >
              {result.score}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: getScoreColor(result.score),
                }}
              >
                {getScoreLabel(result.score)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                slop score (0-100, lower = better)
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* ── Full Interactive Detector ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Score bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
              padding: '16px 20px',
              background: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: '40px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: getScoreColor(result.score),
                lineHeight: 1,
                minWidth: 70,
              }}
            >
              {result.score}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: getScoreColor(result.score),
                  marginBottom: 6,
                }}
              >
                {getScoreLabel(result.score)}
              </div>
              <div
                style={{
                  height: 8,
                  background: 'var(--border)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${result.score}%`,
                    height: '100%',
                    background: getScoreColor(result.score),
                    borderRadius: 4,
                    transition: 'width 0.3s, background 0.3s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Textarea with highlight layer */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 8,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Paste your content below
            </div>

            {/* Highlight layer */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 32,
                left: 0,
                right: 0,
                padding: '16px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'transparent',
                pointerEvents: 'none',
                borderRadius: 8,
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
                            : f.type === 'aitell'
                              ? 'rgba(80, 190, 210, 0.25)'
                              : 'transparent',
                    borderBottom:
                      f.type !== 'normal'
                        ? `2px solid ${f.type === 'slop' ? '#E05555' : f.type === 'passive' ? '#D2A53C' : f.type === 'aitell' ? '#50BED2' : '#E08C45'}`
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
              onChange={(e) => setText(e.target.value)}
              style={{
                position: 'relative',
                width: '100%',
                minHeight: 240,
                padding: '16px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                lineHeight: 1.8,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 8,
                resize: 'vertical',
                outline: 'none',
                caretColor: 'var(--accent)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { label: 'Load sloppy example', action: () => loadExample(SLOP_EXAMPLE) },
              { label: 'Load clean example', action: () => loadExample(CLEAN_EXAMPLE) },
              { label: 'Paste your own', action: () => setText('') },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--accent)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Findings */}
          {result.foundSlop.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#E05555',
                  marginBottom: 10,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Corporate Filler ({result.foundSlop.length} found)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.foundSlop.map((s) => (
                  <span
                    key={s.word}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      color: '#E05555',
                      background: 'rgba(224, 85, 85, 0.08)',
                      border: '1px solid rgba(224, 85, 85, 0.2)',
                      borderRadius: 6,
                    }}
                  >
                    &quot;{s.word}&quot; &rarr; &quot;{s.replacement}&quot;
                    {s.count > 1 ? ` (x${s.count})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.foundPassive.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#D2A53C',
                  marginBottom: 10,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Passive Voice ({result.foundPassive.length} found)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.foundPassive.map((p) => (
                  <span
                    key={p}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      color: '#D2A53C',
                      background: 'rgba(210, 165, 60, 0.08)',
                      border: '1px solid rgba(210, 165, 60, 0.2)',
                      borderRadius: 6,
                    }}
                  >
                    &quot;{p}&quot;
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.foundOpeners.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#E08C45',
                  marginBottom: 10,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Vague Openers ({result.foundOpeners.length} found)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.foundOpeners.map((o) => (
                  <span
                    key={o}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      color: '#E08C45',
                      background: 'rgba(224, 140, 69, 0.08)',
                      border: '1px solid rgba(224, 140, 69, 0.2)',
                      borderRadius: 6,
                    }}
                  >
                    &quot;{o}&quot;
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.foundAiTells.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#50BED2',
                  marginBottom: 10,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                AI Tells ({result.foundAiTells.length} found)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.foundAiTells.map((a) => (
                  <div
                    key={a.phrase}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 12,
                      padding: '8px 14px',
                      background: 'rgba(80, 190, 210, 0.06)',
                      border: '1px solid rgba(80, 190, 210, 0.2)',
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#50BED2', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      &quot;{a.phrase}&quot;
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {a.fix}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.score === 0 && text.length > 0 && (
            <div
              style={{
                padding: '14px 20px',
                background: 'rgba(78, 195, 115, 0.08)',
                border: '1px solid rgba(78, 195, 115, 0.2)',
                borderRadius: 8,
                fontSize: '14px',
                fontWeight: 600,
                color: '#4EC373',
                marginBottom: 20,
              }}
            >
              Zero slop detected. Clean copy.
            </div>
          )}

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Corporate filler', color: '#E05555', penalty: '8pts each' },
              { label: 'AI tells', color: '#50BED2', penalty: '7pts each' },
              { label: 'Passive voice', color: '#D2A53C', penalty: '6pts each' },
              { label: 'Vague opener', color: '#E08C45', penalty: '10pts each' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: item.color,
                    opacity: 0.7,
                  }}
                />
                {item.label} ({item.penalty})
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── Educational Section: The 3 Violation Types ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline
          label="VIOLATIONS"
          subtitle="What gets flagged and why it matters"
        >
          The 4 Violation Types
        </SectionHeadline>

        <StaggerContainer stagger={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {violationTypes.map((vt) => (
              <StaggerItem key={vt.label}>
                <div
                  style={{
                    padding: '28px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    borderLeft: `3px solid ${vt.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: vt.color,
                        margin: 0,
                      }}
                    >
                      {vt.label}
                    </h3>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        padding: '2px 10px',
                        border: `1px solid ${vt.color}40`,
                        borderRadius: 4,
                      }}
                    >
                      {vt.penalty}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        padding: '2px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                      }}
                    >
                      {vt.count}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: 16,
                    }}
                  >
                    {vt.why}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {vt.examples.map((ex) => (
                      <span
                        key={ex}
                        style={{
                          padding: '4px 12px',
                          fontSize: '13px',
                          color: vt.color,
                          background: `${vt.color}10`,
                          border: `1px solid ${vt.color}30`,
                          borderRadius: 4,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>

                  {/* Before / After */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                      paddingTop: 16,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#E05555', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                        Before
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        &quot;{vt.before}&quot;
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#4EC373', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                        After
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        &quot;{vt.after}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── The Philosophy ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline
          label="PHILOSOPHY"
          subtitle="Why this tool exists"
        >
          Substance Over Polish
        </SectionHeadline>

        <MotionReveal variant="fadeUp">
          <div
            style={{
              padding: '32px',
              background:
                'linear-gradient(135deg, rgba(224, 85, 85, 0.04), transparent), var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              Most AI content fails not because the ideas are bad, but because
              nobody checks for the patterns that make it <em>sound</em> like AI.
              Corporate filler words, passive constructions, and vague openers are
              the three biggest signals that content was generated, not written.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              The fix isn&apos;t better prompts. It&apos;s rules that run automatically.
              The Anti-Slop Detector is one piece of a larger content operating system
              that ensures your voice stays yours, even when AI does the drafting.
            </p>
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              Voice &gt; template. Substance &gt; polish. Specifics &gt; generics.
            </p>
          </div>
        </MotionReveal>
      </ScrollRevealSection>

      {/* ── CTA ── */}
      <ScrollRevealSection background="var(--canvas)" variant="scale">
        <SectionHeadline
          label="GO DEEPER"
          subtitle="Build your own content quality system"
        >
          Keep Exploring
        </SectionHeadline>

        <StaggerContainer stagger={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {[
              {
                href: '/content-wiki',
                label: 'Voice DNA in the Wiki',
                desc: 'The full voice system that powers anti-slop detection.',
              },
              {
                href: '/method',
                label: 'The Method',
                desc: 'The 3-tier architecture behind the content operating system.',
              },
              {
                href: '/how-to',
                label: 'How-To Guides',
                desc: 'Step-by-step guides for writing better content.',
              },
            ].map((link) => (
              <StaggerItem key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '24px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      marginBottom: 8,
                    }}
                  >
                    {link.label} &rarr;
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
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
