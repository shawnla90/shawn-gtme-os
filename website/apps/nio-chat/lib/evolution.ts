// NioBot V3 — Evolution engine: XP math, tier/level calculation, streak logic, constants

// --- Tier Definitions ---

export interface TierDef {
  tier: number
  name: string
  xpRequired: number
}

export const TIERS: TierDef[] = [
  { tier: 1, name: 'Spark', xpRequired: 0 },
  { tier: 2, name: 'Blade', xpRequired: 500 },
  { tier: 3, name: 'Warden', xpRequired: 2000 },
  { tier: 4, name: 'Sentinel', xpRequired: 6000 },
  { tier: 5, name: 'Ascended', xpRequired: 15000 },
]

export const LEVELS_PER_TIER = 10
export const TOTAL_LEVELS = TIERS.length * LEVELS_PER_TIER

// --- XP Constants ---

export const XP_MESSAGE_SENT = 5
export const XP_RESPONSE_RECEIVED = 10
export const XP_DEEP_CONVERSATION = 25    // 5+ turns
export const XP_VERY_DEEP_CONVERSATION = 50  // 10+ turns
export const XP_AGENT_SWITCH = 10
export const XP_DAILY_FIRST_MESSAGE = 25

// --- Streak Multipliers ---

export function getStreakMultiplier(days: number): number {
  if (days >= 30) return 2.0
  if (days >= 14) return 1.75
  if (days >= 7) return 1.5
  if (days >= 3) return 1.25
  return 1.0
}

// --- Skill Definitions ---

export interface SkillDef {
  id: string
  name: string
  agentId: string
  description: string
}

export const SKILLS: SkillDef[] = [
  { id: 'ops', name: 'Ops', agentId: 'nio', description: 'System operations, deploys, monitoring' },
  { id: 'architecture', name: 'Architecture', agentId: 'architect', description: 'Design, planning, schemas' },
  { id: 'writing', name: 'Writing', agentId: 'writer', description: 'Content, blog posts, voice' },
]

export const MAX_SKILL_LEVEL = 10

export function getSkillXPForLevel(level: number): number {
  return 100 * level
}

export function getSkillForAgent(agentId: string): SkillDef | undefined {
  return SKILLS.find(s => s.agentId === agentId)
}

// --- Level/Tier Calculation ---

export interface LevelProgress {
  tier: number
  tierName: string
  level: number        // 1-10 within current tier
  totalLevel: number   // 1-50 overall
  xp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  levelProgress: number  // 0-1 progress within current level
  isMaxTier: boolean
  isMaxLevel: boolean
}

export function getLevelProgress(xp: number): LevelProgress {
  // Determine tier
  let currentTier = TIERS[0]
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].xpRequired) {
      currentTier = TIERS[i]
      break
    }
  }

  const nextTier = TIERS.find(t => t.tier === currentTier.tier + 1)
  const isMaxTier = !nextTier

  // XP within current tier
  const tierXP = xp - currentTier.xpRequired
  const tierTotalXP = nextTier ? nextTier.xpRequired - currentTier.xpRequired : 0

  // Calculate level within tier (1-10)
  let level: number
  let levelProgress: number
  let xpForCurrentLevel: number
  let xpForNextLevel: number

  if (isMaxTier) {
    // At max tier, levels are based on continuing XP (1000 XP per level beyond tier 5)
    const xpBeyond = xp - currentTier.xpRequired
    const levelsFromXP = Math.floor(xpBeyond / 1000)
    level = Math.min(levelsFromXP + 1, LEVELS_PER_TIER)
    const isMaxLevel = level >= LEVELS_PER_TIER
    xpForCurrentLevel = currentTier.xpRequired + (level - 1) * 1000
    xpForNextLevel = isMaxLevel ? xpForCurrentLevel : currentTier.xpRequired + level * 1000
    levelProgress = isMaxLevel ? 1 : (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)

    return {
      tier: currentTier.tier,
      tierName: currentTier.name,
      level,
      totalLevel: (currentTier.tier - 1) * LEVELS_PER_TIER + level,
      xp,
      xpForCurrentLevel,
      xpForNextLevel,
      levelProgress,
      isMaxTier: true,
      isMaxLevel,
    }
  }

  // For non-max tiers, divide tier XP evenly across 10 levels
  const xpPerLevel = tierTotalXP / LEVELS_PER_TIER
  level = Math.min(Math.floor(tierXP / xpPerLevel) + 1, LEVELS_PER_TIER)
  xpForCurrentLevel = currentTier.xpRequired + (level - 1) * xpPerLevel
  xpForNextLevel = currentTier.xpRequired + level * xpPerLevel
  levelProgress = (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)
  const isMaxLevel = level >= LEVELS_PER_TIER && levelProgress >= 1

  return {
    tier: currentTier.tier,
    tierName: currentTier.name,
    level,
    totalLevel: (currentTier.tier - 1) * LEVELS_PER_TIER + level,
    xp,
    xpForCurrentLevel,
    xpForNextLevel,
    levelProgress: Math.min(1, levelProgress),
    isMaxTier: false,
    isMaxLevel,
  }
}

export function getTierName(tier: number): string {
  return TIERS.find(t => t.tier === tier)?.name || 'Unknown'
}

// --- Streak Calculation ---

export function calculateStreak(lastActiveDate: string | null, today: string): number {
  if (!lastActiveDate) return 1
  const last = new Date(lastActiveDate)
  const now = new Date(today)
  const diffMs = now.getTime() - last.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return -1 // same day, no bonus
  if (diffDays === 1) return 1  // consecutive day, extend streak
  return 0 // streak broken
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

// --- Skill Level Calculation ---

export interface SkillProgress {
  skillId: string
  level: number
  xp: number
  xpForNextLevel: number
  progress: number  // 0-1
}

export function getSkillProgress(skillId: string, skillXP: number): SkillProgress {
  let level = 1
  let accumulated = 0

  for (let l = 1; l <= MAX_SKILL_LEVEL; l++) {
    const needed = getSkillXPForLevel(l)
    if (skillXP >= accumulated + needed) {
      accumulated += needed
      level = l + 1
    } else {
      const xpInLevel = skillXP - accumulated
      return {
        skillId,
        level: l,
        xp: skillXP,
        xpForNextLevel: needed,
        progress: xpInLevel / needed,
      }
    }
  }

  return {
    skillId,
    level: Math.min(level, MAX_SKILL_LEVEL),
    xp: skillXP,
    xpForNextLevel: getSkillXPForLevel(MAX_SKILL_LEVEL),
    progress: 1,
  }
}

// Avatar path by tier
export function getAvatarForTier(tier: number): string {
  if (tier <= 0 || tier > 5) return '/avatars/nio-tier-1-idle.gif'
  return `/avatars/nio-tier-${tier}-idle.gif`
}
