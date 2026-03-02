export const PLATFORM_COLORS = {
  contentos: { hex: '#FF69B4', rgb: '255, 105, 180', label: 'Content OS' },
  linkedin:  { hex: '#0A66C2', rgb: '10, 102, 194', label: 'LinkedIn' },
  reddit:    { hex: '#FF4500', rgb: '255, 69, 0', label: 'Reddit' },
  x:         { hex: '#1D9BF0', rgb: '29, 155, 240', label: 'X' },
  substack:  { hex: '#FF6719', rgb: '255, 103, 25', label: 'Substack' },
  tiktok:    { hex: '#00F2EA', rgb: '0, 242, 234', label: 'TikTok' },
  youtube:   { hex: '#FF0000', rgb: '255, 0, 0', label: 'YouTube' },
} as const

export type PlatformKey = keyof typeof PLATFORM_COLORS

export function platformRgba(platform: PlatformKey, alpha: number): string {
  return `rgba(${PLATFORM_COLORS[platform].rgb}, ${alpha})`
}

/** Detect platform from a slug or title string */
export function detectPlatform(text: string): PlatformKey | null {
  const lower = text.toLowerCase()
  if (lower.includes('linkedin')) return 'linkedin'
  if (lower.includes('reddit')) return 'reddit'
  if (lower.startsWith('x-') || lower.includes('x ') || lower.includes('twitter')) return 'x'
  if (lower.includes('substack')) return 'substack'
  if (lower.includes('tiktok')) return 'tiktok'
  if (lower.includes('youtube')) return 'youtube'
  return null
}
