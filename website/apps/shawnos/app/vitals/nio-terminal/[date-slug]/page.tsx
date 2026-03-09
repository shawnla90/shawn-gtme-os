import type { Metadata } from 'next'
import { NioPostPage } from '@shawnos/shared/pages/NioPostPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getNioBlogSlugs } from '@shawnos/shared/lib/nio-blog'
import { notFound } from 'next/navigation'

interface NioPostRouteProps {
  params: Promise<{ 'date-slug': string }>
}

export async function generateStaticParams() {
  const slugs = getNioBlogSlugs()
  return slugs.map((slug) => ({ 'date-slug': slug }))
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

  const allSlugs = getNioBlogSlugs()
  if (!allSlugs.includes(dateSlug)) {
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
