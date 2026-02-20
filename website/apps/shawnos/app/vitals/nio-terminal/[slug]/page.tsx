import type { Metadata } from 'next'
import { NioPostPage } from '@shawnos/shared/pages/NioPostPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { notFound } from 'next/navigation'

interface NioPostRouteProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NioPostRouteProps): Promise<Metadata> {
  const { slug } = await params
  
  return {
    title: `${slug} - nio.terminal`,
    description: `AI development log entry: ${slug}`,
    alternates: { canonical: `https://shawnos.ai/vitals/nio-terminal/${slug}` },
  }
}

export default async function NioPostRoute({ params }: NioPostRouteProps) {
  const { slug } = await params
  
  // Support post-zero and post-one
  if (slug !== 'post-zero' && slug !== 'post-one') {
    notFound()
  }

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Vitals', url: 'https://shawnos.ai/vitals' },
          { name: 'nio.terminal', url: 'https://shawnos.ai/vitals/nio-terminal' },
          { name: slug, url: `https://shawnos.ai/vitals/nio-terminal/${slug}` }
        ]} 
      />
      <NioPostPage slug={slug} />
    </>
  )
}