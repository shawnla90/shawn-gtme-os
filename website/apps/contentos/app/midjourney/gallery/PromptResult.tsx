'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalChrome } from '@shawnos/shared/components'
import { MJ } from './gallery-data'
import { copyToClipboard, splitPromptParts } from './utils'

interface PromptResultProps {
  prompt: string
  accentColor: string
  onRemix: () => void
}

export function PromptResult({
  prompt,
  accentColor,
  onRemix,
}: PromptResultProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const ok = await copyToClipboard(prompt)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const workflowSteps = [
    {
      num: 1,
      text: 'Copy this prompt',
      done: copied,
      action: handleCopy,
    },
    {
      num: 2,
      text: 'Paste in MidJourney Discord',
      done: false,
      action: undefined,
    },
    {
      num: 3,
      text: 'Come back with your image',
      done: false,
      action: undefined,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        maxWidth: 680,
        margin: '0 auto',
      }}
    >
      {/* Prompt display */}
      <TerminalChrome title="your prompt">
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: copied
                ? 'rgba(78, 195, 115, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${copied ? MJ.promptGreen : MJ.border}`,
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 11,
              color: copied ? MJ.promptGreen : MJ.textMuted,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? 'copied!' : 'copy'}
          </button>
          <code
            style={{
              display: 'block',
              color: MJ.promptGreen,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              paddingRight: 60,
            }}
          >
            <span style={{ color: MJ.textMuted, userSelect: 'none' }}>
              /imagine{' '}
            </span>
            {splitPromptParts(prompt).map((part, i) =>
              part.isParam ? (
                <span key={i} style={{ color: MJ.mjBlue, fontWeight: 600 }}>
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </code>
        </div>
      </TerminalChrome>

      {/* Workflow steps */}
      <div
        style={{
          marginTop: 24,
          background: MJ.darkSubtle,
          border: `1px solid ${MJ.border}`,
          borderRadius: 12,
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: accentColor,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 16,
          }}
        >
          What to do next
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {workflowSteps.map((ws) => (
            <div
              key={ws.num}
              onClick={ws.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: ws.action ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: ws.done
                    ? MJ.promptGreen
                    : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${ws.done ? MJ.promptGreen : MJ.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: ws.done ? MJ.dark : MJ.textMuted,
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {ws.done ? '✓' : ws.num}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  color: ws.done ? MJ.promptGreen : MJ.text,
                  transition: 'color 0.2s',
                }}
              >
                {ws.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Remix button */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={onRemix}
          style={{
            padding: '10px 24px',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: MJ.textMuted,
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${MJ.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Remix - try different options
        </button>
      </div>
    </motion.div>
  )
}
