"use client"

import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  href?: string
  className?: string
  onClick?: React.MouseEventHandler
  children: React.ReactNode
}

/**
 * InteractiveHoverButton — the label slides out and an arrow'd copy slides in as
 * a primary-colored dot expands to flood the button. Renders an <a> when `href`
 * is set (so it can be a real link), otherwise a <button>.
 */
export function InteractiveHoverButton({ href, className, onClick, children }: Props) {
  const cls = cn(
    "group relative inline-block w-auto cursor-pointer overflow-hidden rounded-full border border-white/15 bg-background p-2 px-6 text-center font-semibold text-foreground",
    className,
  )
  const inner = (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
