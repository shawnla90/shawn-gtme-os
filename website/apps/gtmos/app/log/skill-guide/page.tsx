import type { Metadata } from 'next'
import { SkillGuidePage } from '@shawnos/shared/pages/SkillGuidePage'

export const metadata: Metadata = {
  title: 'Skill Guide | How the Daily Tracker Works',
  description:
    'The origin story, stack breakdown, and RPG progression system behind the AI-native daily tracker. See how git commits become XP and build receipts become an evolving avatar.',
  keywords: [
    'skill guide',
    'daily tracker',
    'RPG progression',
    'build in public',
    'AI workflow',
    'GTM operating system',
    'Pillow dashboard',
    'developer tools',
  ],
  alternates: { canonical: 'https://thegtmos.ai/log/skill-guide' },
  openGraph: {
    title: 'Skill Guide | thegtmos.ai',
    description:
      'The origin story, stack breakdown, and RPG progression system behind the AI-native daily tracker.',
    url: 'https://thegtmos.ai/log/skill-guide',
    images: [
      {
        url: '/og?title=Skill+Guide&subtitle=How+the+daily+tracker+works',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Skill Guide | thegtmos.ai',
    description:
      'The origin story, stack breakdown, and RPG progression system behind the AI-native daily tracker.',
    images: [
      '/og?title=Skill+Guide&subtitle=How+the+daily+tracker+works',
    ],
  },
}

export default function Page() {
  return <SkillGuidePage />
}
