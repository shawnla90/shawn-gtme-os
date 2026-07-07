'use client'

// Interactive "run it yourself" island for the Founder's Journey Ep2 post.
// The reader answers the same `help me set up` interview from the episode
// (company, GTM motions, stack) and walks away with a personalized CLAUDE.md
// + folder tree they can copy — the artifact the video produces, but theirs.
// Rendered between two .prose halves via the {{quickstart-terminal}} marker.

import { useState, type CSSProperties } from 'react'
import { TerminalChrome } from '@shawnos/shared/components'
import { FileTree, type FileTreeElement } from '../unlumen-ui/file-tree'

// ─── the interview options ───────────────────────────────────────────────────

const MOTIONS = ['Outbound', 'Content', 'ABM', 'Paid', 'Events', 'Partnerships', 'PLG']

// Shawn's real answers from the episode — the "load the example" preset.
const CLEARBOX = {
  company: 'Clearbox',
  sells:
    'a Reddit opportunity inbox that surfaces high-intent leads, competitor mentions, and engagement opportunities',
  motions: ['Outbound', 'Content', 'ABM', 'Partnerships', 'PLG'],
  stack: [
    'Attio — CRM',
    'Claude Code (terminal) + Codex (app)',
    'DeepLine — waterfall enrichment',
    'Playwright — headless scraping',
    'Apollo — GTM data layer',
    'SQLite on an always-on Mac mini M4 Pro',
  ].join('\n'),
}

// ─── artifact generators (pure) ──────────────────────────────────────────────

function slugify(s: string, fallback: string): string {
  const out = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return out || fallback
}

function toolList(stack: string): string[] {
  return stack
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function buildClaudeMd(company: string, sells: string, motions: string[], tools: string[]): string {
  const name = company.trim() || 'Your Company'
  const sale = sells.trim() || '[what you sell]'
  const mot = motions.length ? motions.join(', ') : '[your GTM motions]'
  const stack = tools.length
    ? tools.map((t) => `- ${t}`).join('\n')
    : '- [your CRM]\n- [enrichment]\n- [sequencing]'
  return `# ${name} GTM — Operating Instructions

You are a GTM operations assistant for ${name}.

## Identity
- Company: ${name}
- Sells: ${sale}
- Motions: ${mot}

## Stack
${stack}

## Source of truth
- ICP: demand/icp.md
- Positioning: demand/positioning.md
- Attack angles: messaging/attack-angles.md
- Tool docs: engine/

## Rules
- Keep this file under 200 lines. Reiterate on it as the work changes — it's the first thing I read every session.
- One business per repo. Don't mix an agency and a product in the same context.
- Read the ICP before any outbound. Never fabricate metrics, names, or case studies.
- Log strategic calls in log.md; update status.md after real work.
`
}

function buildTreeText(company: string, tools: string[], hasContent: boolean): string {
  const root = `${slugify(company, 'your-company')}-gtm`
  const list = tools.length ? tools : ['your-crm', 'enrichment', 'sequencing']
  const engine = list.map((t, i) => `    ${slugify(t, `tool-${i + 1}`)}.md`).join('\n')
  const content = hasContent ? '\n  content/\n    ideas.md' : ''
  return `${root}/
  CLAUDE.md
  README.md
  demand/
    icp.md
    positioning.md
    competitors.md
  messaging/
    attack-angles.md
  segments/
    segment-01.md
  engine/
${engine}
  campaigns/
    active/${content}
  status.md
  log.md`
}

function buildTreeElements(company: string, tools: string[], hasContent: boolean): FileTreeElement[] {
  const root = `${slugify(company, 'your-company')}-gtm`
  const list = tools.length ? tools : ['your-crm', 'enrichment', 'sequencing']
  const engineChildren: FileTreeElement[] = list.map((t, i) => ({
    id: `engine-${i}`,
    name: `${slugify(t, `tool-${i + 1}`)}.md`,
    highlight: true,
  }))
  const children: FileTreeElement[] = [
    { id: 'claude', name: 'CLAUDE.md', highlight: true },
    { id: 'readme', name: 'README.md' },
    {
      id: 'demand',
      name: 'demand',
      type: 'folder',
      defaultOpen: true,
      children: [
        { id: 'icp', name: 'icp.md' },
        { id: 'positioning', name: 'positioning.md' },
        { id: 'competitors', name: 'competitors.md' },
      ],
    },
    {
      id: 'messaging',
      name: 'messaging',
      type: 'folder',
      children: [{ id: 'angles', name: 'attack-angles.md' }],
    },
    {
      id: 'segments',
      name: 'segments',
      type: 'folder',
      children: [{ id: 'seg1', name: 'segment-01.md' }],
    },
    { id: 'engine', name: 'engine', type: 'folder', defaultOpen: true, children: engineChildren },
    {
      id: 'campaigns',
      name: 'campaigns',
      type: 'folder',
      children: [{ id: 'active', name: 'active', type: 'folder', children: [] }],
    },
  ]
  if (hasContent) {
    children.push({
      id: 'content',
      name: 'content',
      type: 'folder',
      children: [{ id: 'ideas', name: 'ideas.md' }],
    })
  }
  children.push({ id: 'status', name: 'status.md' }, { id: 'log', name: 'log.md' })
  return [{ id: 'root', name: root, type: 'folder', defaultOpen: true, children }]
}

// ─── shared styles ───────────────────────────────────────────────────────────

const monoLabel: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--text-muted)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}

const primaryBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 18px',
  borderRadius: '9999px',
  background: 'var(--text-primary)',
  color: 'var(--canvas)',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
}

const ghostBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 14px',
  borderRadius: '9999px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: '13px',
  fontWeight: 600,
  border: '1px solid var(--canvas-border, var(--border))',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
}

function inputStyle(focused: boolean): CSSProperties {
  return {
    width: '100%',
    background: 'var(--canvas-subtle)',
    border: `1px solid ${focused ? 'var(--accent)' : 'var(--canvas-border, var(--border))'}`,
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export function QuickstartTerminal() {
  const [step, setStep] = useState(0) // 0 company · 1 motions · 2 stack · 3 result
  const [company, setCompany] = useState('')
  const [sells, setSells] = useState('')
  const [motions, setMotions] = useState<string[]>([])
  const [stack, setStack] = useState('')
  const [focus, setFocus] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const tools = toolList(stack)
  const hasContent = motions.includes('Content')
  const claudeMd = buildClaudeMd(company, sells, motions, tools)
  const treeText = buildTreeText(company, tools, hasContent)
  const treeElements = buildTreeElements(company, tools, hasContent)

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text)
    setCopied(key)
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800)
  }

  const loadExample = () => {
    setCompany(CLEARBOX.company)
    setSells(CLEARBOX.sells)
    setMotions(CLEARBOX.motions)
    setStack(CLEARBOX.stack)
    setStep(3)
  }

  const reset = () => {
    setCompany('')
    setSells('')
    setMotions([])
    setStack('')
    setStep(0)
  }

  const toggleMotion = (m: string) =>
    setMotions((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]))

  const answered = (label: string, value: string) => (
    <div style={{ marginBottom: '14px' }}>
      <div style={monoLabel}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--aura-strong)',
          marginTop: '3px',
          whiteSpace: 'pre-wrap',
        }}
      >
        › {value}
      </div>
    </div>
  )

  return (
    <div className="not-prose" style={{ margin: '2.75rem 0' }}>
      {/* header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '12px',
        }}
      >
        <span style={monoLabel}>// run it yourself</span>
        <button type="button" style={ghostBtn} onClick={loadExample}>
          load the Clearbox example ↺
        </button>
      </div>

      <TerminalChrome title="claude — help me set up">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--aura-strong)' }}>❯</span> help me set up
          </div>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: '10px 0 22px',
              lineHeight: 1.55,
            }}
          >
            Building your GTM knowledge base. Three questions — answer like you&apos;re talking to the
            agent, not filling a form.
          </p>

          {/* answered log */}
          {step > 0 && answered('01 · what does your company sell?', `${company}${sells ? ` — ${sells}` : ''}`)}
          {step > 1 && answered('02 · what GTM motions do you run?', motions.join(', ') || '—')}
          {step > 2 && answered('03 · what’s in your stack?', tools.join(', ') || '—')}

          {/* step 0 — company */}
          {step === 0 && (
            <div>
              <div style={monoLabel}>01 · what does your company sell?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0 14px' }}>
                <input
                  aria-label="Company name"
                  placeholder="company name (e.g. Clearbox)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onFocus={() => setFocus('company')}
                  onBlur={() => setFocus('')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && company.trim()) setStep(1)
                  }}
                  style={inputStyle(focus === 'company')}
                />
                <input
                  aria-label="What it sells"
                  placeholder="what it sells, in one line"
                  value={sells}
                  onChange={(e) => setSells(e.target.value)}
                  onFocus={() => setFocus('sells')}
                  onBlur={() => setFocus('')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && company.trim()) setStep(1)
                  }}
                  style={inputStyle(focus === 'sells')}
                />
              </div>
              <button
                type="button"
                style={{ ...primaryBtn, opacity: company.trim() ? 1 : 0.5 }}
                disabled={!company.trim()}
                onClick={() => setStep(1)}
              >
                next →
              </button>
            </div>
          )}

          {/* step 1 — motions */}
          {step === 1 && (
            <div>
              <div style={monoLabel}>02 · what GTM motions do you run?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0 16px' }}>
                {MOTIONS.map((m) => {
                  const active = motions.includes(m)
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMotion(m)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        background: active ? 'var(--text-primary)' : 'transparent',
                        color: active ? 'var(--canvas)' : 'var(--text-muted)',
                        border: `1px solid ${active ? 'var(--text-primary)' : 'var(--canvas-border, var(--border))'}`,
                      }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" style={ghostBtn} onClick={() => setStep(0)}>
                  ← back
                </button>
                <button
                  type="button"
                  style={{ ...primaryBtn, opacity: motions.length ? 1 : 0.5 }}
                  disabled={!motions.length}
                  onClick={() => setStep(2)}
                >
                  next →
                </button>
              </div>
            </div>
          )}

          {/* step 2 — stack */}
          {step === 2 && (
            <div>
              <div style={monoLabel}>03 · what&apos;s in your stack?</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '6px 0 10px' }}>
                one per line — CRM, enrichment, scraping, data, wherever the context lives.
              </p>
              <textarea
                aria-label="Your stack"
                rows={5}
                placeholder={'Attio — CRM\nClaude Code + Codex\nApollo — GTM data\nSQLite on a Mac mini'}
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                onFocus={() => setFocus('stack')}
                onBlur={() => setFocus('')}
                style={{ ...inputStyle(focus === 'stack'), resize: 'vertical', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                <button type="button" style={ghostBtn} onClick={() => setStep(1)}>
                  ← back
                </button>
                <button
                  type="button"
                  style={{ ...primaryBtn, opacity: tools.length ? 1 : 0.5 }}
                  disabled={!tools.length}
                  onClick={() => setStep(3)}
                >
                  build my setup ▸
                </button>
              </div>
            </div>
          )}

          {/* step 3 — done */}
          {step === 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--aura-strong)' }}>✓ built your knowledge base</span>
              <button type="button" style={ghostBtn} onClick={reset}>
                start over ↺
              </button>
            </div>
          )}
        </div>
      </TerminalChrome>

      {/* the artifact */}
      {step === 3 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ ...monoLabel, margin: 0 }}>// the artifact — yours to keep</p>

          {/* CLAUDE.md card */}
          <div
            style={{
              border: '1px solid var(--canvas-border, var(--border))',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--canvas-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: '1px solid var(--canvas-border, var(--border))',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                CLAUDE.md
              </span>
              <button
                type="button"
                style={{ ...ghostBtn, padding: '5px 12px', fontSize: '12px' }}
                onClick={() => copy(claudeMd, 'claude')}
              >
                {copied === 'claude' ? 'copied ✓' : 'copy CLAUDE.md'}
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '18px',
                overflowX: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre',
              }}
            >
              {claudeMd}
            </pre>
          </div>

          {/* folder tree */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                your folder tree — engine/ holds one doc per tool
              </span>
              <button
                type="button"
                style={{ ...ghostBtn, padding: '5px 12px', fontSize: '12px' }}
                onClick={() => copy(treeText, 'tree')}
              >
                {copied === 'tree' ? 'copied ✓' : 'copy structure'}
              </button>
            </div>
            <FileTree
              elements={treeElements}
              highlightColor="var(--aura-strong)"
              defaultOpenIds={['root', 'demand', 'engine']}
            />
          </div>

          {/* CTA back to the repo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '16px 18px',
              borderRadius: '12px',
              border: '1px solid var(--canvas-border, var(--border))',
            }}
          >
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1, minWidth: '220px' }}>
              That&apos;s the skeleton. Now run it for real — boot Claude Code in the repo and type{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>help me set up</code>.
            </span>
            <a
              href="https://github.com/shawnla90/gtm-coding-agent"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...primaryBtn, textDecoration: 'none' }}
            >
              ▶ run the real thing ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
