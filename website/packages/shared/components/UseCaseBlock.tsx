/* ── UseCaseBlock ────────────────────────────────────────────────────────
 * Terminal-styled card showing a real GTM use case: title, problem,
 * solution, result, tools used. Matches the GTMOS monospace aesthetic.
 * ────────────────────────────────────────────────────────────────────── */

import Link from 'next/link'

export interface UseCase {
  title: string
  problem: string
  solution: string
  result: string
  tools: string[]
  playbookLink?: string
}

const wrapper: React.CSSProperties = {
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '20px',
  marginTop: '16px',
}

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
}

const badge: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
  borderRadius: 3,
  padding: '2px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const title: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-primary)',
}

const row: React.CSSProperties = {
  marginBottom: '12px',
}

const label: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '4px',
}

const body: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  margin: 0,
}

const toolStrip: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid var(--border)',
}

const toolTag: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
  borderRadius: 3,
  padding: '2px 8px',
  letterSpacing: '0.04em',
}

const playbookLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  textDecoration: 'none',
  marginTop: '12px',
  transition: 'opacity 0.15s ease',
}

export function UseCaseBlock({ useCase }: { useCase: UseCase }) {
  return (
    <div style={wrapper}>
      <div style={header}>
        <span style={badge}>use case</span>
        <span style={title}>{useCase.title}</span>
      </div>

      <div style={row}>
        <div style={label}>Problem</div>
        <p style={body}>{useCase.problem}</p>
      </div>

      <div style={row}>
        <div style={label}>Solution</div>
        <p style={body}>{useCase.solution}</p>
      </div>

      <div style={{ ...row, marginBottom: 0 }}>
        <div style={label}>Result</div>
        <p style={body}>{useCase.result}</p>
      </div>

      <div style={toolStrip}>
        {useCase.tools.map((tool) => (
          <span key={tool} style={toolTag}>{tool}</span>
        ))}
      </div>

      {useCase.playbookLink && (
        <Link href={useCase.playbookLink} style={playbookLink}>
          See the full playbook &rarr;
        </Link>
      )}
    </div>
  )
}
