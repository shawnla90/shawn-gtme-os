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
  reddit_sentiment: { post_count: number; avg_score: number; top_topics: { title: string; score: number; sub: string }[] }
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
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const GREEN = '#4EC373'
const RED = '#FF6B6B'
const AMBER = '#FFB86C'
const CYAN = '#6BE5FF'
const DIM = '#666'
const PURPLE = '#B48EFF'

const BOOT_LINES = [
  '> crypto-os boot --mode=signal-lab',
  '> loading config... 3 assets tracked',
  '> connecting signal feed... [OK]',
  '> model: rule-based-v1',
  '> disclaimer: not financial advice. ever.',
]

const BOOT_DURATION = 2500

const ACTION_COLORS: Record<string, string> = {
  hold: DIM,
  watch: AMBER,
  consider_buy: GREEN,
  consider_sell: RED,
}

const ACTION_LABELS: Record<string, string> = {
  hold: 'HOLD',
  watch: 'WATCH',
  consider_buy: 'CONSIDER BUY',
  consider_sell: 'CONSIDER SELL',
}

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

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

function SignalCard({ signal, prevSignal }: { signal: Signal; prevSignal?: Signal }) {
  const actionColor = ACTION_COLORS[signal.action] || DIM
  const changed = prevSignal && prevSignal.action !== signal.action
  const priceDelta = prevSignal ? signal.price_usd - prevSignal.price_usd : null

  return (
    <div
      style={{
        background: '#0d1117',
        border: `1px solid ${actionColor}44`,
        borderRadius: 8,
        padding: '1.25rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
          {signal.asset}
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: actionColor,
            background: `${actionColor}18`,
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {ACTION_LABELS[signal.action] || signal.action}
        </span>
      </div>

      {/* Price */}
      <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', color: '#fff', marginTop: '0.5rem' }}>
        ${signal.price_usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>

      {/* 24h change + inter-run delta */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: signal.change_24h_pct >= 0 ? GREEN : RED,
          }}
        >
          24h: {signal.change_24h_pct >= 0 ? '+' : ''}{signal.change_24h_pct.toFixed(2)}%
        </span>
        {priceDelta !== null && (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: priceDelta >= 0 ? GREEN : RED,
            }}
          >
            since AM: {priceDelta >= 0 ? '+' : ''}{formatUsd(priceDelta)}
          </span>
        )}
      </div>

      {/* Signal change indicator */}
      {changed && prevSignal && (
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: PURPLE, marginTop: '0.5rem' }}>
          signal changed: {ACTION_LABELS[prevSignal.action]} → {ACTION_LABELS[signal.action]}
        </div>
      )}

      {/* Confidence bar */}
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#888' }}>confidence</span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#888' }}>
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
            }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div style={{ marginTop: '0.75rem' }}>
        {signal.reasoning.map((r, i) => (
          <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', lineHeight: 1.6 }}>
            &bull; {r}
          </div>
        ))}
      </div>
    </div>
  )
}

