import type { Metadata } from 'next'
import { TITLE_TABLE, getTierAvatarUrls, getAvatarUrlsForProfile } from '@shawnos/shared/lib'
import type { RPGProfile, RPGClass } from '@shawnos/shared/lib'
import { AvatarBadge } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'RPG Preview | ShawnOS.ai',
  description: 'Visual preview of all RPG title tiers, classes, and progression data.',
}

/* ── helpers ──────────────────────────────────────── */

const ALL_CLASSES: RPGClass[] = ['Builder', 'Scribe', 'Strategist', 'Alchemist', 'Polymath']

/** Build a mock RPGProfile for a given tier index. */
function mockProfileForTier(tierIdx: number): RPGProfile {
  const tier = TITLE_TABLE[tierIdx]!
  const nextTier = TITLE_TABLE[tierIdx + 1] ?? null
  return {
    name: 'Operator',
    title: tier.title,
    level: tier.level,
    xp_total: tier.xp_required,
    xp_next_level: nextTier ? nextTier.xp_required : 999999,
    class: ALL_CLASSES[tierIdx % ALL_CLASSES.length]!,
    avatar_tier: tier.avatar_tier,
    milestones: [],
    updated_at: new Date().toISOString(),
  }
}

/** Build a mock RPGProfile for a given class at level 20. */
function mockProfileForClass(rpgClass: RPGClass): RPGProfile {
  const tier = TITLE_TABLE.find((t) => t.level === 20) ?? TITLE_TABLE[4]!
  return {
    name: 'Operator',
    title: tier.title,
    level: tier.level,
    xp_total: tier.xp_required,
    xp_next_level: 18000,
    class: rpgClass,
    avatar_tier: tier.avatar_tier,
    milestones: [],
    updated_at: new Date().toISOString(),
  }
}

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

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 20,
}

const cardWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

const tierLabel: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  textAlign: 'center',
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
  return (
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
        RPG Title Progression Preview
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.6 }}>
        All 11 title tiers rendered with the <code style={{ color: 'var(--accent)' }}>AvatarBadge</code> component.
        Edit{' '}
        <code style={{ color: 'var(--accent)' }}>rpg.ts</code> or{' '}
        <code style={{ color: 'var(--accent)' }}>AvatarBadge.tsx</code> and hot reload will update this page.
      </p>

      <hr style={divider} />

      {/* ── Section 1: Full Title Progression ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/progression --all-tiers
          </span>
        </h2>

        <div style={grid}>
          {TITLE_TABLE.map((tier, idx) => {
            const profile = mockProfileForTier(idx)
            const nextTier = TITLE_TABLE[idx + 1] ?? null
            const urls = getAvatarUrlsForProfile(profile)
            const variant =
              idx % 2 === 1 || tier.avatar_tier === 6 ? 'advanced' : 'early'
            return (
              <div key={tier.level} style={cardWrapper}>
                <AvatarBadge
                  size="compact"
                  profile={profile}
                  avatarSrc={urls.static}
                  avatarIdleSrc={urls.idle}
                  avatarActionSrc={urls.action}
                />
                <div style={tierLabel}>
                  Tier {tier.avatar_tier} · {variant} · {formatXP(tier.xp_required)} XP
                </div>
                {nextTier && (
                  <div style={{ ...tierLabel, opacity: 0.5 }}>
                    next → LVL {nextTier.level}
                  </div>
                )}
                {!nextTier && (
                  <div style={{ ...tierLabel, color: 'var(--accent)' }}>
                    ★ MAX RANK
                  </div>
                )}
              </div>
            )
          })}
        </div>
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

        <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {ALL_CLASSES.map((rpgClass) => {
            const profile = mockProfileForClass(rpgClass)
            const urls = getTierAvatarUrls(profile.avatar_tier, 'advanced')
            return (
              <div key={rpgClass} style={cardWrapper}>
                <AvatarBadge
                  size="compact"
                  profile={profile}
                  avatarSrc={urls.static}
                  avatarIdleSrc={urls.idle}
                  avatarActionSrc={urls.action}
                />
                <div style={{ ...tierLabel, color: 'var(--accent)' }}>
                  {rpgClass}
                </div>
              </div>
            )
          })}
        </div>
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
        &gt; {TITLE_TABLE.length} tiers · {ALL_CLASSES.length} classes · preview only — not linked in navigation_
      </div>
    </div>
  )
}
