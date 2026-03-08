'use client'

interface DotGridProps {
  dotSize?: number
  spacing?: number
  opacity?: number
  className?: string
  style?: React.CSSProperties
}

export function DotGrid({
  dotSize = 1,
  spacing = 24,
  opacity = 0.4,
  className,
  style,
}: DotGridProps) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        backgroundImage: `radial-gradient(circle, var(--grid-color) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        ...style,
      }}
    />
  )
}
