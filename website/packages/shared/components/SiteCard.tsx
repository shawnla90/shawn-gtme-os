import React from 'react'
import type { SiteStats } from '../lib/vitals'
import { totalLOC, formatNumber, gradeColor, LANGUAGE_COLORS } from '../lib/vitals'

/* ── types ────────────────────────────────────────── */

export interface SiteCardProps {
  site: SiteStats
}

/* ── component ────────────────────────────────────── */

export function SiteCard({ site }: SiteCardProps) {
  const loc = totalLOC(site.loc)
  const gColor = gradeColor(site.grade)

  const locEntries = Object.entries(site.loc)
    .filter(([, v]) => v && v > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))

  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--canvas-subtle)',
        border: `1px solid ${site.accent}40`,
        borderLeft: `3px solid ${site.accent}`,
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Header: name + score + grade */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: site.accent,
              letterSpacing: '-0.01em',
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {formatNumber(site.score)} pts
          </div>
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: gColor,
            lineHeight: 1,
          }}
        >
          {site.grade}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: 16,
        }}
      >
        <StatCell label="Routes" value={site.routes} />
        <StatCell label="Components" value={site.components} />
        <StatCell label="Features" value={site.feature_count} />
      </div>

      {/* LOC mini bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {formatNumber(loc)} lines of code
        </div>
        <div
          style={{
            display: 'flex',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          {locEntries.map(([lang, val]) => {
            const pct = ((val ?? 0) / loc) * 100
            const meta = LANGUAGE_COLORS[lang]
            return (
              <div
                key={lang}
                title={`${meta?.label ?? lang}: ${formatNumber(val ?? 0)} lines (${pct.toFixed(1)}%)`}
                style={{
                  width: `${pct}%`,
                  background: meta?.color ?? '#64748B',
                  minWidth: pct > 0 ? '2px' : 0,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {site.features.map((f) => (
          <span
            key={f}
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              color: site.accent,
              background: `${site.accent}15`,
              border: `1px solid ${site.accent}30`,
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* API endpoints */}
      {site.api_endpoints > 0 && (
        <div
          style={{
            marginTop: 10,
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {site.api_endpoints} API endpoint{site.api_endpoints > 1 ? 's' : ''}:{' '}
          {site.api_endpoint_list.join(', ')}
        </div>
      )}
    </div>
  )
}

/* ── internal ─────────────────────────────────────── */

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '8px',
        background: 'rgba(0,0,0,0.15)',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '9px',
          color: 'var(--text-muted)',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
    </div>
  )
}
