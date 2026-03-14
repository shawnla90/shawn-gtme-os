export const locales = ['en', 'he', 'es', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
