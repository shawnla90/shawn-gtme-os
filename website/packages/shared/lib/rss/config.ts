import type { FeedConfig, SiteKey } from './types'

export const AUTHOR = {
  name: 'Shawn Tenam',
  link: 'https://shawnos.ai',
} as const

export const SITE_URLS: Record<SiteKey, string> = {
  shawnos: 'https://shawnos.ai',
  gtmos: 'https://thegtmos.ai',
  contentos: 'https://thecontentos.ai',
}

const SITE_DESCRIPTIONS: Record<SiteKey, string> = {
  shawnos: 'GTM engineering, built in public.',
  gtmos: 'The GTM Operating System — knowledge base for go-to-market engineering.',
  contentos:
    'The Content Operating System — frameworks and tools for content-driven growth.',
}

/**
 * Build a FeedConfig for a given site, with sensible defaults.
 * Pass `feedPath` in overrides to set the self-referencing feed URL
 * (defaults to `/feed.xml`).
 */
export function getFeedConfig(
  site: SiteKey,
  overrides?: Partial<FeedConfig> & { feedPath?: string },
): FeedConfig {
  const siteUrl = SITE_URLS[site]
  const feedPath = overrides?.feedPath ?? '/feed.xml'
  const { feedPath: _, ...rest } = overrides ?? {}

  return {
    title: siteUrl.replace('https://', ''),
    description: SITE_DESCRIPTIONS[site],
    id: `${siteUrl}/`,
    link: siteUrl,
    language: 'en',
    copyright: `© ${new Date().getFullYear()} Shawn Tenam. All rights reserved.`,
    feedLinks: { rss: `${siteUrl}${feedPath}` },
    author: { ...AUTHOR },
    ...rest,
  }
}
