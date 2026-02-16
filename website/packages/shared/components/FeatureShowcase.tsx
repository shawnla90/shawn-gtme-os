import React from 'react'
import type { TechnicalFeature } from '../lib/vitals'
import { formatNumber } from '../lib/vitals'

/* ── types ────────────────────────────────────────── */

export interface FeatureShowcaseProps {
  features: TechnicalFeature[]
}

/* ── icon map (RPG inventory style) ───────────────── */

const FEATURE_ICONS: Record<string, string> = {
  'RPG Progression Engine': '⚔️',
  'Pixel Art Avatar System': '🎨',
  'Avatar Animations': '✨',
  'Sound Effects System': '🔊',
  'RPG Loading Screen': '⏳',
  'Typewriter Effects': '⌨️',
  'Pillow Image Generation': '🖼️',
  'Design Token System': '🎯',
  'RSS Feed': '📡',
  'OG Image Generation': '🃏',
  'Terminal Chrome UI': '💻',
  'Knowledge Base': '📚',
  'Quest Board System': '🗺️',
  'Daily Build Log': '📋',
  'Network Banner': '🌐',
  'Turborepo Monorepo': '🏗️',
  'Vercel Deployment': '🚀',
  'Shared Package Architecture': '📦',
}

/* ── component ────────────────────────────────────── */

export function FeatureShowcase({ features }: FeatureShowcaseProps) {
  const totalPts = features.reduce((s, f) => s + f.points, 0)

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {features.length} features equipped
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          {formatNumber(totalPts)} pts total
        </div>
      </div>

      {/* Feature list (inventory style) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {features.map((f) => (
          <div
            key={f.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              transition: 'border-color 0.15s ease',
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>
              {FEATURE_ICONS[f.name] ?? '⚙️'}
            </span>

            {/* Name + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}
              >
                {f.name}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.3,
                  marginTop: 1,
                }}
              >
                {f.description}
              </div>
            </div>

            {/* Points */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent)',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              +{f.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
