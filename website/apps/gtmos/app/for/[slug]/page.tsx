import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPageData } from '@/lib/abm'
import { LandingPageTemplate } from './LandingPageTemplate'

export const dynamicParams = true
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getPageData(slug)
  if (!result || result.deprecated) return {}

  const { pageData: data, depersonalized } = result

  return {
    title: `Built for ${data.company} | AI Sales Development Infrastructure`,
    description: `A custom proposal for scaling AI-powered sales development at ${data.company}. Personalized infrastructure, signal-based outbound, intelligent enrichment.`,
    robots: depersonalized
      ? { index: true, follow: true }
      : { index: false, follow: false },
  }
}

export default async function ABMPage({ params }: Props) {
  const { slug } = await params
  const result = await getPageData(slug)
  if (!result || result.deprecated) notFound()

  return (
    <Suspense>
      <LandingPageTemplate data={result.pageData} depersonalized={result.depersonalized} />
    </Suspense>
  )
}
