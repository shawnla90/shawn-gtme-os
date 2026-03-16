'use client'

import { useEffect, useState, useCallback } from 'react'
import { TerminalChrome } from '@shawnos/shared/components'

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

interface Signal {
  asset: string
  price_usd: number
  change_24h_pct: number
  action: string
  confidence: number
  reasoning: string[]
}

interface MarketSnapshot {
  btc_dominance_pct: number
  total_market_cap_usd: number
  fear_greed_index: number
  fear_greed_label: string
  assets: Record<string, { price_usd: number; change_24h_pct: number; market_cap_usd: number }>
}

interface SignalRun {
  agent: string
  timestamp: string
  date: string
  period: string
  market_snapshot: MarketSnapshot
  signals: Signal[]
  reddit_sentiment: {
    post_count: number
    avg_score: number
    top_topics: { title: string; score: number; sub: string }[]
  }
  disclaimer: string
  model: string
}

interface SignalData {
  last_updated: string
  runs: {
    morning?: SignalRun
    evening?: SignalRun
  }
}

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════ */

const sans = 'var(--font-sans)'
const mono = 'var(--font-mono)'

const GREEN = 'var(--accent, #4EC373)'
const RED = '#FF6B6B'
const AMBER = '#FFB86C'
const CYAN = '#6BE5FF'
const DIM = 'var(--text-muted, #484F58)'
const PURPLE = '#B48EFF'
const TEXT = 'var(--text-primary, #C9D1D9)'
const TEXT2 = 'var(--text-secondary, #8B949E)'
const CANVAS = 'var(--canvas, #0D1117)'
const CARD = 'var(--canvas-subtle, #161B22)'
const BORDER = 'var(--border, #30363D)'

const ACTION_COLORS: Record<string, string> = {
  hold: DIM,
  watch: AMBER,
  consider_buy: '#4EC373',
  consider_sell: RED,
}

const ACTION_LABELS: Record<string, string> = {
  hold: 'HOLD',
  watch: 'WATCH',
  consider_buy: 'CONSIDER BUY',
  consider_sell: 'CONSIDER SELL',
}

