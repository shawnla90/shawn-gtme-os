import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Graph from 'graphology'
import forceAtlas2 from 'graphology-layout-forceatlas2'

export const dynamic = 'force-dynamic'

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const GITNEXUS_DIR = path.join(REPO_ROOT, '.gitnexus')

interface GraphNode {
  id: string
  label: string
  type: string
  filePath?: string
  size: number
  color: string
  category: string
  x?: number
  y?: number
}

interface GraphEdge {
  source: string
  target: string
  type: 'imports' | 'calls' | 'contains' | 'extends' | 'implements'
  weight: number
}

// Color-coded by file category — maximally distinct palette
const CATEGORY_COLORS: Record<string, string> = {
  'react-component': '#60a5fa',  // blue — React components (.tsx)
  'react-page':      '#818cf8',  // indigo — page.tsx (visually distinct from components)
  'react-layout':    '#a78bfa',  // purple — layout.tsx / loading.tsx
  'api-route':       '#f59e0b',  // amber — API routes
  'hook':            '#fb923c',  // orange — React hooks (use*.ts)
  'middleware':       '#e879f9',  // fuchsia — middleware files
  'python':          '#eab308',  // yellow — Python scripts
  'config':          '#a78bfa',  // purple — config files
  'library':         '#4ade80',  // green — shared lib/util
  'remotion':        '#f472b6',  // pink — Remotion/motion video
  'style':           '#38bdf8',  // sky — CSS/styles
  'three-js':        '#2dd4bf',  // teal — Three.js / 3D
  'store':           '#c084fc',  // violet — state stores
  'types':           '#94a3b8',  // slate — type definitions
  'script':          '#eab308',  // yellow — scripts
  'content':         '#34d399',  // emerald — content-related
  'test':            '#f87171',  // red — tests
  'unknown':         '#6b7280',  // gray — fallback
}

// Platform colors for content nodes
const PLATFORM_COLORS: Record<string, string> = {
  'linkedin':  '#0a66c2',
  'substack':  '#ff6719',
  'x':         '#e7e9ea',
  'reddit':    '#ff4500',
  'website':   '#4ade80',
  'nio-log':   '#a78bfa',
}

/**
 * Try to read the GitNexus KuzuDB index and extract graph data.
 * Falls back to a file-system-based graph if KuzuDB isn't available.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter') ?? 'all' // all | ts | py | content
  const search = url.searchParams.get('search') ?? ''
  const includeGit = url.searchParams.get('include') === 'git'

  try {
    // Try the GitNexus HTTP API first (if `gitnexus serve` is running)
    if (filter !== 'content') {
      try {
        const apiRes = await fetch('http://localhost:4242/api/graph', {
          signal: AbortSignal.timeout(2000),
        })
        if (apiRes.ok) {
          const data = await apiRes.json()
          return NextResponse.json({ source: 'gitnexus-api', ...data })
        }
      } catch {
        // GitNexus server not running, fall back
      }
    }

    // Build code graph (skip for content-only filter)
    const codeGraph = filter === 'content'
      ? { nodes: [], edges: [] }
      : buildFileGraph(filter)

    // Add content nodes when filter is 'all' or 'content', or when searching
    if (filter === 'all' || filter === 'content' || search.length >= 3) {
      const contentData = loadContentNodes(search)
      codeGraph.nodes.push(...contentData.nodes)
      codeGraph.edges.push(...contentData.edges)

      // Re-run layout with content nodes included
      if (codeGraph.nodes.length > 0) {
        const g = new Graph()
        for (const node of codeGraph.nodes) {
          try {
            g.addNode(node.id, { x: node.x ?? Math.random() * 100, y: node.y ?? Math.random() * 100, size: node.size })
          } catch { /* dup */ }
        }
        for (const edge of codeGraph.edges) {
          try {
            if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
              g.addEdge(edge.source, edge.target, { weight: edge.weight })
            }
          } catch { /* dup */ }
        }
        forceAtlas2.assign(g, {
          iterations: 50,
          settings: { gravity: 1, scalingRatio: 10, barnesHutOptimize: true, strongGravityMode: true, slowDown: 5 },
        })
        for (const node of codeGraph.nodes) {
          try {
            const attrs = g.getNodeAttributes(node.id)
            node.x = attrs.x
            node.y = attrs.y
          } catch { /* node not in graph */ }
        }
      }
    }

    // Add git info if requested
    if (includeGit) {
      addGitInfo(codeGraph.nodes)
    }

    return NextResponse.json({ source: 'filesystem', ...codeGraph })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to build graph', source: 'none', nodes: [], edges: [] },
      { status: 500 },
    )
  }
}

/**
 * Build a file-level dependency graph by scanning imports in TS/JS/Python files.
 */
