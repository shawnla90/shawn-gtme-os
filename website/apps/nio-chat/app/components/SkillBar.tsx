// NioBot V3 — Single skill progress bar component

'use client'

interface SkillBarProps {
  name: string
  level: number
  progress: number  // 0-1
  color: string
}

export default function SkillBar({ name, level, progress, color }: SkillBarProps) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[var(--text-secondary)]">{name}</span>
        <span className="text-[10px] text-[var(--text-muted)]">lv.{level}</span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