function RunSection({ run, label, prevRun }: { run: SignalRun; label: string; prevRun?: SignalRun }) {
  const snap = run.market_snapshot
  const fgColor = snap.fear_greed_index <= 30 ? RED : snap.fear_greed_index >= 70 ? GREEN : AMBER

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Run header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#999', margin: 0 }}>
          {'>'} {label}
        </h2>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: DIM }}>
          {timeAgo(run.timestamp)}
        </span>
      </div>

      {/* Market overview bar */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          background: '#0d1117',
          border: '1px solid #222',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          <span style={{ color: '#666' }}>F&G </span>
          <span style={{ color: fgColor, fontWeight: 600 }}>
            {snap.fear_greed_index} ({snap.fear_greed_label})
          </span>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          <span style={{ color: '#666' }}>BTC dom </span>
          <span style={{ color: '#ccc' }}>{snap.btc_dominance_pct}%</span>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          <span style={{ color: '#666' }}>Total MCap </span>
          <span style={{ color: '#ccc' }}>{formatUsd(snap.total_market_cap_usd)}</span>
        </div>
      </div>

      {/* Signal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {run.signals.map((sig) => {
          const prevSig = prevRun?.signals.find((s) => s.asset === sig.asset)
          return <SignalCard key={sig.asset} signal={sig} prevSignal={prevSig} />
        })}
      </div>

      {/* Reddit sentiment */}
      {run.reddit_sentiment.post_count > 0 && (
        <div
          style={{
            background: '#0d1117',
            border: '1px solid #222',
            borderRadius: 8,
            padding: '1rem 1.25rem',
            marginTop: '1rem',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem' }}>
            Reddit sentiment ({run.reddit_sentiment.post_count} posts scanned)
          </div>
          {run.reddit_sentiment.top_topics.map((t, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', lineHeight: 1.6 }}>
              r/{t.sub} &middot; {t.title} ({t.score} pts)
            </div>
          ))}
        </div>
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

  // Boot sequence
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
    }, BOOT_DURATION / BOOT_LINES.length)
    return () => clearInterval(interval)
  }, [])

  // Fetch signal data from static JSON (deployed by cron)
  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch('/data/crypto-signals.json', { cache: 'no-store' })
      if (res.ok) {
        const data: SignalData = await res.json()
        setSignalData(data)
      }
    } catch {
      // No signal data yet — page still renders
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (booted) fetchSignals()
  }, [booted, fetchSignals])

  const morning = signalData?.runs?.morning
  const evening = signalData?.runs?.evening
  const hasSignals = morning || evening

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'monospace',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: CYAN,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            crypto-os
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#999', marginTop: '0.5rem' }}>
            $100 &middot; AI signals &middot; human decisions &middot; built in public
          </p>
        </div>

        {/* Cyborg manifesto */}
        <div
          style={{
            border: `1px solid ${CYAN}33`,
            borderRadius: 8,
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#0d1117',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: CYAN, margin: 0, fontWeight: 600 }}>
            AI analyzes. I decide. I execute.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#666', marginTop: '0.75rem' }}>
            Two signal runs daily — 7 AM and 5:30 PM. Auto-deployed to this page.
            <br />
            No automated trading. Every call is mine.
          </p>
        </div>

        {/* Boot terminal */}
        <TerminalChrome title="crypto-os — signal lab">
          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8 }}>
            {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
              <div key={i} style={{ color: i === bootLine && !booted ? GREEN : '#888' }}>
                {line}
              </div>
            ))}
            {booted && (
              <div style={{ color: GREEN, marginTop: '0.5rem' }}>
                {'>'} system ready. {hasSignals ? `last signal: ${timeAgo(signalData!.last_updated)}` : 'awaiting first signal run.'}
              </div>
            )}
          </div>
        </TerminalChrome>

        {/* Signal runs */}
        {booted && loading && (
          <p style={{ fontFamily: 'monospace', color: DIM, marginTop: '2rem' }}>loading signal data...</p>
        )}

        {booted && !loading && !hasSignals && (
          <div
            style={{
              marginTop: '2rem',
              background: '#0d1117',
              border: '1px solid #222',
              borderRadius: 8,
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: AMBER }}>
              No signals yet — first run scheduled for 7 AM
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: DIM, marginTop: '0.5rem' }}>
              The signal analyzer runs twice daily on the Mac Mini.
              <br />
              Results auto-deploy to this page via GitHub.
            </p>
          </div>
        )}

        {/* Evening run first (most recent), then morning */}
        {booted && evening && (
          <RunSection run={evening} label="EVENING SIGNAL (5:30 PM)" prevRun={morning} />
        )}

        {booted && morning && (
          <RunSection run={morning} label="MORNING SIGNAL (7 AM)" />
        )}

        {/* Comparison summary — only when both runs exist */}
        {booted && morning && evening && (
          <div
            style={{
              marginTop: '2rem',
              background: '#0d1117',
              border: `1px solid ${PURPLE}33`,
              borderRadius: 8,
              padding: '1.25rem',
            }}
          >
            <h3 style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: PURPLE, margin: '0 0 0.75rem 0' }}>
              {'>'} DAY COMPARISON
            </h3>
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
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: 2,
                  }}
                >
                  <span style={{ color: '#ccc' }}>{eSig.asset}</span>
                  <span style={{ color: priceDelta >= 0 ? GREEN : RED }}>
                    {priceDelta >= 0 ? '+' : ''}{formatUsd(priceDelta)} ({pricePct >= 0 ? '+' : ''}{pricePct.toFixed(2)}%)
                  </span>
                  <span style={{ color: actionChanged ? PURPLE : DIM }}>
                    {actionChanged
                      ? `${ACTION_LABELS[mSig.action]} → ${ACTION_LABELS[eSig.action]}`
                      : ACTION_LABELS[eSig.action]}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* How it works */}
        {booted && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#999', marginBottom: '1rem' }}>
              {'>'} HOW IT WORKS
            </h2>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 2,
                color: '#aaa',
                background: '#0d1117',
                border: '1px solid #222',
                borderRadius: 8,
                padding: '1.5rem',
              }}
            >
              <div><span style={{ color: CYAN }}>1.</span> Signal analyzer runs at 7 AM + 5:30 PM on the Mac Mini</div>
              <div><span style={{ color: CYAN }}>2.</span> Fetches: CoinGecko prices, Fear & Greed Index, Reddit sentiment</div>
              <div><span style={{ color: CYAN }}>3.</span> Rule-based analysis generates signals with confidence scores</div>
              <div><span style={{ color: CYAN }}>4.</span> Results commit to GitHub → Vercel auto-deploys → this page updates</div>
              <div><span style={{ color: CYAN }}>5.</span> I check at 6 PM. I read the reasoning. I make the call.</div>
              <div style={{ marginTop: '0.5rem', color: DIM }}>
                No exchange API. No wallet connection. No automated execution. Read-only signals.
              </div>
            </div>
          </div>
        )}

        {/* Links + disclaimer */}
        {booted && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #222', textAlign: 'center' }}>
            <a
              href="https://github.com/shawnla90/crypto-os"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: CYAN,
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                border: `1px solid ${CYAN}44`,
                borderRadius: 6,
              }}
            >
              VIEW ON GITHUB →
            </a>
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: DIM, marginTop: '1.5rem' }}>
              Not financial advice. This is a learning project with a $100 budget.
              <br />
              Built with Recursive Drift methodology.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
