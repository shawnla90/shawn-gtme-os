import React from 'react'
import type { SiteLOC } from '../lib/vitals'
import { formatNumber, LANGUAGE_COLORS } from '../lib/vitals'

/* ── types ────────────────────────────────────────── */

export interface CodeCompositionProps {
  loc: SiteLOC
  totalLOC: number
}

/* ── component ────────────────────────────────────── */

export function CodeComposition({ loc, totalLOC: total }: CodeCompositionProps) {
  const entries = Object.entries(loc)
    .filter(([, v]) => v && v > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      {/* Total */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {formatNumber(total)} total lines across all sites
      </div>

      {/* Stacked horizontal bar */}
      <div
        style={{
          display: 'flex',
          height: '14px',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
          marginBottom: 12,
        }}
      >
        {entries.map(([lang, val]) => {
          const pct = ((val ?? 0) / total) * 100
          const meta = LANGUAGE_COLORS[lang]
          return (
            <div
              key={lang}
              title={`${meta?.label ?? lang}: ${formatNumber(val ?? 0)} lines (${pct.toFixed(1)}%)`}
              style={{
                width: `${pct}%`,
                background: meta?.color ?? '#64748B',
                minWidth: pct > 0 ? '3px' : 0,
                transition: 'width 0.6s ease',
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {entries.map(([lang, val]) => {
          const pct = ((val ?? 0) / total) * 100
          const meta = LANGUAGE_COLORS[lang]
          return (
            <div
              key={lang}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: meta?.color ?? '#64748B',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                {meta?.label ?? lang}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {formatNumber(val ?? 0)} ({pct.toFixed(1)}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
