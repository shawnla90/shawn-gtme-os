import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'
import { CryptoLab } from './CryptoLab'

export const metadata: Metadata = {
  title: 'Crypto OS | ShawnOS.ai',
  description:
    'AI-powered crypto signal analyzer. $100 budget. Cyborg model: AI analyzes, I decide, I execute. Built in public.',
  keywords: [
    'crypto signal analyzer',
    'AI crypto analysis',
    'build in public crypto',
    'cyborg trading model',
    'CoinGecko API',
    'fear greed index',
    'crypto sentiment analysis',
    'algorithmic trading signals',
  ],
  alternates: {
    canonical: 'https://shawnos.ai/lab/crypto',
    languages: hreflang('/lab/crypto'),
  },
  openGraph: {
    title: 'Crypto OS | ShawnOS.ai',
    description:
      'AI-powered crypto signal analyzer. $100 budget. AI analyzes. I decide. I execute.',
    url: 'https://shawnos.ai/lab/crypto',
    images: [
      {
        url: '/og?title=crypto-os&subtitle=AI+analyzes.+I+decide.+I+execute.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Crypto OS | ShawnOS.ai',
    description:
      'AI-powered crypto signal analyzer. $100 budget. AI analyzes. I decide. I execute.',
    images: ['/og?title=crypto-os&subtitle=AI+analyzes.+I+decide.+I+execute.'],
  },
}

export default function CryptoLabPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Crypto OS', url: 'https://shawnos.ai/lab/crypto' }]} />
      <CryptoLab />
    </>
  )
}
