import type { Locale, WebDevTranslations } from './types'
import { en } from './en'
import { he } from './he'
import { es } from './es'

const translations: Record<Locale, WebDevTranslations> = { en, he, es }

export const VALID_LOCALES: Locale[] = ['he', 'es']

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'en' || locale === 'he' || locale === 'es'
}

export function getTranslations(locale: Locale): WebDevTranslations {
  return translations[locale] ?? en
}

export type { Locale, WebDevTranslations }