function buildFileGraph(filter: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const nodeIds = new Set<string>()

  // Key directories to scan
  const scanDirs = [
    'website/apps/mission-control/app',
    'website/apps/gtmos/app',
    'website/apps/shawnos/app',
    'website/packages/shared/lib',
    'website/packages/hypernovum-core/src',
    'scripts',
  ]

  const extensions = filter === 'py' ? ['.py'] :
    filter === 'ts' ? ['.ts', '.tsx'] :
    ['.ts', '.tsx', '.js', '.jsx', '.py']

  for (const dir of scanDirs) {
    const fullDir = path.join(REPO_ROOT, dir)
    if (!fs.existsSync(fullDir)) continue
    scanDirectory(fullDir, extensions, nodes, edges, nodeIds, REPO_ROOT)
  }

  // Server-side ForceAtlas2 layout — compute positions so client renders instantly
  if (nodes.length > 0) {
    const g = new Graph()
    for (const node of nodes) {
      g.addNode(node.id, { x: Math.random() * 100, y: Math.random() * 100, size: node.size })
    }
    for (const edge of edges) {
      try {
        if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
          g.addEdge(edge.source, edge.target, { weight: edge.weight })
        }
      } catch { /* duplicate edge */ }
    }
    forceAtlas2.assign(g, {
      iterations: 50,
      settings: {
        gravity: 1,
        scalingRatio: 10,
        barnesHutOptimize: g.order > 100,
        strongGravityMode: true,
        slowDown: 5,
      },
    })
    for (const node of nodes) {
      const attrs = g.getNodeAttributes(node.id)
      node.x = attrs.x
      node.y = attrs.y
    }
  }

  return { nodes, edges }
}

function scanDirectory(
  dir: string,
  extensions: string[],
  nodes: GraphNode[],
  edges: GraphEdge[],
  nodeIds: Set<string>,
  repoRoot: string,
) {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', '__pycache__', 'dist'].includes(entry.name)) continue
      scanDirectory(fullPath, extensions, nodes, edges, nodeIds, repoRoot)
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      const relPath = path.relative(repoRoot, fullPath)
      const nodeId = relPath

      // Read content once for both categorization and import parsing
      let content = ''
      try {
        content = fs.readFileSync(fullPath, 'utf-8')
      } catch {
        // Skip unreadable
      }

      if (!nodeIds.has(nodeId)) {
        const category = getFileCategory(entry.name, relPath, content)
        const stat = fs.statSync(fullPath)
        nodes.push({
          id: nodeId,
          label: entry.name,
          type: category,
          filePath: relPath,
          size: Math.max(3, Math.min(15, Math.log2(stat.size / 100 + 1) * 3)),
          color: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.unknown,
          category,
        })
        nodeIds.add(nodeId)
      }

      // Parse imports
      try {
        const imports = extractImports(content, relPath)
        for (const imp of imports) {
          const resolvedTarget = resolveImport(imp, relPath, repoRoot)
          if (resolvedTarget && nodeIds.has(resolvedTarget)) {
            edges.push({
              source: nodeId,
              target: resolvedTarget,
              type: 'imports',
              weight: 1,
            })
          }
        }
      } catch {
        // Skip unreadable files
      }
    }
  }
}

function getFileCategory(filename: string, filePath: string, fileContent?: string): string {
  const lowerPath = filePath.toLowerCase()

  // Python
  if (filename.endsWith('.py')) return 'python'

  // CSS/styles
  if (filename.endsWith('.css') || filename.endsWith('.scss')) return 'style'

  // Config files
  if (filename.match(/\.(config|rc)\.(ts|js|mjs|cjs)$/) || filename === 'tsconfig.json') return 'config'

  // Test files
  if (filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) return 'test'

  // Middleware
  if (filename === 'middleware.ts' || filename === 'middleware.js') return 'middleware'

  // Type definitions
  if (filename.endsWith('.d.ts') || filename === 'types.ts' || lowerPath.includes('/types/')) return 'types'

  // API routes
  if (lowerPath.includes('/api/') && filename === 'route.ts') return 'api-route'

  // Remotion / motion video — check content for Composition/useCurrentFrame imports
  if (lowerPath.includes('remotion') || lowerPath.includes('/video/') || lowerPath.includes('apps/motion')) return 'remotion'
  if (fileContent && (fileContent.includes('Composition') || fileContent.includes('useCurrentFrame'))) return 'remotion'

  // Three.js / 3D city
  if (lowerPath.includes('hypernovum') || lowerPath.includes('cityscene') || lowerPath.includes('/city/')) return 'three-js'

  // State stores
  if (lowerPath.includes('/store') || filename.includes('store')) return 'store'

  // React hooks (use*.ts or use*.tsx but not page/layout)
  if (filename.match(/^use[A-Z].*\.(ts|tsx)$/)) return 'hook'

  // Shared libraries
  if (lowerPath.includes('/lib/') || lowerPath.includes('/utils/') || lowerPath.includes('packages/shared')) return 'library'

  // Content related
  if (lowerPath.includes('/content/') && !lowerPath.includes('/api/')) return 'content'

  // React layouts/loading (split from page)
  if (filename === 'layout.tsx' || filename === 'loading.tsx') return 'react-layout'

  // React page routes
  if (filename === 'page.tsx') return 'react-page'

  // React components (.tsx)
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'react-component'

  // Scripts
  if (lowerPath.includes('scripts/')) return 'script'

  // Generic TS/JS
  if (filename.endsWith('.ts') || filename.endsWith('.js')) return 'library'

  return 'unknown'
}

