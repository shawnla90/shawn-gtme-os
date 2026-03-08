'use client'

interface GraphGridProps {
  spacing?: number
  opacity?: number
  lineWidth?: number
  className?: string
  style?: React.CSSProperties
}

export function GraphGrid({
  spacing = 32,
  opacity = 0.25,
  lineWidth = 1,
  className,
  style,
}: GraphGridProps) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        backgroundImage: [
          `linear-gradient(0deg, var(--grid-color) ${lineWidth}px, transparent ${lineWidth}px)`,
          `linear-gradient(90deg, var(--grid-color) ${lineWidth}px, transparent ${lineWidth}px)`,
        ].join(', '),
        backgroundSize: `${spacing}px ${spacing}px`,
        ...style,
      }}
    />
  )
}
