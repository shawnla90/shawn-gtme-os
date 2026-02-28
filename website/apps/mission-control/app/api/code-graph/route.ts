import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

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
}

interface GraphEdge {
  source: string
  target: string
  type: 'imports' | 'calls' | 'contains' | 'extends' | 'implements'
  weight: number
}

// Color-coded by file category
const CATEGORY_COLORS: Record<string, string> = {
  'react-component': '#60a5fa',  // blue — React components (.tsx)
  'react-page':      '#3b82f6',  // bright blue — page.tsx / layout.tsx
  'api-route':       '#f59e0b',  // amber — API routes
  'python':          '#fbbf24',  // yellow — Python scripts
  'config':          '#a78bfa',  // purple — config files
  'library':         '#4ade80',  // green — shared lib/util
  'remotion':        '#f472b6',  // pink — Remotion/motion video
  'style':           '#fb923c',  // orange — CSS/styles
  'three-js':        '#2dd4bf',  // teal — Three.js / 3D
  'store':           '#c084fc',  // violet — state stores
  'types':           '#94a3b8',  // slate — type definitions
  'script':          '#fbbf24',  // yellow — scripts
  'content':         '#34d399',  // emerald — content-related
  'test':            '#f87171',  // red — tests
  'unknown':         '#6b7280',  // gray — fallback
}

/**
 * Try to read the GitNexus KuzuDB index and extract graph data.
 * Falls back to a file-system-based graph if KuzuDB isn't available.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter') ?? 'all' // all | ts | py | imports

  try {
    // Try the GitNexus HTTP API first (if `gitnexus serve` is running)
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

    // Fall back: build a dependency graph from the codebase directly
    const graph = buildFileGraph(filter)
    return NextResponse.json({ source: 'filesystem', ...graph })
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

      if (!nodeIds.has(nodeId)) {
        const category = getFileCategory(entry.name, relPath)
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
        const content = fs.readFileSync(fullPath, 'utf-8')
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

function getFileCategory(filename: string, filePath: string): string {
  const lowerPath = filePath.toLowerCase()

  // Python
  if (filename.endsWith('.py')) return 'python'

  // CSS/styles
  if (filename.endsWith('.css') || filename.endsWith('.scss')) return 'style'

  // Config files
  if (filename.match(/\.(config|rc)\.(ts|js|mjs|cjs)$/) || filename === 'tsconfig.json') return 'config'

  // Test files
  if (filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) return 'test'

  // Type definitions
  if (filename.endsWith('.d.ts') || filename === 'types.ts' || lowerPath.includes('/types/')) return 'types'

  // API routes
  if (lowerPath.includes('/api/') && filename === 'route.ts') return 'api-route'

  // Remotion / motion video
  if (lowerPath.includes('remotion') || lowerPath.includes('/video/') || lowerPath.includes('apps/motion')) return 'remotion'

  // Three.js / 3D city
  if (lowerPath.includes('hypernovum') || lowerPath.includes('three') || lowerPath.includes('cityscene') || lowerPath.includes('city')) return 'three-js'

  // State stores
  if (lowerPath.includes('/store') || filename.includes('store')) return 'store'

  // Shared libraries
  if (lowerPath.includes('/lib/') || lowerPath.includes('/utils/') || lowerPath.includes('packages/shared')) return 'library'

  // Content related
  if (lowerPath.includes('/content/') && !lowerPath.includes('/api/')) return 'content'

  // React pages and layouts
  if (filename === 'page.tsx' || filename === 'layout.tsx' || filename === 'loading.tsx') return 'react-page'

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
