import type { Metadata } from 'next'
import { NexusPreviewContent } from './NexusPreviewContent'

export const metadata: Metadata = {
  title: 'Nexus Construction & Design | Website Preview',
  description: 'A preview of what your construction website could look like. Built by ShawnOS.ai.',
  robots: { index: false, follow: false },
}

export default function NexusPreviewPage() {
  return <NexusPreviewContent />
}
