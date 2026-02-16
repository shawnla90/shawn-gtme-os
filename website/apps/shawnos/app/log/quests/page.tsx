import type { Metadata } from 'next'
import { QuestBoardPage } from '@shawnos/shared/pages/QuestBoardPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'Quest Board | Challenges for Builders',
  description:
    'Five challenges to build your own daily tracker, Pillow dashboard, RPG progression engine, and more. Learn how to actually build with AI.',
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
    title: 'Quest Board | shawnos.ai',
    description:
      'Five challenges to build your own daily tracker, RPG progression engine, and more.',
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
    title: 'Quest Board | shawnos.ai',
    description:
      'Five challenges to build your own daily tracker, RPG progression engine, and more.',
    images: [
      '/og?title=Quest+Board&subtitle=Challenges+for+Builders',
    ],
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Log', url: 'https://shawnos.ai/log' },
          { name: 'Quests', url: 'https://shawnos.ai/log/quests' },
        ]}
      />
      <QuestBoardPage />
    </>
  )
}
