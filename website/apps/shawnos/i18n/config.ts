export const locales = ['en', 'he', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
