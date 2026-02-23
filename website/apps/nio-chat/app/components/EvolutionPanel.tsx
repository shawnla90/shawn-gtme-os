// NioBot V3 — Evolution stats slide-out drawer

'use client'

import Image from 'next/image'
import { useEvolutionContext } from './EvolutionProvider'
import NioXPRing from './NioXPRing'
import SkillBar from './SkillBar'
import {
  getLevelProgress,
  getSkillProgress,
  getStreakMultiplier,
  getAvatarForTier,
  SKILLS,
  TIERS,
} from '../../lib/evolution'

const SKILL_COLORS: Record<string, string> = {
  ops: '#4EC373',
  architecture: '#6B8AFF',
  writing: '#FF8A6B',
}

interface EvolutionPanelProps {
  open: boolean
  onClose: () => void
}

export default function EvolutionPanel({ open, onClose }: EvolutionPanelProps) {
  const { state } = useEvolutionContext()
  const progress = getLevelProgress(state.xp)
  const streakMultiplier = getStreakMultiplier(state.streak)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-[var(--canvas-overlay)] border-l border-[var(--border)] z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">evolution</h2>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Avatar + Tier */}
          <div className="flex flex-col items-center mb-6">
            <NioXPRing progress={progress.levelProgress} tier={progress.tier} size={80}>
              <Image
                src={getAvatarForTier(progress.tier)}
                alt={progress.tierName}
                width={72}
                height={72}
                className="rounded-full"
                unoptimized
              />
            </NioXPRing>
            <div className="mt-2 text-center">
              <p className="text-sm font-bold text-[var(--text-primary)]">{progress.tierName}</p>
              <p className="text-xs text-[var(--text-muted)]">
                tier {progress.tier} / level {progress.level}
              </p>
            </div>
          </div>

          {/* XP Stats */}
          <div className="bg-[var(--canvas)] rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-muted)]">total XP</span>
              <span className="text-sm font-bold text-[var(--accent)]">{state.xp.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-muted)]">next level</span>
              <span className="text-xs text-[var(--text-secondary)]">
                {Math.round(progress.xpForNextLevel - state.xp)} XP
              </span>
            </div>
            {/* XP bar */}
            <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${Math.round(progress.levelProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="bg-[var(--canvas)] rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">streak</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {state.streak} day{state.streak !== 1 ? 's' : ''}
              </span>
            </div>
            {streakMultiplier > 1 && (
              <p className="text-[10px] text-[var(--accent)] mt-1">
                {streakMultiplier}x XP multiplier active
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-[var(--canvas)] rounded-lg p-3 mb-4">
            <h3 className="text-xs text-[var(--text-muted)] mb-3">skills</h3>
            {SKILLS.map(skill => {
              const sp = getSkillProgress(skill.id, state.skillXP[skill.id] || 0)
              return (
                <SkillBar
                  key={skill.id}
                  name={skill.name}
                  level={sp.level}
                  progress={sp.progress}
                  color={SKILL_COLORS[skill.id] || '#4EC373'}
                />
              )
            })}
          </div>

          {/* Tier Roadmap */}
          <div className="bg-[var(--canvas)] rounded-lg p-3">
            <h3 className="text-xs text-[var(--text-muted)] mb-2">tiers</h3>
            {TIERS.map(tier => {
              const isActive = tier.tier === progress.tier
              const isUnlocked = state.xp >= tier.xpRequired
              return (
                <div
                  key={tier.tier}
                  className={`flex items-center justify-between py-1.5 ${
                    isActive ? 'text-[var(--accent)]' : isUnlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-4 text-center">{isUnlocked ? '\u2713' : tier.tier}</span>
                    <span className={`text-xs ${isActive ? 'font-bold' : ''}`}>{tier.name}</span>
                  </div>
                  <span className="text-[10px]">{tier.xpRequired.toLocaleString()} XP</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
