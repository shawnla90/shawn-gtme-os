import { spawn, ChildProcess } from 'child_process'
import path from 'path'

interface ClaudeCallbacks {
  onText: (text: string) => void
  onSessionId: (id: string) => void
  onDone: () => void
  onError: (error: string) => void
}

export function spawnClaude(
  message: string,
  sessionId: string | undefined,
  callbacks: ClaudeCallbacks
): ChildProcess {
  const soulPath = path.resolve(
    process.cwd(),
    'nio-soul.md'
  )

  const args = [
    '-p', message,
    '--output-format', 'stream-json',
    '--verbose',
    '--append-system-prompt-file', soulPath,
    '--max-turns', '10',
    '--permission-mode', 'bypassPermissions',
  ]

  if (sessionId) {
    args.push('--resume', sessionId)
  }

  // Remove CLAUDECODE env var to avoid nested session error
  const env = { ...process.env }
  delete env.CLAUDECODE

  console.log('[claude] cwd:', process.cwd())
  console.log('[claude] soul path:', soulPath)
  console.log('[claude] args:', args.join(' '))
  console.log('[claude] CLAUDECODE in env:', 'CLAUDECODE' in env)

  const child = spawn('/opt/homebrew/bin/claude', args, {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let buffer = ''
  let stderrBuffer = ''
  let capturedSessionId = false
  let sentText = false

  child.stdout?.on('data', (chunk: Buffer) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const event = JSON.parse(line)

        // Capture session_id from init event
        if (event.type === 'system' && event.session_id && !capturedSessionId) {
          callbacks.onSessionId(event.session_id)
          capturedSessionId = true
        }

        // assistant event: message.content[].text has the full response
        if (event.type === 'assistant' && event.message) {
          const msg = event.message
          if (msg.content && Array.isArray(msg.content)) {
            for (const block of msg.content) {
              if (block.type === 'text' && typeof block.text === 'string') {
                callbacks.onText(block.text)
                sentText = true
              }
            }
          }
          if (event.session_id && !capturedSessionId) {
            callbacks.onSessionId(event.session_id)
            capturedSessionId = true
          }
        }

        // result event: has result string (fallback if assistant didn't fire)
        if (event.type === 'result') {
          if (!sentText && typeof event.result === 'string' && event.result.length > 0) {
            callbacks.onText(event.result)
          }
          if (event.session_id && !capturedSessionId) {
            callbacks.onSessionId(event.session_id)
            capturedSessionId = true
          }
        }
      } catch {
        console.log('[claude] non-JSON stdout line:', line.substring(0, 200))
      }
    }
  })

  child.stderr?.on('data', (chunk: Buffer) => {
    const text = chunk.toString()
    stderrBuffer += text
    console.error('[claude stderr]', text.trim())
  })

  child.on('close', (code) => {
    console.log('[claude] process closed with code:', code)
    if (stderrBuffer.trim()) {
      console.error('[claude] full stderr:', stderrBuffer.trim())
    }

    // Process remaining buffer
    if (buffer.trim()) {
      try {
        const event = JSON.parse(buffer)
        if (event.type === 'result' && !sentText && typeof event.result === 'string' && event.result.length > 0) {
          callbacks.onText(event.result)
        }
        if (event.session_id && !capturedSessionId) {
          callbacks.onSessionId(event.session_id)
        }
      } catch {
        console.log('[claude] unparseable remaining buffer:', buffer.substring(0, 200))
      }
    }

    if (code !== 0 && code !== null) {
      const errMsg = stderrBuffer.trim() || `claude process exited with code ${code}`
      callbacks.onError(errMsg)
    }
    callbacks.onDone()
  })

  child.on('error', (err) => {
    console.error('[claude] spawn error:', err.message)
    callbacks.onError(err.message)
  })

  return child
}
