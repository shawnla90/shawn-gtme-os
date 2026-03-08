'use client'

interface DashedCardProps {
  children: React.ReactNode
  warm?: boolean
  className?: string
  style?: React.CSSProperties
}

export function DashedCard({ children, warm, className, style }: DashedCardProps) {
  return (
    <div
      className={`dashed-card ${className ?? ''}`}
      style={{
        border: '1px dashed var(--border-dashed)',
        borderRadius: 12,
        padding: 24,
        backgroundColor: warm ? 'var(--canvas-warm-subtle)' : 'var(--canvas)',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      {children}
      <style>{`
        .dashed-card:hover {
          border-color: var(--accent) !important;
        }
      `}</style>
    </div>
  )
}
