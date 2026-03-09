import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SkillGuidePage } from '@shawnos/shared/pages/SkillGuidePage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero } from '../LogReveal'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Log.skillGuide')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'skill guide',
      'daily tracker',
      'RPG progression',
      'build in public',
      'AI workflow',
      'Cursor IDE',
      'Pillow dashboard',
      'developer tools',
    ],
    alternates: { canonical: 'https://shawnos.ai/log/skill-guide' },
    openGraph: {
      title: `${t('heroTitle')} | shawnos.ai`,
      description: t('metadata.description'),
      url: 'https://shawnos.ai/log/skill-guide',
      images: [
        {
          url: '/og?title=Skill+Guide&subtitle=How+the+daily+tracker+works',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: `${t('heroTitle')} | shawnos.ai`,
      description: t('metadata.description'),
      images: [
        '/og?title=Skill+Guide&subtitle=How+the+daily+tracker+works',
      ],
    },
  }
}

export default async function Page() {
  const t = await getTranslations('Log.skillGuide')
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Log', url: 'https://shawnos.ai/log' },
          { name: t('heroTitle'), url: 'https://shawnos.ai/log/skill-guide' },
        ]}
      />
      <PageHero compact title={t('heroTitle')} subtitle={t('heroSubtitle')} />
      <SkillGuidePage />
    </>
  )
}
