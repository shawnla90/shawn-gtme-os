import type { Metadata } from 'next'
import { TITLE_TABLE, getRPGProfile, resolveDataRoot } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { TierProgressionGrid } from './TierProgressionGrid'
import { ClassShowcaseGrid } from './ClassShowcaseGrid'
import { ALL_CLASSES } from './constants'
import { RPGPageShell } from './RPGPageShell'
import { PageHero, ScrollRevealSection } from './RPGReveal'

const DATA_ROOT = resolveDataRoot()

export const metadata: Metadata = {
  title: 'The Progression Engine | ShawnOS.ai',
  description: '11 tiers. 5 classes. Every title earned through daily output, tracked in the build log.',
  keywords: [
    'productivity gamification',
    'build in public gamification',
    'RPG progression system',
    'developer XP system',
    'output-based leveling',
    'daily build tracker',
    'pixel art avatar system',
    'gamified developer portfolio',
    'tier progression engine',
    'creative coding RPG',
  ],
  alternates: { canonical: 'https://shawnos.ai/rpg-preview' },
  openGraph: {
    title: 'The Progression Engine | ShawnOS.ai',
    description: '11 tiers. 5 classes. Every title earned through daily output, tracked in the build log.',
    url: 'https://shawnos.ai/rpg-preview',
    images: [{ url: '/og?title=Progression+Engine&subtitle=11+tiers.+5+classes.+Every+title+earned.', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'The Progression Engine | ShawnOS.ai',
    description: '11 tiers. 5 classes. Every title earned through daily output.',
    images: ['/og?title=Progression+Engine&subtitle=11+tiers.+5+classes.+Every+title+earned.'],
  },
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
    <>
    <BreadcrumbSchema items={[{ name: 'RPG', url: 'https://shawnos.ai/rpg-preview' }]} />
    <RPGPageShell>
      <PageHero
        compact
        title="Progression Engine"
        subtitle="XP from real work. 11 tiers. 5 classes."
      />

      {/* ── Section 1: Full Title Progression ── */}
      <ScrollRevealSection background="var(--canvas)">
        <h2 style={sectionHeading}>Tier Progression</h2>
        <TierProgressionGrid currentAvatarTier={currentAvatarTier} />
      </ScrollRevealSection>

      {/* ── Section 2: Class Showcase ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <h2 style={sectionHeading}>Classes</h2>
        <ClassShowcaseGrid currentClass={profile?.class ?? 'Polymath'} />
      </ScrollRevealSection>

      {/* ── Section 3: Raw Data Table ── */}
      <ScrollRevealSection background="var(--canvas)">
        <h2 style={sectionHeading}>Title Table</h2>
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
      </ScrollRevealSection>

      {/* ── Footer ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            opacity: 0.6,
          }}
        >
          &gt; {TITLE_TABLE.length} tiers · {ALL_CLASSES.length} classes ·{' '}
          <a href="/log" style={{ color: 'var(--accent)', textDecoration: 'none' }}>see how this score is earned</a>_
        </div>
      </ScrollRevealSection>
    </RPGPageShell>
    </>
  )
}
