import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPageData } from '@/lib/abm'
import { LandingPageTemplate } from './LandingPageTemplate'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = getPageData(slug)
  if (!data) return {}

  return {
    title: `Built for ${data.company} | AI Sales Development Infrastructure`,
    description: `A custom proposal for scaling AI-powered sales development at ${data.company}. Personalized infrastructure, signal-based outbound, intelligent enrichment.`,
    robots: { index: false, follow: false },
  }
}

export default async function ABMPage({ params }: Props) {
  const { slug } = await params
  const data = getPageData(slug)
  if (!data) notFound()

  return <LandingPageTemplate data={data} />
}
