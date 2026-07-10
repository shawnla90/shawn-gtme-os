import { useId, type ReactElement } from "react"

type BacklightProps = {
  children?: ReactElement
  className?: string
  blur?: number
}

/**
 * Backlight — an SVG-filter glow that renders a blurred, saturated copy of its
 * child behind the crisp original, so logos / cores / images bloom with color.
 * Pure SVG (feGaussianBlur → feColorMatrix saturate → feComposite over), no deps.
 */
export function Backlight({ blur = 20, children, className }: BacklightProps) {
  const id = useId()

  return (
    <div className={className}>
      <svg width="0" height="0" aria-hidden="true">
        <filter id={id} y="-50%" x="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blurred" />
          <feColorMatrix type="saturate" in="blurred" values="4" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </svg>
      <div style={{ filter: `url(#${id})` }}>{children}</div>
    </div>
  )
}