function extractImports(content: string, filePath: string): string[] {
  const imports: string[] = []

  // TypeScript/JavaScript imports
  Array.from(content.matchAll(/(?:import|from)\s+['"]([^'"]+)['"]/g)).forEach((match) => {
    imports.push(match[1])
  })

  // Python imports
  if (filePath.endsWith('.py')) {
    Array.from(content.matchAll(/(?:from\s+(\S+)\s+import|import\s+(\S+))/g)).forEach((match) => {
      imports.push(match[1] ?? match[2])
    })
  }

  return imports
}

function resolveImport(importPath: string, fromFile: string, repoRoot: string): string | null {
  // Skip node_modules / external packages
  if (!importPath.startsWith('.') && !importPath.startsWith('@hypernovum')) return null

  const fromDir = path.dirname(fromFile)
  let resolved: string

  if (importPath.startsWith('@hypernovum/core')) {
    resolved = importPath.replace('@hypernovum/core', 'website/packages/hypernovum-core/src')
  } else {
    resolved = path.join(fromDir, importPath)
  }

  // Try common extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '.py']
  for (const ext of extensions) {
    const candidate = resolved + ext
    if (fs.existsSync(path.join(repoRoot, candidate))) {
      return candidate
    }
  }

  // Try exact path
  if (fs.existsSync(path.join(repoRoot, resolved))) {
    return resolved
  }

  return null
}

/**
 * Load content pieces from index.db as graph nodes.
 */
function loadContentNodes(search: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  try {
    const Database = require('better-sqlite3')
    const dbPath = path.resolve(REPO_ROOT, 'data/index.db')
    if (!fs.existsSync(dbPath)) return { nodes, edges }

    const db = new Database(dbPath, { readonly: true })

    // Query content — optionally filtered by FTS search
    let rows: any[]
    if (search.length >= 3) {
      rows = db.prepare(`
        SELECT c.id, c.title, c.platform, c.stage, c.word_count, c.date, c.file_path, c.body
        FROM content c
        JOIN content_fts fts ON fts.rowid = c.rowid
        WHERE content_fts MATCH ?
        ORDER BY rank
        LIMIT 200
      `).all(search)
    } else {
      rows = db.prepare(`
        SELECT id, title, platform, stage, word_count, date, file_path, body
        FROM content
        ORDER BY date DESC
        LIMIT 200
      `).all()
    }

    for (const row of rows) {
      const nodeId = `content:${row.id}`
      const platform = row.platform ?? 'unknown'
      const wordCount = row.word_count ?? 0
      nodes.push({
        id: nodeId,
        label: row.title || path.basename(row.file_path ?? '', '.md'),
        type: 'content',
        filePath: row.file_path,
        size: Math.max(4, Math.min(18, Math.log2(wordCount / 50 + 1) * 4)),
        color: PLATFORM_COLORS[platform] ?? '#6b7280',
        category: `content-${platform}`,
        x: undefined,
        y: undefined,
        contentId: row.id,
        platform,
        wordCount,
        stage: row.stage,
      } as GraphNode & { contentId: number; platform: string; wordCount: number; stage: string })
    }

    // Load content links for edges
    const links = db.prepare(`
      SELECT source_id, target_id, link_type FROM content_links
    `).all() as { source_id: number; target_id: number; link_type: string }[]

    const nodeIdSet = new Set(rows.map((r: any) => r.id))
    for (const link of links) {
      if (nodeIdSet.has(link.source_id) && nodeIdSet.has(link.target_id)) {
        edges.push({
          source: `content:${link.source_id}`,
          target: `content:${link.target_id}`,
          type: 'imports',
          weight: 0.5,
        })
      }
    }

    db.close()
  } catch {
    // DB not available — return empty
  }

  return { nodes, edges }
}

/**
 * Add git commit info to code file nodes.
 */
function addGitInfo(nodes: GraphNode[]) {
  const { execSync } = require('child_process')

  for (const node of nodes) {
    if (!node.filePath || node.id.startsWith('content:')) continue
    try {
      const fullPath = path.join(REPO_ROOT, node.filePath)
      if (!fs.existsSync(fullPath)) continue
      const log = execSync(
        `git log --oneline -5 -- "${node.filePath}"`,
        { cwd: REPO_ROOT, timeout: 3000, encoding: 'utf-8' },
      ).trim()
      if (log) {
        const commits = log.split('\n').map((line: string) => {
          const [hash, ...rest] = line.split(' ')
          return { hash, message: rest.join(' ') }
        })
        ;(node as any).gitCommits = commits
        ;(node as any).commitCount = commits.length
      }
    } catch {
      // git not available or file not tracked
    }
  }
}
