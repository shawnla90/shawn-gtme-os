import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { resolveDataRoot, getLearningDisciplines } from '@shawnos/shared/lib'
import { LearningPage } from '@shawnos/shared/pages/LearningPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'

const SITE_URL = 'https://shawnos.ai'
const DATA_ROOT = resolveDataRoot()

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const title = "Skills I'm learning"
  const description =
    'The off-keyboard craft behind the build — photography, video, audio — tracked in public from exploring to shipping.'
  const og = '/og?title=Skills&subtitle=Learning+in+public'
  return {
    title,
    description,
    keywords: [
      'learning in public',
      'photography',
      'DaVinci Resolve',
      'video editing',
      'audio editing',
      'build in public',
      'skills',
    ],
    alternates: { canonical: `${SITE_URL}/log/skills`, languages: hreflang('/log/skills') },
    openGraph: {
      title: `${title} | shawnos.ai`,
      description,
      url: `${SITE_URL}/log/skills`,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${title} | shawnos.ai`,
      description,
      images: [og],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const { disciplines, updated } = getLearningDisciplines(DATA_ROOT)
  const logHref = locale === 'en' ? '/log' : `/${locale}/log`

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Log', url: `${SITE_URL}/log` },
          { name: "Skills I'm learning", url: `${SITE_URL}/log/skills` },
        ]}
      />
      <LearningPage
        disciplines={disciplines}
        updated={updated}
        logHref={logHref}
        title="Skills I'm learning"
        subtitle="The off-keyboard craft behind the build — tracked in public, from exploring to shipping."
      />
    </>
  )
}
