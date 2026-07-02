'use client'

// Two-pane vault shell: persistent file tree (desktop) + reader pane.
// Mobile: the tree lives on /vault, file pages go full-width with a back bar.
// Lives in the /vault layout so tree expand/collapse state survives navigation.
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { FileTree, type FileTreeElement } from '../../../components/unlumen-ui/file-tree'
import { Link } from '../../../i18n/navigation'

export default function VaultShell({
  tree,
  children,
}: {
  tree: FileTreeElement[]
  children: ReactNode
}) {
  const pathname = usePathname()
  // pathname may carry a locale prefix — grab what follows /vault
  const m = pathname.match(/\/vault(?:\/([a-z0-9-]+)\/([a-z0-9-]+))?/)
  const activeId = m?.[1] && m?.[2] ? `${m[1]}/${m[2]}` : undefined
  const isFileView = Boolean(activeId)
  const defaultOpen = activeId ? [activeId.split('/')[0]] : [tree[0]?.id].filter(Boolean)

  return (
    <div className="vault-shell" data-view={isFileView ? 'file' : 'index'}>
      <style>{`
        .vault-shell { max-width: 1120px; margin: 0 auto; padding: 40px 0 110px; display: flex; gap: 40px; align-items: flex-start; }
        .vault-tree { width: 300px; flex-shrink: 0; position: sticky; top: 84px; max-height: calc(100vh - 110px); overflow-y: auto; }
        .vault-tree-kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 10px 4px; }
        .vault-main { flex: 1; min-width: 0; }
        .vault-back { display: none; }
        @media (max-width: 860px) {
          .vault-shell { flex-direction: column; gap: 24px; padding-top: 24px; }
          .vault-tree { width: 100%; position: static; max-height: none; }
          /* file view on mobile: hide the tree, show a back bar */
          .vault-shell[data-view="file"] .vault-tree { display: none; }
          .vault-shell[data-view="file"] .vault-back {
            display: inline-flex; align-items: center; gap: 8px;
            font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary);
            text-decoration: none; padding: 8px 14px; border: 1px solid var(--canvas-border);
            border-radius: var(--radius-pill); margin-bottom: 4px;
          }
          .vault-shell[data-view="file"] .vault-back:hover { color: var(--text-primary); border-color: var(--aura); }
        }
      `}</style>
      <aside className="vault-tree">
        <p className="vault-tree-kicker">~/vault</p>
        <FileTree
          elements={tree}
          activeId={activeId}
          defaultOpenIds={defaultOpen}
          highlightColor="var(--aura-strong)"
        />
      </aside>
      <div className="vault-main">
        <Link href="/vault" className="vault-back">← vault/</Link>
        {children}
      </div>
    </div>
  )
}
