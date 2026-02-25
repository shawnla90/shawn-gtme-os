import { getDb } from '../../lib/db'
import { markdownToHtml } from '@shawnos/shared/lib'
import MarkdownViewer from '../../components/MarkdownViewer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ContentDetailProps {
  params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: ContentDetailProps) {
  const { id } = await params
  const db = getDb('index')

  const row = db.prepare('SELECT * FROM content WHERE id = ?').get(id) as Record<string, unknown> | undefined

  if (!row) {
    return (
      <div className="space-y-6">
        <Link href="/content/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          &larr; Back to Content
        </Link>
        <div className="card text-center py-12">
          <p className="text-gray-500">Content not found.</p>
        </div>
      </div>
    )
  }

  let bodyHtml = ''
  if (row.body && typeof row.body === 'string') {
    bodyHtml = await markdownToHtml(row.body)
  }

  const platformColors: Record<string, string> = {
    linkedin: 'bg-blue-900 text-blue-300',
    x: 'bg-gray-700 text-gray-200',
    substack: 'bg-orange-900 text-orange-300',
    website: 'bg-green-900 text-green-300',
    reddit: 'bg-red-900 text-red-300',
    'nio-log': 'bg-purple-900 text-purple-300',
  }

  return (
    <div className="space-y-6">
      <Link href="/content/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; Back to Content
      </Link>

      {/* Metadata header */}
      <div className="card">
        <h1 className="text-xl font-bold text-green-300 mb-3">
          {(row.title as string) || (row.slug as string) || 'Untitled'}
        </h1>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded font-medium ${
            platformColors[row.platform as string] || 'bg-gray-800 text-gray-400'
          }`}>
            {row.platform as string}
          </span>
          <span className={`px-2 py-0.5 rounded font-medium ${
            row.stage === 'final' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {row.stage as string}
          </span>
          {row.date ? <span className="text-gray-500">{String(row.date)}</span> : null}
          {row.word_count ? <span className="text-gray-500">{Number(row.word_count).toLocaleString()} words</span> : null}
          {row.pillar ? <span className="text-gray-500">Pillar: {String(row.pillar)}</span> : null}
        </div>
        <div className="text-xs text-gray-600 mt-2 truncate">{row.file_path as string}</div>
      </div>

      {/* Rendered content */}
      {bodyHtml ? (
        <div className="card">
          <MarkdownViewer html={bodyHtml} />
        </div>
      ) : (
        <div className="card text-center py-8 text-gray-500">
          No body content available.
        </div>
      )}
    </div>
  )
}
