'use client'

import { useEffect, useState, useCallback } from 'react'
import { TerminalChrome } from '@shawnos/shared/components'

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

interface AssetPrice {
  id: string
  symbol: string
  price: number
  change24h: number
}

interface FearGreed {
  value: number
  label: string
}

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const GREEN = '#4EC373'
const RED = '#FF6B6B'
const AMBER = '#FFB86C'
const CYAN = '#6BE5FF'
const DIM = '#666'

const TRACKED = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
]

const BOOT_LINES = [
  '> crypto-os boot --mode=signal-lab',
  '> loading config... 3 assets tracked',
  '> connecting CoinGecko... [OK]',
  '> connecting Fear & Greed Index... [OK]',
  '> signal engine: ONLINE',
  '> model: rule-based-v1',
  '> disclaimer: not financial advice. ever.',
]

const BOOT_DURATION = 3000

const JOURNAL_ENTRIES = [
  {
    date: '2026-03-15',
    title: 'Day 0 — Infrastructure',
    body: 'Built the signal analyzer. CoinGecko for prices, Fear & Greed for sentiment, Reddit for community pulse. Rule-based signals, conservative defaults. $100 budget, not deployed yet. System first, trades later.',
  },
]

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export function CryptoLab() {
  const [booted, setBooted] = useState(false)
  const [bootLine, setBootLine] = useState(0)
  const [prices, setPrices] = useState<AssetPrice[]>([])
  const [fearGreed, setFearGreed] = useState<FearGreed | null>(null)
  const [loading, setLoading] = useState(true)

  // Boot sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setBootLine((prev) => {
        if (prev >= BOOT_LINES.length - 1) {
          clearInterval(interval)
          setTimeout(() => setBooted(true), 600)
          return prev
        }
        return prev + 1
      })
    }, BOOT_DURATION / BOOT_LINES.length)
    return () => clearInterval(interval)
  }, [])

  // Fetch live data from CoinGecko (client-side, works on Vercel)
  const fetchData = useCallback(async () => {
    try {
      const ids = TRACKED.map((t) => t.id).join(',')
      const [priceRes, fgRes] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        ),
        fetch('https://api.alternative.me/fng/?limit=1'),
      ])

      if (priceRes.ok) {
        const data = await priceRes.json()
        const parsed: AssetPrice[] = TRACKED.map((t) => ({
          id: t.id,
          symbol: t.symbol,
          price: data[t.id]?.usd ?? 0,
          change24h: data[t.id]?.usd_24h_change ?? 0,
        }))
        setPrices(parsed)
      }

      if (fgRes.ok) {
        const data = await fgRes.json()
        const entry = data?.data?.[0]
        if (entry) {
          setFearGreed({
            value: parseInt(entry.value, 10),
            label: entry.value_classification,
          })
        }
      }
    } catch {
      // Fail silently — page still renders with static content
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (booted) fetchData()
  }, [booted, fetchData])

  const fgColor = fearGreed
    ? fearGreed.value <= 30
      ? RED
      : fearGreed.value >= 70
        ? GREEN
        : AMBER
    : DIM

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
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              color: '#999',
              marginTop: '0.5rem',
            }}
          >
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
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.4rem',
              color: CYAN,
              margin: 0,
              fontWeight: 600,
            }}
          >
            AI analyzes. I decide. I execute.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#666', marginTop: '0.75rem' }}>
            No automated trading. No black box. The signal analyzer runs twice a day,
            <br />
            generates conservative signals, and I make every call myself.
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
                {'>'} system ready. awaiting human operator.
              </div>
            )}
          </div>
        </TerminalChrome>

        {/* Live market data */}
        {booted && (
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#999', marginBottom: '1rem' }}>
              {'>'} LIVE MARKET DATA
            </h2>

            {loading ? (
              <p style={{ fontFamily: 'monospace', color: DIM }}>fetching from CoinGecko...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {prices.map((asset) => (
                  <div
                    key={asset.id}
                    style={{
                      background: '#0d1117',
                      border: '1px solid #222',
                      borderRadius: 8,
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
                        {asset.symbol}
                      </span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: asset.change24h >= 0 ? GREEN : RED,
                        }}
                      >
                        {asset.change24h >= 0 ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', color: '#fff', marginTop: '0.5rem' }}>
                      ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}

                {/* Fear & Greed */}
                {fearGreed && (
                  <div
                    style={{
                      background: '#0d1117',
                      border: `1px solid ${fgColor}44`,
                      borderRadius: 8,
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#999' }}>Fear & Greed</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '2rem', color: fgColor, marginTop: '0.25rem' }}>
                      {fearGreed.value}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: fgColor }}>
                      {fearGreed.label}
                    </div>
                  </div>
                )}
              </div>
            )}
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
              <div>
                <span style={{ color: CYAN }}>1.</span> Signal analyzer runs at 7AM + 7PM (Mac Mini cron)
              </div>
              <div>
                <span style={{ color: CYAN }}>2.</span> Fetches: CoinGecko prices, Fear & Greed Index, Reddit sentiment
              </div>
              <div>
                <span style={{ color: CYAN }}>3.</span> Rule-based analysis generates signals: hold / watch / consider_buy /
                consider_sell
              </div>
              <div>
                <span style={{ color: CYAN }}>4.</span> Signals logged as JSON with confidence scores and reasoning
              </div>
              <div>
                <span style={{ color: CYAN }}>5.</span> I read the signals. I check the reasoning. I make the call.
              </div>
              <div style={{ marginTop: '0.5rem', color: DIM }}>
                No exchange API. No wallet connection. No automated execution. The script is read-only.
              </div>
            </div>
          </div>
        )}

        {/* Journal */}
        {booted && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#999', marginBottom: '1rem' }}>
              {'>'} JOURNEY LOG
            </h2>
            {JOURNAL_ENTRIES.map((entry) => (
              <div
                key={entry.date}
                style={{
                  background: '#0d1117',
                  border: '1px solid #222',
                  borderRadius: 8,
                  padding: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {entry.title}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: DIM }}>{entry.date}</span>
                </div>
                <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#aaa', margin: 0, lineHeight: 1.6 }}>
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Links */}
        {booted && (
          <div
            style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid #222',
              textAlign: 'center',
            }}
          >
            <a
              href="https://github.com/shawntenam/crypto-os"
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
