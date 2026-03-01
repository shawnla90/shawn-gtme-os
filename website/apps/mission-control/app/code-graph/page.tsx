'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const GraphVisualization = dynamic(() => import('../components/GraphVisualization'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-green-500/60 font-mono text-sm animate-pulse">
        Initializing graph engine...
      </div>
    </div>
  ),
})

interface GraphNode {
  id: string
  label: string
  type: string
  filePath?: string
  size: number
  color: string
  category?: string
  contentId?: number
  platform?: string
  wordCount?: number
  stage?: string
  gitCommits?: { hash: string; message: string }[]
  commitCount?: number
}

interface GraphEdge {
  source: string
  target: string
  type: string
  weight: number
}

interface GraphData {
  source: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}

type FilterMode = 'all' | 'ts' | 'py' | 'content'

const CODE_LEGEND: { label: string; color: string }[] = [
  { label: 'Component', color: '#60a5fa' },
  { label: 'Page', color: '#818cf8' },
  { label: 'Layout', color: '#a78bfa' },
  { label: 'API', color: '#f59e0b' },
  { label: 'Hook', color: '#fb923c' },
  { label: 'Python', color: '#eab308' },
  { label: 'Library', color: '#4ade80' },
  { label: '3D', color: '#2dd4bf' },
  { label: 'Remotion', color: '#f472b6' },
  { label: 'Store', color: '#c084fc' },
  { label: 'Types', color: '#94a3b8' },
]

const CONTENT_LEGEND: { label: string; color: string }[] = [
  { label: 'LinkedIn', color: '#0a66c2' },
  { label: 'Substack', color: '#ff6719' },
  { label: 'X', color: '#e7e9ea' },
  { label: 'Reddit', color: '#ff4500' },
  { label: 'Website', color: '#4ade80' },
  { label: 'NIO Log', color: '#a78bfa' },
]

