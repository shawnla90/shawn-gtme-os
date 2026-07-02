import type { ReactNode } from 'react'
import { buildVaultTree } from '../../../lib/vault'
import VaultShell from './VaultShell'

// Server layout: reads the tree once; the client shell keeps expand/collapse
// state alive across file navigations (each file is still a real URL).
export default function VaultLayout({ children }: { children: ReactNode }) {
  const tree = buildVaultTree()
  return <VaultShell tree={tree}>{children}</VaultShell>
}
