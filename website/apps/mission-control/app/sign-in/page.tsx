'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const from = searchParams.get('from') ?? '/'
        router.push(from)
        router.refresh()
      } else {
        setError('ACCESS DENIED')
        setPassword('')
      }
    } catch {
      setError('CONNECTION FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      {/* Scanline effect is already global */}
      <div className="w-full max-w-sm">
        {/* Terminal header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center glow-green">
            <span className="text-sm font-bold text-green-400 tracking-tighter">MC</span>
          </div>
          <h1 className="text-green-400 text-lg font-bold tracking-[0.2em] uppercase">
            Mission Control
          </h1>
          <p className="text-gray-700 text-[10px] mt-1 tracking-wider uppercase">
            Authentication Required
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass rounded-lg p-4">
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-3 font-sans">
              Enter access code
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-700 text-sm">&gt;</span>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent border-none outline-none text-green-400 text-sm font-mono placeholder:text-gray-800 caret-green-400"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold tracking-wider uppercase hover:bg-green-500/15 hover:border-green-500/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
