import type { Locale, WebDevTranslations } from './types'
import { en } from './en'
import { he } from './he'
import { es } from './es'
import { zh } from './zh'

const translations: Record<Locale, WebDevTranslations> = { en, he, es, zh }

export const VALID_LOCALES: Locale[] = ['he', 'es', 'zh']

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'en' || locale === 'he' || locale === 'es' || locale === 'zh'
}

export function getTranslations(locale: Locale): WebDevTranslations {
  return translations[locale] ?? en
}

export type { Locale, WebDevTranslations }