const BOOT_LINES = [
  '> crypto-os boot --mode=signal-lab',
  '> loading config... 3 assets tracked',
  '> connecting signal feed... [OK]',
  '> model: rule-based-v1',
  '> disclaimer: not financial advice. ever.',
]

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function formatUsd(n: number): string {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(2)}T`
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Generate a human-readable daily briefing from signal data. */
function generateBriefing(run: SignalRun, prevRun?: SignalRun): string[] {
  const lines: string[] = []
  const fg = run.market_snapshot.fear_greed_index
  const fgLabel = run.market_snapshot.fear_greed_label
  const btcSig = run.signals.find((s) => s.asset === 'BTC')
  const allHold = run.signals.every((s) => s.action === 'hold')
  const anyWatch = run.signals.some((s) => s.action === 'watch')
  const anyBuy = run.signals.some((s) => s.action === 'consider_buy')
  const anySell = run.signals.some((s) => s.action === 'consider_sell')

  // Market mood
  if (fg <= 20) {
    lines.push(
      `The market is in extreme fear (${fg}/100). Historically, extreme fear can signal buying opportunities — but it can also mean things get worse before they get better. This is when most people panic sell. The system watches for fear + price dip convergence before flagging anything.`
    )
  } else if (fg <= 35) {
    lines.push(
      `Market sentiment is fearful (${fg}/100 — ${fgLabel}). People are nervous. This doesn't mean "buy the dip" automatically — it means pay attention. Fear alone isn't a signal. Fear + a significant price drop together might be.`
    )
  } else if (fg >= 80) {
    lines.push(
      `The market is euphoric (${fg}/100 — ${fgLabel}). Everyone thinks it's going up forever. This is historically when corrections happen. If you're in profit, this is the time to consider whether your targets have been hit.`
    )
  } else if (fg >= 65) {
    lines.push(
      `Market sentiment is greedy (${fg}/100 — ${fgLabel}). Optimism is high. Not a sell signal on its own, but worth noting — markets often turn when everyone agrees on the direction.`
    )
  } else {
    lines.push(
      `Market sentiment is neutral (${fg}/100 — ${fgLabel}). No extreme emotion driving the market right now. This is a normal state — most of the time, the right move is to do nothing and keep learning.`
    )
  }

  // Signal interpretation
  if (allHold) {
    lines.push(
      'All signals are hold. This is the system working as designed — it defaults to "do nothing" unless multiple indicators converge. Most days are hold days. That\'s not a bug, it\'s the conservative bias keeping you out of impulsive trades.'
    )
  } else if (anyBuy) {
    const buyAssets = run.signals.filter((s) => s.action === 'consider_buy').map((s) => s.asset)
    lines.push(
      `The system flagged ${buyAssets.join(', ')} as consider_buy. This means fear and a price dip are converging — but it's not a buy order. Before acting: check if there's a fundamental reason for the drop (hack, regulation, project failure). If it's just market fear, the strategy rules say to dollar-cost average in with max 30% of your budget on any single asset.`
    )
  } else if (anySell) {
    const sellAssets = run.signals.filter((s) => s.action === 'consider_sell').map((s) => s.asset)
    lines.push(
      `The system flagged ${sellAssets.join(', ')} as consider_sell. Greed and a price pump are converging. If you hold these assets and you're in profit, evaluate whether your +20% take-profit target has been hit. Don't panic — this is a flag to review, not an order to sell.`
    )
  } else if (anyWatch) {
    const watchAssets = run.signals.filter((s) => s.action === 'watch').map((s) => s.asset)
    lines.push(
      `${watchAssets.join(', ')} moved to watch status. One indicator is firing but not enough for a directional signal. Keep an eye on the evening run to see if things intensify or calm down. No action needed.`
    )
  }

  // Comparison insight
  if (prevRun) {
    const changed = run.signals.filter((s) => {
      const prev = prevRun.signals.find((p) => p.asset === s.asset)
      return prev && prev.action !== s.action
    })
    if (changed.length > 0) {
      const descriptions = changed.map((s) => {
        const prev = prevRun.signals.find((p) => p.asset === s.asset)
        return `${s.asset} shifted from ${prev?.action} to ${s.action}`
      })
      lines.push(
        `Since the morning run: ${descriptions.join('; ')}. When signals change between runs, it means the market moved enough to cross a threshold. Pay extra attention to the reasoning on those assets.`
      )
    } else {
      lines.push(
        'Signals are consistent between morning and evening — the market hasn\'t moved enough to change any calls. Consistency reinforces the signal. If it says hold twice, it really means hold.'
      )
    }
  }

  return lines
}

/** Generate the $100 starting guide based on current market conditions. */
function generateStartingGuide(run: SignalRun): { title: string; body: string }[] {
  const fg = run.market_snapshot.fear_greed_index
  const sections: { title: string; body: string }[] = []

  sections.push({
    title: 'The $100 Framework',
    body: 'Starting capital is $100. This is learning money — small enough that losing it all is a lesson, not a crisis. The goal is building the skill of reading markets with AI assistance, not getting rich. Every decision gets journaled: what the system said, what you did, why, and what happened.',
  })

  // Conditional starting advice based on market conditions
  if (fg <= 30) {
    sections.push({
      title: 'Current Conditions: Fear',
      body: `The market is in fear territory (${fg}/100). Conventional wisdom says "be greedy when others are fearful." But conventional wisdom also gets people rekt. If you're just starting, consider: put $30 into BTC as your base position, keep $70 in reserve. Fear markets can drop further. Having reserve cash means you can add more if it does — instead of watching your entire $100 go down with no ability to act.`,
    })
  } else if (fg >= 70) {
    sections.push({
      title: 'Current Conditions: Greed',
      body: `The market is greedy (${fg}/100). This is the worst time to go all-in. Consider: start with a small $20 position in BTC just to have skin in the game, but keep $80 in reserve. Greedy markets often correct, and you want cash available to buy that dip when it comes. Patience is the hardest skill in crypto.`,
    })
  } else {
    sections.push({
      title: 'Current Conditions: Neutral',
      body: `The market is neutral (${fg}/100). Not fearful, not greedy. A reasonable starting point. Consider: $40 into BTC (the safest large-cap), $20 into ETH (the smart contract standard), $40 in reserve. Having reserve lets you react when the system eventually flags a consider_buy signal.`,
    })
  }

  sections.push({
    title: 'Position Rules',
    body: 'Never more than 30% of your budget in a single asset. Always keep at least 20% as cash reserve. Take profit at +20%. Cut losses at -15%. Wait for 2 consecutive signal runs showing the same direction before acting. These rules exist to prevent the two things that kill beginners: going all-in and holding losers forever.',
  })

  sections.push({
    title: 'The Recursive Loop',
    body: 'This page is the system teaching itself. The signal analyzer generates data. You read the briefing. You decide. You journal the outcome. That journal becomes context for improving the system. Your output becomes the system\'s input. The system\'s output becomes your input. Each day, the loop gets tighter. The briefings get more useful because the rules get refined by real decisions.',
  })

  return sections
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: sans,
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#4EC373',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: sans,
        fontSize: 'clamp(22px, 3vw, 30px)',
        fontWeight: 700,
        lineHeight: 1.2,
        color: TEXT,
        margin: '0 0 16px 0',
      }}
    >
      {children}
    </h2>
  )
}

