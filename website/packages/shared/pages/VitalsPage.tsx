import React from 'react'
import type { WebsiteStats } from '../lib/vitals'
import { formatNumber, gradeColor } from '../lib/vitals'
import { NioAvatar } from '../components/NioAvatar'
import { SiteCard } from '../components/SiteCard'
import { FeatureShowcase } from '../components/FeatureShowcase'
import { CodeComposition } from '../components/CodeComposition'

/* ── types ────────────────────────────────────────── */

export interface VitalsPageProps {
  stats: WebsiteStats
}

/* ── styles ───────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 780,
  margin: '0 auto',
  padding: '40px 20px',
  fontFamily: 'var(--font-mono)',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

/* ── component ────────────────────────────────────── */

export function VitalsPage({ stats }: VitalsPageProps) {
  const gColor = gradeColor(stats.grade)

  return (
    <div style={page}>
      {/* ── Terminal header ── */}
      <h1
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}
      >
        <span style={promptChar}>$</span> ./vitals --scan-all
      </h1>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: 32,
          opacity: 0.6,
        }}
      >
        last scan: {new Date(stats.generated_at).toLocaleString()}
      </div>

      {/* ── What Is This? ── */}
      <section
        style={{
          marginBottom: 24,
          padding: '20px 24px',
          background: 'rgba(78, 195, 115, 0.04)',
          border: '1px solid rgba(78, 195, 115, 0.15)',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#4EC373',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          <span style={{ opacity: 0.5 }}>{'>'}</span> what is this?
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          This site is alive. Every page you visit, every feature that ships, and every
          line of code pushed grows the ecosystem score below. <span style={{ color: '#4EC373' }}>Nio</span> is
          the site guardian — a living avatar that evolves as the system grows.
          Keep visiting, and you&apos;ll watch Nio level up in real time.
        </p>
        <div
          style={{
            marginTop: 12,
            fontSize: '11px',
            color: 'var(--text-muted)',
            opacity: 0.6,
          }}
        >
          {'// tier progression is permanent. every deploy counts.'}
        </div>
      </section>

      {/* ── Nio Hero Section ── */}
      <section
        style={{
          textAlign: 'center',
          marginBottom: 16,
          padding: '24px',
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <NioAvatar
          tier={stats.nio_tier}
          tierName={stats.nio_tier_name}
          totalScore={stats.total_score}
          progress={stats.nio_progress}
          size="full"
        />
      </section>

      <hr style={divider} />

      {/* ── Total Ecosystem Score ── */}
      <section style={{ textAlign: 'center', marginBottom: 16 }}>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {formatNumber(stats.total_score)}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginTop: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          ecosystem value score
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: gColor,
            marginTop: 8,
            lineHeight: 1,
          }}
        >
          {stats.grade}
        </div>
      </section>

      <hr style={divider} />

      {/* ── Three Site Cards ── */}
      <section>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/sites --stats
          </span>
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <SiteCard site={stats.sites.shawnos} />
          <SiteCard site={stats.sites.gtmos} />
          <SiteCard site={stats.sites.contentos} />
        </div>
      </section>

      <hr style={divider} />

      {/* ── Shared Infrastructure ── */}
      <section>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            cat ~/infra --shared
          </span>
        </h2>

        <div
          style={{
            padding: '20px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: 16,
            }}
          >
            <InfraCell label="Monorepo" value={stats.infra.monorepo ? 'Turborepo' : 'No'} />
            <InfraCell label="Deployed Sites" value={String(stats.infra.vercel_sites)} />
            <InfraCell label="Shared Components" value={String(stats.shared.components)} />
            <InfraCell label="Design Tokens" value={stats.shared.design_tokens ? 'Active' : 'No'} />
            <InfraCell label="Languages" value={String(stats.infra.languages.length)} />
          </div>

          {/* Shared component list */}
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: 8,
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              shared components:{' '}
            </span>
            {stats.shared.component_list.join(', ')}
          </div>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Technical Feature Showcase ── */}
      <section>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            inventory --equipped
          </span>
        </h2>

        <FeatureShowcase features={stats.infra.technical_features} />
      </section>

      <hr style={divider} />

      {/* ── Code Composition ── */}
      <section>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            wc -l ~/sites/**/* --by-language
          </span>
        </h2>

        <CodeComposition
          loc={stats.infra.loc_by_language}
          totalLOC={stats.infra.total_loc}
        />
      </section>

      <hr style={divider} />

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          opacity: 0.6,
          paddingBottom: 24,
        }}
      >
        scanned at {new Date(stats.generated_at).toLocaleString()} · powered by website_scanner.py
      </footer>
    </div>
  )
}

/* ── internal ─────────────────────────────────────── */

function InfraCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '12px',
        background: 'rgba(0,0,0,0.15)',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          fontSize: '16px',
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
          marginTop: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
    </div>
  )
}
