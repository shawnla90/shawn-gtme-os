/**
 * Local footer credit line — renders directly beneath the shared Footer.
 * Adds the tech-stack attribution without modifying shared components.
 */
export function FooterCredit() {
  return (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        padding: '0 24px 20px',
        letterSpacing: '0.03em',
      }}
    >
      built with{' '}
      <span style={{ color: 'var(--accent)', opacity: 0.7 }}>Next.js</span>
      {' · '}
      <span style={{ color: 'var(--accent)', opacity: 0.7 }}>Tailwind</span>
      {' · '}
      <span style={{ color: 'var(--accent)', opacity: 0.7 }}>Claude</span>
      {' · '}
      <span style={{ color: 'var(--accent)', opacity: 0.7 }}>Remotion</span>
    </div>
  )
}
