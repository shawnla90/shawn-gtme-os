// NioBot V2 — Shared markdown renderer with dark theme code blocks

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useCallback } from 'react'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="text-[10px] px-2 py-0.5 rounded bg-[var(--canvas)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

const components: Components = {
  // Code blocks with syntax highlighting and copy button
  pre({ children }) {
    return (
      <div className="nio-code-block">
        {children}
      </div>
    )
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const isBlock = match || (typeof children === 'string' && children.includes('\n'))
    const codeString = String(children).replace(/\n$/, '')

    if (isBlock) {
      return (
        <div className="relative group">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] text-[10px] text-[var(--text-muted)]">
            <span>{match?.[1] || 'text'}</span>
            <CopyButton text={codeString} />
          </div>
          <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      )
    }

    // Inline code
    return (
      <code className="nio-inline-code" {...props}>
        {children}
      </code>
    )
  },
  // Links open in new tab
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] hover:underline"
        {...props}
      >
        {children}
      </a>
    )
  },
  // Tables
  table({ children }) {
    return (
      <div className="overflow-x-auto my-2">
        <table className="nio-table">{children}</table>
      </div>
    )
  },
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="nio-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
