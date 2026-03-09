'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { RPGLoadingScreen } from './RPGLoadingScreen'

export function RPGPageShell({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  const handleComplete = useCallback(() => setLoaded(true), [])

  return (
    <>
      {!loaded && <RPGLoadingScreen onComplete={handleComplete} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </>
  )
}
