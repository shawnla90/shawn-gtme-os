import { locales, defaultLocale } from './config'

const SITE_URL = 'https://shawnos.ai'

/**
 * Generate hreflang alternates for a given path.
 * Usage: alternates: { canonical: '...', languages: hreflang('/about') }
 */
export function hreflang(path: string): Record<string, string> {
  const clean = path === '/' ? '' : path
  const result: Record<string, string> = {}
  for (const locale of locales) {
    if (locale === defaultLocale) {
      result[locale] = `${SITE_URL}${clean || '/'}`
    } else {
      result[locale] = `${SITE_URL}/${locale}${clean}`
    }
  }
  result['x-default'] = `${SITE_URL}${clean || '/'}`
  return result
}
