import type { CSSProperties } from 'react'
import type { LearningDiscipline, LearningStatus } from '../lib'

interface LearningPageProps {
  disciplines: LearningDiscipline[]
  updated?: string
  title?: string
  subtitle?: string
  /** Locale-aware href back to the log index (defaults to /log). */
  logHref?: string
}

const container: CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  padding: '8px 20px 72px',
  fontFamily: 'var(--font-mono)',
}

const lead: CSSProperties = {
  fontSize: 15,
  color: 'var(--text-muted)',
  margin: '0 0 12px',
}

const intro: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  margin: '0 0 28px',
  maxWidth: 620,
}

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 16,
}

const card: CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '22px 22px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const cardTitle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: 0,
  fontFamily: 'var(--font-sans)',
  letterSpacing: '-0.01em',
}

const cardMeta: CSSProperties = {
  fontSize: 11.5,
  color: 'var(--text-muted)',
  letterSpacing: '0.02em',
}

const cardWhy: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)',
  margin: 0,
}

const sectionLabel: CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '4px 0 0',
}

const toolChip: CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  padding: '3px 9px',
  borderRadius: 9999,
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
}

const emptyNote: CSSProperties = {
  fontSize: 12.5,
  color: 'var(--text-muted)',
  fontStyle: 'italic',
  margin: 0,
}

// Monochrome status ladder: Exploring (dim outline) -> Practicing (bright
// outline) -> Shipping (filled). No color — reads as a progression by weight.
function statusStyle(status: LearningStatus): CSSProperties {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: 9999,
    whiteSpace: 'nowrap',
  }
  if (status === 'Shipping') {
    return { ...base, background: 'var(--text-primary)', color: 'var(--canvas)', border: '1px solid var(--text-primary)' }
  }
  if (status === 'Practicing') {
    return { ...base, background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--text-secondary)' }
  }
  return { ...base, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' }
}

function statusDot(status: LearningStatus): string {
  if (status === 'Shipping') return 'var(--canvas)'
  if (status === 'Practicing') return 'var(--text-primary)'
  return 'var(--text-muted)'
}

export function LearningPage({ disciplines, updated, logHref = '/log', title, subtitle }: LearningPageProps) {
  return (
    <div style={container}>
      <style>{`
        .lp-blink { display:inline-block; width:8px; height:15px; margin-left:4px;
          background: var(--text-primary); vertical-align:-2px; animation: lp-blink 1.1s steps(1) infinite; }
        @keyframes lp-blink { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }
        .lp-card { transition: border-color 0.18s ease, transform 0.18s ease; }
        .lp-card:hover { border-color: var(--text-secondary); transform: translateY(-2px); }
        .lp-ladder { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin:0 0 30px; }
        .lp-arrow { color: var(--text-muted); font-size:12px; }
      `}</style>

      {(title || subtitle) && (
        <header style={{ padding: '20px 0 26px' }}>
          {title && (
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                margin: '0 0 12px',
                color: 'var(--text-primary)',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 17,
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: 560,
              }}
            >
              {subtitle}
            </p>
          )}
        </header>
      )}

      <p style={lead}>
        <span style={{ color: 'var(--text-primary)' }}>$</span> cat ~/skills/learning.log
        <span className="lp-blink" />
      </p>

      <p style={intro}>
        Disciplines I&rsquo;m learning in public — the off-keyboard craft behind the build.
        Each one climbs a ladder: <strong style={{ color: 'var(--text-primary)' }}>Exploring</strong> &rarr;{' '}
        <strong style={{ color: 'var(--text-primary)' }}>Practicing</strong> &rarr;{' '}
        <strong style={{ color: 'var(--text-primary)' }}>Shipping</strong>. Milestones and proof get logged as the
        work actually lands — nothing here is aspirational.
      </p>

      <div className="lp-ladder">
        <span style={statusStyle('Exploring')}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: statusDot('Exploring') }} /> Exploring
        </span>
        <span className="lp-arrow">&rarr;</span>
        <span style={statusStyle('Practicing')}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: statusDot('Practicing') }} /> Practicing
        </span>
        <span className="lp-arrow">&rarr;</span>
        <span style={statusStyle('Shipping')}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: statusDot('Shipping') }} /> Shipping
        </span>
      </div>

      {disciplines.length === 0 ? (
        <p style={emptyNote}>No disciplines logged yet.</p>
      ) : (
        <div style={grid}>
          {disciplines.map((d) => (
            <article key={d.slug} className="lp-card" style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <h2 style={cardTitle}>{d.discipline}</h2>
                <span style={statusStyle(d.status)}>
                  <span style={{ width: 6, height: 6, borderRadius: 9999, background: statusDot(d.status) }} />
                  {d.status}
                </span>
              </div>

              {(d.started || d.tools?.length > 0) && (
                <div style={cardMeta}>
                  {d.started && <>started {d.started}</>}
                  {d.started && d.tools?.length > 0 && <> &middot; </>}
                  {d.tools?.length > 0 && d.tools.join(' / ')}
                </div>
              )}

              <p style={cardWhy}>{d.why}</p>

              <div>
                <p style={sectionLabel}>Milestones</p>
                {d.milestones?.length > 0 ? (
                  <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {d.milestones.map((m, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                        <span style={{ color: 'var(--text-primary)' }}>+</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ ...emptyNote, marginTop: 6 }}>— nothing shipped here yet. it&rsquo;s fresh.</p>
                )}
              </div>

              {d.proof_links?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {d.proof_links.map((p, i) => (
                    <a
                      key={i}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...toolChip, color: 'var(--text-primary)', textDecoration: 'none' }}
                    >
                      {p.label} &nearr;
                    </a>
                  ))}
                </div>
              )}

              {d.tools?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
                  {d.tools.map((t) => (
                    <span key={t} style={toolChip}>{t}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <a href={logHref} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          &larr; back to the log
        </a>
        {updated && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 16 }}>updated {updated}</span>
        )}
      </div>
    </div>
  )
}
