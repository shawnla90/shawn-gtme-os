'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FileText, Search } from 'lucide-react'

interface ContentItem {
  id: number
  file_path: string
  platform: string
  stage: string
  title: string | null
  slug: string | null
  date: string | null
  word_count: number | null
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-900 text-blue-300',
  x: 'bg-gray-700 text-gray-200',
  substack: 'bg-orange-900 text-orange-300',
  website: 'bg-green-900 text-green-300',
  reddit: 'bg-red-900 text-red-300',
  'nio-log': 'bg-purple-900 text-purple-300',
}

export default function ContentList() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filters
  const [platform, setPlatform] = useState('')
  const [stage, setStage] = useState('')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const limit = 30

  const fetchContent = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (platform) params.set('platform', platform)
    if (stage) params.set('stage', stage)
    if (search) params.set('search', search)
    params.set('limit', String(limit))
    params.set('offset', String(offset))

    const res = await fetch(`/api/content/?${params}`)
    const data = await res.json()
    setItems(data.items)
    setTotal(data.total)
    setPlatforms(data.platforms)
    setLoading(false)
  }, [platform, stage, search, offset])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Reset offset when filters change
  useEffect(() => {
    setOffset(0)
  }, [platform, stage, search])

  const pages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  return (
    <div className="space-y-4">
      {/* Platform filter tabs */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setPlatform('')}
          className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
            !platform ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          All
        </button>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors capitalize ${
              platform === p ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stage filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-green-800 rounded text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex gap-1">
          {['', 'draft', 'final'].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-colors capitalize ${
                stage === s ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {s || 'All Stages'}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">
        {total} items {platform && `in ${platform}`} {stage && `(${stage})`}
      </div>

      {/* Content cards */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No content found</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link key={item.id} href={`/content/${item.id}/`} className="block group">
              <div className="card hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm text-green-300 font-medium truncate">
                        {item.title || item.slug || item.file_path.split('/').pop()}
                      </div>
                      <div className="text-xs text-gray-600 truncate mt-0.5">
                        {item.file_path}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      PLATFORM_COLORS[item.platform] || 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.platform}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      item.stage === 'final' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.stage}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500 ml-7">
                  {item.date && <span>{item.date}</span>}
                  {item.word_count && <span>{item.word_count.toLocaleString()} words</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="btn text-xs disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {currentPage} of {pages}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="btn text-xs disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
