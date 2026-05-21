'use client'

import React from 'react'

type Variant = 'primary' | 'secondary' | 'translucent'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '8px 18px', fontSize: '13px' },
  md: { padding: '12px 24px', fontSize: '14px' },
  lg: { padding: '14px 28px', fontSize: '15px' },
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--text-primary)',
    color: 'var(--canvas)',
    border: '1px solid var(--text-primary)',
  },
  secondary: {
    background: 'var(--canvas-subtle)',
    color: 'var(--text-primary)',
    border: '1px solid var(--canvas-border)',
  },
  translucent: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
  },
}

function buildStyle(variant: Variant, size: Size, fullWidth: boolean, extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '9999px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    lineHeight: 1,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease',
    width: fullWidth ? '100%' : undefined,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...extra,
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={className}
      style={buildStyle(variant, size, fullWidth, style)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  style,
  ...rest
}: AnchorProps) {
  return (
    <a
      className={className}
      style={buildStyle(variant, size, fullWidth, style)}
      {...rest}
    >
      {children}
    </a>
  )
}
