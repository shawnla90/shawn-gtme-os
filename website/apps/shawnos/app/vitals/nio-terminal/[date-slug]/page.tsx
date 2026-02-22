import type { Metadata } from 'next'
import { NioPostPage } from '@shawnos/shared/pages/NioPostPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { notFound } from 'next/navigation'

interface NioPostRouteProps {
  params: Promise<{ 'date-slug': string }>
}

export async function generateMetadata({ params }: NioPostRouteProps): Promise<Metadata> {
  const { 'date-slug': dateSlug } = await params

  return {
    title: `${dateSlug} - nio.terminal`,
    description: `AI development log entry: ${dateSlug}`,
    alternates: { canonical: `https://shawnos.ai/vitals/nio-terminal/${dateSlug}` },
  }
}

export default async function NioPostRoute({ params }: NioPostRouteProps) {
  const { 'date-slug': dateSlug } = await params

  // Support legacy slugs and date-based slugs (YYYY-MM-DD)
  const validLegacyPosts = ['post-zero', 'post-one']
  const datePattern = /^\d{4}-\d{2}-\d{2}$/

  if (!validLegacyPosts.includes(dateSlug) && !datePattern.test(dateSlug)) {
    notFound()
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Vitals', url: 'https://shawnos.ai/vitals' },
          { name: 'nio.terminal', url: 'https://shawnos.ai/vitals/nio-terminal' },
          { name: dateSlug, url: `https://shawnos.ai/vitals/nio-terminal/${dateSlug}` },
        ]}
      />
      <NioPostPage slug={dateSlug} />
    </>
  )
}
