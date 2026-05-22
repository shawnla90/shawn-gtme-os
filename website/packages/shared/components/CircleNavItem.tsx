'use client'

import React, { type ReactNode } from 'react'

type TooltipPosition = 'bottom' | 'left' | 'top' | 'right'

interface CircleNavItemProps {
  href: string
  label: string
  description?: string
  size?: number
  active?: boolean
  /** Provide either an image src or a custom icon node. */
  logoSrc?: string
  icon?: ReactNode
  /** Which side the hover tooltip slides in from. @default 'bottom' */
  tooltipPosition?: TooltipPosition
}

export function CircleNavItem({
  href,
  label,
  description,
  size = 44,
  active = false,
  logoSrc,
  icon,
  tooltipPosition = 'bottom',
}: CircleNavItemProps) {
  return (
    <a
      href={href}
      aria-label={label}
      title={description ? `${label} — ${description}` : label}
      className="circle-nav-item"
      data-active={active ? 'true' : undefined}
      data-tooltip-pos={tooltipPosition}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" className="circle-nav-logo" />
      ) : (
        <span className="circle-nav-icon">{icon}</span>
      )}
      {description && (
        <span className="circle-nav-tooltip">
          <span className="circle-nav-tooltip-label">{label}</span>
          <span className="circle-nav-tooltip-desc">{description}</span>
        </span>
      )}
    </a>
  )
}

export const circleNavStyles = `
.circle-nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--canvas-subtle);
  border: 1px solid var(--canvas-border);
  color: var(--text-primary);
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  cursor: pointer;
}
.circle-nav-item:hover {
  background: var(--canvas-card);
  border-color: var(--text-secondary);
  transform: translateY(-1px);
}
.circle-nav-item[data-active="true"] {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--canvas);
}
.circle-nav-logo,
.circle-nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  object-fit: contain;
  color: var(--text-primary);
}
.circle-nav-icon > svg,
.circle-nav-logo > svg {
  width: 100%;
  height: 100%;
}
.circle-nav-item[data-active="true"] .circle-nav-logo,
.circle-nav-item[data-active="true"] .circle-nav-icon {
  color: var(--canvas);
}
.circle-nav-tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--canvas);
  border: 1px solid var(--canvas-border);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 160px;
  max-width: 240px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 1002;
  text-align: left;
  white-space: normal;
}
/* tooltip positions */
.circle-nav-item[data-tooltip-pos="bottom"] .circle-nav-tooltip {
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
}
.circle-nav-item[data-tooltip-pos="bottom"]:hover .circle-nav-tooltip,
.circle-nav-item[data-tooltip-pos="bottom"]:focus-visible .circle-nav-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.circle-nav-item[data-tooltip-pos="left"] .circle-nav-tooltip {
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
}
.circle-nav-item[data-tooltip-pos="left"]:hover .circle-nav-tooltip,
.circle-nav-item[data-tooltip-pos="left"]:focus-visible .circle-nav-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
.circle-nav-item[data-tooltip-pos="top"] .circle-nav-tooltip {
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
}
.circle-nav-item[data-tooltip-pos="top"]:hover .circle-nav-tooltip,
.circle-nav-item[data-tooltip-pos="top"]:focus-visible .circle-nav-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.circle-nav-tooltip-label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
.circle-nav-tooltip-desc {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}
.circle-nav-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0;
}
.circle-nav-cluster > .circle-nav-item {
  margin-left: -10px;
}
.circle-nav-cluster > .circle-nav-item:first-child {
  margin-left: 0;
}
.circle-nav-row {
  display: flex;
  gap: 14px;
  align-items: center;
}
@media (max-width: 768px) {
  .circle-nav-row { display: none !important; }
}
`
