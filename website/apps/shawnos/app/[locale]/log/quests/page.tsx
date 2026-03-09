import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { QuestBoardPage } from '@shawnos/shared/pages/QuestBoardPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero } from '../LogReveal'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Log.quests')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'quest board',
      'builder challenges',
      'daily tracker',
      'RPG progression',
      'Pillow dashboard',
      'build in public',
      'AI workflow',
      'Cursor IDE',
      'Python Pillow',
    ],
    alternates: { canonical: 'https://shawnos.ai/log/quests' },
    openGraph: {
      title: `${t('heroTitle')} | shawnos.ai`,
      description: t('metadata.description'),
      url: 'https://shawnos.ai/log/quests',
      images: [
        {
          url: '/og?title=Quest+Board&subtitle=Challenges+for+Builders',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: `${t('heroTitle')} | shawnos.ai`,
      description: t('metadata.description'),
      images: [
        '/og?title=Quest+Board&subtitle=Challenges+for+Builders',
      ],
    },
  }
}

export default async function Page() {
  const t = await getTranslations('Log.quests')
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Log', url: 'https://shawnos.ai/log' },
          { name: t('heroTitle'), url: 'https://shawnos.ai/log/quests' },
        ]}
      />
      <PageHero compact title={t('heroTitle')} subtitle={t('heroSubtitle')} />
      <QuestBoardPage />
    </>
  )
}
