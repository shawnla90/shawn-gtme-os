// NioBot V2 — Authentication gate component

'use client'

import { useState } from 'react'
import { useChatContext } from './ChatProvider'

export default function AuthGate() {
  const { state, dispatch } = useChatContext()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!state.authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--canvas)]">
        <p className="text-[var(--text-secondary)] text-sm">connecting...</p>
      </div>
    )
  }

  async function handleLogin() {
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.ok) {
        localStorage.setItem('shawnos-chat-token', data.token || password)
        dispatch({ type: 'AUTHED', token: data.token || password })
      } else {
        setError(data.error || 'wrong password')
      }
    } catch {
      setError('connection failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[var(--canvas)]">
      <div className="w-72 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">NioBot</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">enter password</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="password"
          autoFocus
          className="w-full px-3 py-2 rounded-lg bg-[var(--canvas-overlay)] border border-[var(--border)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
        />
        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-[var(--accent)] text-[var(--canvas)] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          connect
        </button>
      </div>
    </div>
  )
}