export default function CodeGraphPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [contentHtml, setContentHtml] = useState<string>('')
  const [contentBody, setContentBody] = useState<string>('')
  const [showLegend, setShowLegend] = useState(true)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchGraph = useCallback(async (f: FilterMode, search = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ filter: f })
      if (search.length >= 3) params.set('search', search)
      params.set('include', 'git')
      const res = await fetch(`/api/code-graph/?${params}`)
      if (!res.ok) throw new Error('Failed to fetch graph')
      const data = await res.json()
      setGraphData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGraph(filter)
  }, [filter, fetchGraph])

  // Debounced search — re-fetch with FTS when search changes
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchGraph(filter, searchQuery)
      }, 400)
    }
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current) }
  }, [searchQuery, filter, fetchGraph])

  // Load content markdown when a content node is selected
  useEffect(() => {
    if (!selectedNode?.contentId) {
      setContentHtml('')
      setContentBody('')
      return
    }
    const loadContent = async () => {
      try {
        const res = await fetch(`/api/content/${selectedNode.contentId}/`)
        if (res.ok) {
          const data = await res.json()
          setContentHtml(data.body_html ?? '')
          setContentBody(data.body ?? '')
        }
      } catch { /* ignore */ }
    }
    loadContent()
  }, [selectedNode?.contentId])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isContentNode = selectedNode?.id?.startsWith('content:')
  const activeLegend = filter === 'content' ? CONTENT_LEGEND :
    filter === 'all' ? [...CODE_LEGEND, ...CONTENT_LEGEND] : CODE_LEGEND

  return (
    <div className="fixed inset-0 lg:left-[220px] bg-black flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-green-900/40 bg-black/80 backdrop-blur-md z-10">
        <div className="text-[10px] text-green-600 uppercase tracking-[0.2em] font-mono">
          CODE GRAPH
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'ts', 'py', 'content'] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-all duration-200 ${
                filter === f
                  ? 'border-green-500/60 text-green-300 bg-green-500/10 shadow-[0_0_8px_rgba(74,222,128,0.1)]'
                  : 'border-gray-800 text-gray-600 hover:text-green-400 hover:border-green-800/50'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search files or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/60 border border-gray-800 rounded px-3 py-1 text-xs text-green-400 font-mono placeholder:text-gray-700 focus:border-green-600/60 focus:shadow-[0_0_8px_rgba(74,222,128,0.1)] focus:outline-none w-56 transition-all duration-200"
        />

        {/* Legend toggle */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="text-[9px] text-gray-600 hover:text-green-400 font-mono transition-colors"
        >
          {showLegend ? 'HIDE' : 'SHOW'} LEGEND
        </button>

        {/* Stats */}
        {graphData && (
          <div className="text-[10px] text-gray-600 font-mono whitespace-nowrap ml-auto">
            {graphData.nodes.length} nodes / {graphData.edges.length} edges
          </div>
        )}
      </div>

      {/* Graph canvas */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-green-600/60 font-mono text-sm animate-pulse">
              Indexing codebase...
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-red-400 font-mono text-sm">Error: {error}</div>
          </div>
        )}

        {graphData && !loading && (
          <GraphVisualization
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={handleNodeClick}
            searchQuery={searchQuery}
          />
        )}

        {/* Floating legend */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-gray-800/60 rounded-lg p-3 z-10 max-w-xs">
            <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-2 font-mono">Legend</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {activeLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_4px_var(--glow)]"
                    style={{ backgroundColor: item.color, '--glow': item.color } as any}
                  />
                  <span className="text-[9px] text-gray-500 font-mono">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail panel — code file or content */}
        {selectedNode && (
          <div className={`absolute top-0 right-0 ${isContentNode ? 'w-[50vw] max-w-2xl' : 'w-80'} h-full bg-black/95 border-l border-gray-800/60 backdrop-blur-md font-mono z-20 overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800/40 flex items-start justify-between shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-green-300 text-sm font-bold truncate">
                  {selectedNode.label}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <span className="text-[10px] text-gray-500" style={{ color: selectedNode.color }}>
                    {(selectedNode.category ?? selectedNode.type).replace(/-/g, ' ')}
                  </span>
                  {isContentNode && selectedNode.stage && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      selectedNode.stage === 'final' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {selectedNode.stage}
                    </span>
                  )}
                  {isContentNode && selectedNode.wordCount && (
                    <span className="text-[9px] text-gray-600">{selectedNode.wordCount} words</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-600 hover:text-green-400 transition-colors text-sm px-1 ml-2"
              >
                [x]
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs custom-scrollbar">
              {isContentNode && contentHtml ? (
                <>
                  {/* Rendered markdown */}
                  <div
                    className="prose-terminal"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-800/40">
                    <button
                      onClick={() => copyToClipboard(contentBody.replace(/^---[\s\S]*?---\n/, ''))}
                      className="px-3 py-1.5 text-[10px] border border-gray-700 rounded text-gray-400 hover:text-green-400 hover:border-green-700 transition-all"
                    >
                      Copy plain text
                    </button>
                    <button
                      onClick={() => copyToClipboard(contentBody)}
                      className="px-3 py-1.5 text-[10px] border border-gray-700 rounded text-gray-400 hover:text-green-400 hover:border-green-700 transition-all"
                    >
                      Copy markdown
                    </button>
                    {selectedNode.contentId && (
                      <a
                        href={`/content/${selectedNode.contentId}`}
                        className="px-3 py-1.5 text-[10px] border border-gray-700 rounded text-gray-400 hover:text-green-400 hover:border-green-700 transition-all"
                      >
                        Open full page
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Code file info */}
                  {selectedNode.filePath && (
                    <div>
                      <span className="text-gray-600 block mb-1">Path</span>
                      <span className="text-green-700 text-[10px] break-all">
                        {selectedNode.filePath}
                      </span>
                    </div>
                  )}
                  {graphData && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imports</span>
                        <span className="text-green-400">
                          {graphData.edges.filter((e) => e.source === selectedNode.id).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imported by</span>
                        <span className="text-green-400">
                          {graphData.edges.filter((e) => e.target === selectedNode.id).length}
                        </span>
                      </div>
                    </>
                  )}
                  {/* Git commits */}
                  {selectedNode.gitCommits && selectedNode.gitCommits.length > 0 && (
                    <div className="border-t border-gray-800/40 pt-3 mt-2">
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-2">Recent Commits</span>
                      <div className="space-y-1.5">
                        {selectedNode.gitCommits.map((c, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-green-700 text-[10px] shrink-0 font-mono">{c.hash}</span>
                            <span className="text-gray-400 text-[10px] truncate">{c.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
