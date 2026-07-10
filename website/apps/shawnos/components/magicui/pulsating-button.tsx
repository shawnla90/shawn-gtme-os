"use client"

import { cn } from "@/lib/utils"

type Props = {
  href?: string
  className?: string
  onClick?: React.MouseEventHandler
  children: React.ReactNode
}

/**
 * PulsatingButton — a primary-filled button that emits a soft, expanding aura
 * ring (via the `.clearbox-pulse` keyframe in globals.css). Renders an <a> when
 * `href` is set, otherwise a <button>.
 */
export function PulsatingButton({ href, className, onClick, children }: Props) {
  const cls = cn(
    "clearbox-pulse relative inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground",
    className,
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
