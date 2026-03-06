export const SITES = {
  shawnos: 'https://shawnos.ai',
  gtmos: 'https://thegtmos.ai',
  contentos: 'https://thecontentos.ai',
} as const

export type SiteKey = keyof typeof SITES
