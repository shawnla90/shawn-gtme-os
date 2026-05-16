'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface PillTabItem {
  id: string
  label: string
  icon?: ReactNode
}

export interface PillTabsProps {
  items: PillTabItem[]
  value: string
  onChange: (id: string) => void
  size?: 'sm' | 'md'
  variant?: 'default' | 'subtle'
  className?: string
  ariaLabel?: string
}

const sizeMap: Record<NonNullable<PillTabsProps['size']>, { padY: string; padX: string; font: string; gap: string }> = {
  sm: { padY: '4px', padX: '10px', font: '11px', gap: '4px' },
  md: { padY: '6px', padX: '14px', font: '13px', gap: '6px' },
}

export function PillTabs({
  items,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  className,
  ariaLabel,
}: PillTabsProps) {
  const s = sizeMap[size]
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('pill-tabs', className)}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}
    >
      {items.map((item) => {
        const active = item.id === value
        const base: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: s.gap,
          padding: `${s.padY} ${s.padX}`,
          fontSize: s.font,
          fontWeight: 600,
          fontFamily: 'inherit',
          lineHeight: 1,
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }
        const activeStyle: CSSProperties =
          variant === 'subtle'
            ? {
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--accent)',
              }
            : {
                background: 'var(--text-primary)',
                color: 'var(--canvas)',
                border: '1px solid var(--text-primary)',
              }
        const inactiveStyle: CSSProperties = {
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.12)))',
        }
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor =
                  'var(--canvas-border, var(--border, rgba(255,255,255,0.12)))'
              }
            }}
            style={{ ...base, ...(active ? activeStyle : inactiveStyle) }}
          >
            {item.icon && <span aria-hidden style={{ display: 'inline-flex' }}>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
