'use client'

import React, { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { CircleNavItem, circleNavStyles } from './CircleNavItem'

export interface RailDockItem {
  href: string
  label: string
  description?: string
  logoSrc?: string
  icon?: ReactNode
}

interface RightRailDockProps {
  items: RailDockItem[]
  size?: number
}

export function RightRailDock({ items, size = 52 }: RightRailDockProps) {
  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === '/' || href === '#') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      <style>{`
        ${circleNavStyles}
        .right-rail-dock {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 950;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 12px 8px;
          background: color-mix(in srgb, var(--canvas-subtle) 78%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--canvas-border);
          border-radius: 9999px;
        }
        @media (max-width: 768px) {
          .right-rail-dock {
            top: auto;
            right: 50%;
            bottom: 16px;
            transform: translateX(50%);
            flex-direction: row;
          }
        }
      `}</style>
      <nav aria-label="Primary destinations" className="right-rail-dock">
        {items.map((item) => (
          <CircleNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            description={item.description}
            logoSrc={item.logoSrc}
            icon={item.icon}
            size={size}
            tooltipPosition="left"
            active={isActive(item.href)}
          />
        ))}
      </nav>
    </>
  )
}
