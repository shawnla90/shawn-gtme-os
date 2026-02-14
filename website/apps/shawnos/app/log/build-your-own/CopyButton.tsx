'use client'

import { useState } from 'react'

const copyBtn: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'opacity 0.15s ease',
  zIndex: 2,
}

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        ...copyBtn,
        opacity: copied ? 0.8 : 1,
      }}
    >
      {copied ? 'Copied!' : 'Copy Prompt'}
    </button>
  )
}