function Card({
  children,
  highlight,
  style: extraStyle,
}: {
  children: React.ReactNode
  highlight?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${highlight ? highlight + '33' : BORDER}`,
        borderRadius: 12,
        padding: '20px',
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

function SignalCard({ signal, prevSignal }: { signal: Signal; prevSignal?: Signal }) {
  const actionColor = ACTION_COLORS[signal.action] || DIM
  const changed = prevSignal && prevSignal.action !== signal.action
  const priceDelta = prevSignal ? signal.price_usd - prevSignal.price_usd : null

  return (
    <Card highlight={actionColor}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: TEXT }}>
          {signal.asset}
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            fontWeight: 600,
            color: actionColor,
            background: `${actionColor}18`,
            padding: '3px 10px',
            borderRadius: 4,
            letterSpacing: '0.04em',
          }}
        >
          {ACTION_LABELS[signal.action] || signal.action}
        </span>
      </div>

      {/* Price */}
      <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 8 }}>
        ${formatPrice(signal.price_usd)}
      </div>

      {/* Change row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: mono,
            fontSize: 13,
            color: signal.change_24h_pct >= 0 ? '#4EC373' : RED,
          }}
        >
          {signal.change_24h_pct >= 0 ? '+' : ''}
          {signal.change_24h_pct.toFixed(2)}% 24h
        </span>
        {priceDelta !== null && (
          <span
            style={{
              fontFamily: mono,
              fontSize: 13,
              color: priceDelta >= 0 ? '#4EC373' : RED,
            }}
          >
            {priceDelta >= 0 ? '+' : ''}
            {formatUsd(priceDelta)} since AM
          </span>
        )}
      </div>

      {/* Signal changed */}
      {changed && prevSignal && (
        <div
          style={{
            fontFamily: sans,
            fontSize: 12,
            color: PURPLE,
            marginTop: 10,
            padding: '4px 0',
            borderTop: `1px solid ${PURPLE}22`,
          }}
        >
          Signal shifted: {ACTION_LABELS[prevSignal.action]} → {ACTION_LABELS[signal.action]}
        </div>
      )}

      {/* Confidence */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: sans, fontSize: 11, color: TEXT2 }}>Confidence</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: TEXT2 }}>
            {(signal.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: 4, height: 4, overflow: 'hidden' }}>
          <div
            style={{
              background: actionColor,
              height: '100%',
              width: `${signal.confidence * 100}%`,
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div style={{ marginTop: 12 }}>
        {signal.reasoning.map((r, i) => (
          <div
            key={i}
            style={{ fontFamily: sans, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}
          >
            &bull; {r}
          </div>
        ))}
      </div>
    </Card>
  )
}

function MarketBar({ snapshot }: { snapshot: MarketSnapshot }) {
  const fgColor =
    snapshot.fear_greed_index <= 30 ? RED : snapshot.fear_greed_index >= 70 ? '#4EC373' : AMBER

  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '14px 20px',
        marginBottom: 16,
      }}
    >
      <div>
        <span style={{ fontFamily: sans, fontSize: 11, color: TEXT2, display: 'block', marginBottom: 2 }}>
          Fear & Greed
        </span>
        <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: fgColor }}>
          {snapshot.fear_greed_index}
        </span>
        <span style={{ fontFamily: sans, fontSize: 12, color: fgColor, marginLeft: 6 }}>
          {snapshot.fear_greed_label}
        </span>
      </div>
      <div>
        <span style={{ fontFamily: sans, fontSize: 11, color: TEXT2, display: 'block', marginBottom: 2 }}>
          BTC Dominance
        </span>
        <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT }}>
          {snapshot.btc_dominance_pct}%
        </span>
      </div>
      <div>
        <span style={{ fontFamily: sans, fontSize: 11, color: TEXT2, display: 'block', marginBottom: 2 }}>
          Total Market Cap
        </span>
        <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT }}>
          {formatUsd(snapshot.total_market_cap_usd)}
        </span>
      </div>
    </div>
  )
}

function RunSection({
  run,
  label,
  prevRun,
}: {
  run: SignalRun
  label: string
  prevRun?: SignalRun
}) {
  return (
    <div style={{ marginTop: 40 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 16,
        }}
      >
        <SectionLabel>{label}</SectionLabel>
        <span style={{ fontFamily: mono, fontSize: 12, color: DIM }}>{timeAgo(run.timestamp)}</span>
      </div>

      <MarketBar snapshot={run.market_snapshot} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {run.signals.map((sig) => {
          const prevSig = prevRun?.signals.find((s) => s.asset === sig.asset)
          return <SignalCard key={sig.asset} signal={sig} prevSignal={prevSig} />
        })}
      </div>

      {run.reddit_sentiment.post_count > 0 && (
        <Card style={{ marginTop: 16 }}>
          <span
            style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: TEXT2, display: 'block', marginBottom: 8 }}
          >
            Reddit Sentiment ({run.reddit_sentiment.post_count} posts)
          </span>
          {run.reddit_sentiment.top_topics.map((t, i) => (
            <div key={i} style={{ fontFamily: sans, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>
              r/{t.sub} &middot; {t.title}{' '}
              <span style={{ fontFamily: mono, fontSize: 11, color: DIM }}>({t.score} pts)</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export function CryptoLab() {
  const [booted, setBooted] = useState(false)
  const [bootLine, setBootLine] = useState(0)
  const [signalData, setSignalData] = useState<SignalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setBootLine((prev) => {
        if (prev >= BOOT_LINES.length - 1) {
          clearInterval(interval)
          setTimeout(() => setBooted(true), 400)
          return prev
        }
        return prev + 1
      })
    }, 2500 / BOOT_LINES.length)
    return () => clearInterval(interval)
  }, [])

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch('/data/crypto-signals.json', { cache: 'no-store' })
      if (res.ok) {
        const data: SignalData = await res.json()
        setSignalData(data)
      }
    } catch {
      // no data yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (booted) fetchSignals()
  }, [booted, fetchSignals])

  const morning = signalData?.runs?.morning
  const evening = signalData?.runs?.evening
  const latestRun = evening || morning
  const hasSignals = !!latestRun

  const briefing = latestRun ? generateBriefing(latestRun, evening ? morning : undefined) : []
  const guide = latestRun ? generateStartingGuide(latestRun) : []

  return (
    <div style={{ minHeight: '100vh', background: CANVAS, color: TEXT }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: sans,
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              color: '#fff',
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            crypto-os
          </h1>
          <p
            style={{
              fontFamily: sans,
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: TEXT2,
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            $100 &middot; AI-powered signals &middot; human decisions &middot; built in public
          </p>
        </div>

        {/* ── Manifesto ── */}
        <Card highlight={CYAN} style={{ textAlign: 'center', marginBottom: 48, padding: '32px 24px' }}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 'clamp(20px, 3vw, 28px)',
              color: CYAN,
              margin: 0,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            AI analyzes. I decide. I execute.
          </p>
          <p
            style={{
              fontFamily: sans,
              fontSize: 15,
              color: TEXT2,
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            Two signal runs daily — 7 AM and 5:30 PM. Auto-deployed to this page.
            <br />
            No automated trading. No black box. Every call is mine.
          </p>
        </Card>

        {/* ── Boot Terminal (compact) ── */}
        <TerminalChrome title="crypto-os">
          <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.8 }}>
            {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
              <div key={i} style={{ color: i === bootLine && !booted ? '#4EC373' : '#555' }}>
                {line}
              </div>
            ))}
            {booted && (
              <div style={{ color: '#4EC373', marginTop: 6 }}>
                {'>'} system ready.{' '}
                {hasSignals ? `last signal: ${timeAgo(signalData!.last_updated)}` : 'awaiting first run.'}
              </div>
            )}
          </div>
        </TerminalChrome>

        {/* ── Loading / Empty State ── */}
        {booted && loading && (
          <p style={{ fontFamily: sans, color: TEXT2, marginTop: 32 }}>Loading signal data...</p>
        )}

        {booted && !loading && !hasSignals && (
          <Card style={{ marginTop: 32, textAlign: 'center', padding: 32 }}>
            <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 600, color: AMBER, margin: 0 }}>
              No signals yet
            </p>
            <p style={{ fontFamily: sans, fontSize: 14, color: TEXT2, marginTop: 8, lineHeight: 1.6 }}>
              The signal analyzer runs twice daily on the Mac Mini.
              Results auto-deploy to this page via GitHub. First run at 7 AM.
            </p>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════
           DAILY BRIEFING — The "what does this mean" section
           ═══════════════════════════════════════════════ */}
        {booted && hasSignals && (
          <div style={{ marginTop: 48 }}>
            <SectionLabel>Daily Briefing</SectionLabel>
            <SectionTitle>What the signals are telling you today</SectionTitle>
            <Card style={{ padding: 24 }}>
              {briefing.map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: sans,
                    fontSize: 15,
                    color: TEXT,
                    lineHeight: 1.7,
                    margin: i === 0 ? 0 : '16px 0 0 0',
                  }}
                >
                  {paragraph}
                </p>
              ))}
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: DIM,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${BORDER}`,
                  lineHeight: 1.6,
                }}
              >
                This briefing is generated from the signal data — not vibes. The rules are transparent:
                Fear & Greed thresholds, 24h price change thresholds, and convergence logic.
                When the system says hold, it means the data doesn&apos;t meet the bar for action.
              </p>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           SIGNAL RUNS
           ═══════════════════════════════════════════════ */}
        {booted && evening && (
          <RunSection run={evening} label="Evening Signal — 5:30 PM" prevRun={morning} />
        )}
        {booted && morning && <RunSection run={morning} label="Morning Signal — 7 AM" />}

        {/* ── Day Comparison ── */}
        {booted && morning && evening && (
          <div style={{ marginTop: 32 }}>
            <SectionLabel>Day Comparison</SectionLabel>
            <Card highlight={PURPLE}>
              {evening.signals.map((eSig) => {
                const mSig = morning.signals.find((s) => s.asset === eSig.asset)
                if (!mSig) return null
                const priceDelta = eSig.price_usd - mSig.price_usd
                const pricePct = mSig.price_usd > 0 ? (priceDelta / mSig.price_usd) * 100 : 0
                const actionChanged = eSig.action !== mSig.action
                return (
                  <div
                    key={eSig.asset}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <span style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, color: TEXT, minWidth: 50 }}>
                      {eSig.asset}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 13,
                        color: priceDelta >= 0 ? '#4EC373' : RED,
                      }}
                    >
                      {priceDelta >= 0 ? '+' : ''}
                      {formatUsd(priceDelta)} ({pricePct >= 0 ? '+' : ''}
                      {pricePct.toFixed(2)}%)
                    </span>
                    <span
                      style={{
                        fontFamily: sans,
                        fontSize: 12,
                        fontWeight: 600,
                        color: actionChanged ? PURPLE : DIM,
                      }}
                    >
                      {actionChanged
                        ? `${ACTION_LABELS[mSig.action]} → ${ACTION_LABELS[eSig.action]}`
                        : ACTION_LABELS[eSig.action]}
                    </span>
                  </div>
                )
              })}
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           STARTING GUIDE — Context-aware $100 playbook
           ═══════════════════════════════════════════════ */}
        {booted && hasSignals && (
          <div style={{ marginTop: 64 }}>
            <SectionLabel>Getting Started</SectionLabel>
            <SectionTitle>The $100 playbook — adapted to today&apos;s market</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {guide.map((section, i) => (
                <Card key={i}>
                  <h3
                    style={{
                      fontFamily: sans,
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#fff',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {section.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: 14,
                      color: TEXT2,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {section.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           HOW IT WORKS — The system explained
           ═══════════════════════════════════════════════ */}
        {booted && (
          <div style={{ marginTop: 64 }}>
            <SectionLabel>The System</SectionLabel>
            <SectionTitle>How this works — and how it learns</SectionTitle>
            <Card style={{ padding: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  {
                    step: '01',
                    title: 'Fetch',
                    desc: 'Every morning and evening, the signal analyzer pulls live data from CoinGecko (prices, market cap, BTC dominance) and the Fear & Greed Index (sentiment). No paid APIs. Everything free.',
                  },
                  {
                    step: '02',
                    title: 'Analyze',
                    desc: 'Rule-based analysis compares current data against thresholds. Extreme fear + price drop = consider buying. Extreme greed + price pump = consider selling. Everything else = hold. Simple, auditable, no black box.',
                  },
                  {
                    step: '03',
                    title: 'Deploy',
                    desc: 'Results write to a JSON file, auto-commit to GitHub, and Vercel rebuilds this page. By the time you check at 6 PM, the data is already here.',
                  },
                  {
                    step: '04',
                    title: 'Decide',
                    desc: "You read the briefing. You check the reasoning. You make the call. The system doesn't trade for you. It gives you structured data and interpretation. The human always has the final word.",
                  },
                  {
                    step: '05',
                    title: 'Learn',
                    desc: "Journal every decision — including decisions not to act. That journal feeds back into the system. What worked? What didn't? Where were the signals right? Where were they wrong? Each loop makes the next loop better.",
                  },
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#4EC373',
                        minWidth: 28,
                        paddingTop: 2,
                      }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#fff',
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: 14,
                          color: TEXT2,
                          lineHeight: 1.7,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── The Recursive Drift connection ── */}
        {booted && (
          <div style={{ marginTop: 48 }}>
            <SectionLabel>Recursive Drift</SectionLabel>
            <SectionTitle>Your output becomes my input</SectionTitle>
            <Card style={{ padding: 24 }}>
              <p style={{ fontFamily: sans, fontSize: 15, color: TEXT, lineHeight: 1.7, margin: 0 }}>
                This page is a live implementation of Recursive Drift applied to markets.
                The signal analyzer generates data. The briefing interprets that data into
                plain English. You read it, decide, and act (or don&apos;t). Your decisions get
                journaled. Those journals refine the rules. The refined rules produce better
                signals. Better signals produce better decisions.
              </p>
              <p style={{ fontFamily: sans, fontSize: 15, color: TEXT, lineHeight: 1.7, marginTop: 16 }}>
                The system isn&apos;t static — it compounds. Every pass through the loop adds context.
                The 30th day of signals is more useful than the 1st because 29 days of decisions,
                outcomes, and refinements feed back into the analysis. That&apos;s not a feature.
                That&apos;s the entire point.
              </p>
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: DIM,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${BORDER}`,
                }}
              >
                Not &ldquo;let AI do everything.&rdquo; The human decides when to switch states.
                The AI doesn&apos;t decide when to break or seed. You do.
              </p>
            </Card>
          </div>
        )}

        {/* ── Footer ── */}
        {booted && (
          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: `1px solid ${BORDER}`,
              textAlign: 'center',
            }}
          >
            <a
              href="https://github.com/shawnla90/crypto-os"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                fontFamily: sans,
                fontSize: 15,
                fontWeight: 600,
                color: CANVAS,
                background: '#4EC373',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: 6,
                transition: 'opacity 0.15s ease',
              }}
            >
              View on GitHub
            </a>
            <div style={{ marginTop: 20 }}>
              <a
                href="/method"
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#4EC373',
                  textDecoration: 'none',
                }}
              >
                Read about Recursive Drift →
              </a>
            </div>
            <p
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: DIM,
                marginTop: 24,
                lineHeight: 1.6,
              }}
            >
              Not financial advice. This is a learning project with a $100 budget.
              <br />
              The system is transparent. The code is public. The decisions are mine.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
