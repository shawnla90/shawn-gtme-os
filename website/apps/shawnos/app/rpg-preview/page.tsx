import type { Metadata } from 'next'
import { TITLE_TABLE, getRPGProfile, resolveDataRoot } from '@shawnos/shared/lib'
import { TierProgressionGrid } from './TierProgressionGrid'
import { ClassShowcaseGrid } from './ClassShowcaseGrid'
import { ALL_CLASSES } from './constants'
import { RPGPageShell } from './RPGPageShell'

const DATA_ROOT = resolveDataRoot()

export const metadata: Metadata = {
  title: 'The Progression Engine | ShawnOS.ai',
  description: '11 tiers. 5 classes. Every title earned through daily output, tracked in the build log.',
}

/* ── helpers ──────────────────────────────────────── */

function formatXP(xp: number): string {
  return xp.toLocaleString()
}

/* ── styles ──────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '48px 20px',
  fontFamily: 'var(--font-mono)',
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const sectionHeading: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 24,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const tableWrapper: React.CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--canvas-subtle)',
}

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--accent)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '11px',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '8px 14px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
}

const tdAccent: React.CSSProperties = {
  ...td,
  color: 'var(--accent)',
  fontWeight: 600,
}

/* ── page ────────────────────────────────────────── */

export default function RPGPreviewPage() {
  const profile = getRPGProfile(DATA_ROOT)
  const currentAvatarTier = profile?.avatar_tier ?? 0

  return (
    <RPGPageShell>
    <div style={page}>
      {/* ── Header ── */}
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 8 }}>
        <span style={promptChar}>$</span> ./rpg-preview --render-all
      </p>
      <h1
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--accent)',
          marginBottom: 8,
          fontFamily: 'var(--font-mono)',
        }}
      >
        The Progression Engine
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.6 }}>
        11 tiers. 5 classes. every title earned through daily output, tracked in the{' '}
        <a href="/log" style={{ color: 'var(--accent)', textDecoration: 'none' }}>build log</a>.
      </p>

      <hr style={divider} />

      {/* ── Section 1: Full Title Progression (client component with click-to-reveal) ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/progression --all-tiers
          </span>
        </h2>

        <TierProgressionGrid currentAvatarTier={currentAvatarTier} />
      </section>

      <hr style={divider} />

      {/* ── Section 2: Class Showcase ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/classes --showcase
          </span>
        </h2>

        <ClassShowcaseGrid currentClass={profile?.class ?? 'Polymath'} />
      </section>

      <hr style={divider} />

      {/* ── Section 3: Raw Data Table ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            cat ~/progression/title_table.json
          </span>
        </h2>

        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Level</th>
                <th style={th}>Title</th>
                <th style={th}>XP Required</th>
                <th style={th}>Avatar Tier</th>
                <th style={th}>XP to Next</th>
              </tr>
            </thead>
            <tbody>
              {TITLE_TABLE.map((tier, idx) => {
                const nextTier = TITLE_TABLE[idx + 1] ?? null
                const xpToNext = nextTier
                  ? formatXP(nextTier.xp_required - tier.xp_required)
                  : '—'
                return (
                  <tr key={tier.level}>
                    <td style={tdAccent}>LVL {tier.level}</td>
                    <td style={td}>{tier.title}</td>
                    <td style={td}>{formatXP(tier.xp_required)}</td>
                    <td style={td}>Tier {tier.avatar_tier}</td>
                    <td style={td}>{xpToNext}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Footer ── */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          opacity: 0.6,
        }}
      >
        &gt; {TITLE_TABLE.length} tiers · {ALL_CLASSES.length} classes ·{' '}
        <a href="/log" style={{ color: 'var(--accent)', textDecoration: 'none' }}>see how this score is earned</a>_
      </div>
    </div>
    </RPGPageShell>
  )
}
