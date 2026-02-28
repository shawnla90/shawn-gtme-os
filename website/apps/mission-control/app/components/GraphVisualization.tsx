'use client'

import { useEffect, useRef, useMemo } from 'react'
import Graph from 'graphology'
import Sigma from 'sigma'

interface GraphNode {
  id: string
  label: string
  type: string
  filePath?: string
  size: number
  color: string
  x?: number
  y?: number
  category?: string
  contentId?: number
  platform?: string
  wordCount?: number
  stage?: string
}

interface GraphEdge {
  source: string
  target: string
  type: string
  weight: number
}

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (node: GraphNode) => void
  searchQuery?: string
}

/** Dim a hex color to a fraction of its brightness */
function dimColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `#${Math.round(r * factor).toString(16).padStart(2, '0')}${Math.round(g * factor).toString(16).padStart(2, '0')}${Math.round(b * factor).toString(16).padStart(2, '0')}`
}

export default function GraphVisualization({ nodes, edges, onNodeClick, searchQuery }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sigmaRef = useRef<Sigma | null>(null)
  const graphRef = useRef<Graph | null>(null)
  const nodesMapRef = useRef<Map<string, GraphNode>>(new Map())

  // Build graph data — uses pre-computed positions from server
  const graph = useMemo(() => {
    const g = new Graph()
    const nodeMap = new Map<string, GraphNode>()

    for (const node of nodes) {
      try {
        g.addNode(node.id, {
          x: node.x ?? Math.random() * 100,
          y: node.y ?? Math.random() * 100,
          size: node.size,
          label: node.label,
          color: node.color,
          type: 'circle',
        })
        nodeMap.set(node.id, node)
      } catch {
        // Duplicate node, skip
      }
    }

    for (const edge of edges) {
      try {
        if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
          const sourceNode = nodeMap.get(edge.source)
          const edgeColor = sourceNode ? dimColor(sourceNode.color, 0.3) : '#1a1a2e'
          g.addEdge(edge.source, edge.target, {
            size: 0.5,
            color: edgeColor,
            type: 'arrow',
          })
        }
      } catch {
        // Duplicate edge, skip
      }
    }

    nodesMapRef.current = nodeMap
    graphRef.current = g
    return g
  }, [nodes, edges])

  // Initialize Sigma renderer
  useEffect(() => {
    const container = containerRef.current
    if (!container || graph.order === 0) return

    // Clean up existing instance
    if (sigmaRef.current) {
      sigmaRef.current.kill()
      sigmaRef.current = null
    }

    const renderer = new Sigma(graph, container, {
      renderEdgeLabels: false,
      defaultEdgeColor: '#0a3a0a',
      defaultNodeColor: '#22c55e',
      labelColor: { color: '#4ade80' },
      labelFont: 'monospace',
      labelSize: 10,
      labelRenderedSizeThreshold: 12,
      defaultEdgeType: 'arrow',
      stagePadding: 30,
    })

    // Click handler
    renderer.on('clickNode', ({ node }) => {
      const nodeData = nodesMapRef.current.get(node)
      if (nodeData && onNodeClick) {
        onNodeClick(nodeData)
      }
    })

    // Hover effects — brighten connected edges to the node's color
    renderer.on('enterNode', ({ node }) => {
      container.style.cursor = 'pointer'
      const nodeData = nodesMapRef.current.get(node)
      const highlightColor = nodeData?.color ?? '#4ade80'
      graph.forEachEdge(node, (edge) => {
        graph.setEdgeAttribute(edge, 'color', highlightColor)
        graph.setEdgeAttribute(edge, 'size', 1.5)
      })
      renderer.refresh()
    })

    renderer.on('leaveNode', () => {
      container.style.cursor = 'default'
      // Reset edges to dimmed source color
      graph.forEachEdge((edge, _attr, source) => {
        const sourceNode = nodesMapRef.current.get(source)
        graph.setEdgeAttribute(edge, 'color', sourceNode ? dimColor(sourceNode.color, 0.3) : '#1a1a2e')
        graph.setEdgeAttribute(edge, 'size', 0.5)
      })
      renderer.refresh()
    })

    sigmaRef.current = renderer

    return () => {
      renderer.kill()
      sigmaRef.current = null
    }
  }, [graph, onNodeClick])

  // Handle search highlighting
  useEffect(() => {
    if (!sigmaRef.current || !graphRef.current) return
    const g = graphRef.current

    if (!searchQuery) {
      // Reset all nodes to original colors
      g.forEachNode((node) => {
        const originalNode = nodesMapRef.current.get(node)
        if (originalNode) {
          g.setNodeAttribute(node, 'color', originalNode.color)
          g.setNodeAttribute(node, 'size', originalNode.size)
        }
      })
    } else {
      const query = searchQuery.toLowerCase()
      g.forEachNode((node) => {
        const originalNode = nodesMapRef.current.get(node)
        if (!originalNode) return

        const matches = originalNode.label.toLowerCase().includes(query) ||
          (originalNode.filePath?.toLowerCase().includes(query))

        g.setNodeAttribute(node, 'color', matches ? '#4ade80' : '#0a1a0a')
        g.setNodeAttribute(node, 'size', matches ? originalNode.size * 1.5 : originalNode.size * 0.5)
      })
    }

    sigmaRef.current.refresh()
  }, [searchQuery])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: '#000000' }}
    />
  )
}
