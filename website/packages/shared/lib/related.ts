type SiteKey = 'shawnos' | 'gtmos' | 'contentos'

const siteUrls: Record<SiteKey, string> = {
  shawnos: 'https://shawnos.ai',
  gtmos: 'https://thegtmos.ai',
  contentos: 'https://thecontentos.ai',
}

/**
 * Returns the production URL for a site in the network.
 * Stub for now — later wraps @vercel/related-projects.
 */
export function getSiteUrl(site: SiteKey): string {
  return siteUrls[site]
}
