'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import Sigma to avoid SSR issues
const GraphVisualization = dynamic(() => import('../components/GraphVisualization'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-green-700 font-mono text-sm animate-pulse">
        Loading graph engine...
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
}

const LEGEND: { label: string; color: string }[] = [
  { label: 'React Component', color: '#60a5fa' },
  { label: 'Page/Layout', color: '#3b82f6' },
  { label: 'API Route', color: '#f59e0b' },
  { label: 'Python', color: '#fbbf24' },
  { label: 'Library/Util', color: '#4ade80' },
  { label: 'Three.js/3D', color: '#2dd4bf' },
  { label: 'Remotion', color: '#f472b6' },
  { label: 'Store', color: '#c084fc' },
  { label: 'Types', color: '#94a3b8' },
  { label: 'Config', color: '#a78bfa' },
]

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

type FilterMode = 'all' | 'ts' | 'py' | 'imports'

export default function CodeGraphPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchGraph = useCallback(async (f: FilterMode) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/code-graph?filter=${f}`)
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

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
  }, [])

  const filteredNodes = graphData?.nodes.filter((n) =>
    searchQuery ? n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.filePath?.toLowerCase().includes(searchQuery.toLowerCase())) : true,
  )

  return (
    <div className="fixed inset-0 lg:left-[220px] bg-black flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-green-800/30 bg-black/90 backdrop-blur-sm z-10">
        <div className="text-[10px] text-green-700 uppercase tracking-widest font-mono">
          CODE GRAPH
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1">
          {(['all', 'ts', 'py'] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                filter === f
                  ? 'border-green-500 text-green-300 bg-green-900/30'
                  : 'border-green-800/30 text-gray-600 hover:text-green-400'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black border border-green-800/30 rounded px-2 py-0.5 text-xs text-green-400 font-mono placeholder:text-gray-700 focus:border-green-600 focus:outline-none w-48"
        />

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[9px] text-gray-600 font-mono">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        {graphData && (
          <div className="text-[10px] text-gray-600 font-mono whitespace-nowrap">
            {graphData.nodes.length} nodes / {graphData.edges.length} edges
          </div>
        )}
      </div>

      {/* Graph canvas */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-green-700 font-mono text-sm animate-pulse">
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
      </div>

      {/* Node detail panel */}
      {selectedNode && (
        <div className="absolute bottom-0 right-0 w-72 bg-black/95 border-l border-t border-green-800/50 backdrop-blur-sm font-mono z-20">
          <div className="px-3 py-2 border-b border-green-800/30 flex justify-between items-center">
            <span className="text-green-300 text-sm font-bold truncate">
              {selectedNode.label}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-600 hover:text-green-400 text-xs"
            >
              [x]
            </button>
          </div>
          <div className="p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Category</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: selectedNode.color }}
                />
                <span style={{ color: selectedNode.color }}>
                  {(selectedNode.category ?? selectedNode.type).replace(/-/g, ' ')}
                </span>
              </span>
            </div>
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
          </div>
        </div>
      )}
    </div>
  )
}
