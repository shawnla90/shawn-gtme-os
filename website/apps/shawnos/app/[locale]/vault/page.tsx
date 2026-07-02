import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { getVaultCategories, getVaultTotalCount } from '../../../lib/vault'
import Breadcrumbs from '../../../components/Breadcrumbs'
import MagneticButton from '../../../components/smoothui/magnetic-button'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const title = 'The Vault — my real GTM-agent files, take them and build'
  const description =
    'The actual skill files I run Claude Code with: voice DNA, anti-slop detection, LinkedIn and Reddit playbooks, context handoffs. Browse the file tree, read everything, download the folders.'
  return {
    title,
    description,
    keywords: ['GTM coding agent', 'Claude Code skills', 'voice DNA', 'anti-slop', 'reddit playbook', 'context engineering'],
    alternates: { canonical: `${SITE_URL}/vault`, languages: hreflang('/vault') },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/vault`,
      images: [{ url: `/og?title=${encodeURIComponent('The Vault')}&subtitle=${encodeURIComponent('my real GTM-agent files')}`, width: 1200, height: 630 }],
    },
    twitter: { title, description },
  }
}

export default async function VaultPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const categories = getVaultCategories()
  const total = getVaultTotalCount()

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'The Vault', url: `${SITE_URL}/vault` }]} />
      <style>{`
        .vault-index-kicker { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 14px; }
        .vault-h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; color: var(--text-primary); margin: 0 0 16px; }
        .vault-lead { font-size: 17px; color: var(--text-secondary); line-height: 1.65; max-width: 620px; margin: 0 0 28px; }
        .vault-lead strong { color: var(--text-primary); font-weight: 600; }
        .vault-cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin-top: 36px; }
        .vault-cat { background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: var(--radius-lg); padding: 20px 18px; }
        .vault-cat-name { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--aura-strong); margin: 0 0 8px; }
        .vault-cat-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.55; margin: 0 0 14px; }
        .vault-cat-meta { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .vault-cat-zip { color: var(--text-secondary); text-decoration: none; border: 1px solid var(--canvas-border); border-radius: var(--radius-pill); padding: 4px 12px; transition: color 0.15s, border-color 0.15s; }
        .vault-cat-zip:hover { color: var(--text-primary); border-color: var(--aura); }
        .vault-all { margin-top: 32px; }
      `}</style>

      <Breadcrumbs items={[{ label: 'vault' }]} />
      <p className="vault-index-kicker">// the vault · {total} files</p>
      <h1 className="vault-h1">My real files. Take them and build.</h1>
      <p className="vault-lead">
        This is not a course. These are the <strong>actual markdown files</strong> my GTM coding agent runs on —
        the voice DNA, the anti-slop detector, the LinkedIn and Reddit playbooks, the context-handoff protocol.
        Browse the tree like a repo, read everything in place, and download any folder as a zip.
        Point Claude Code at them and you have my system.
      </p>
      <MagneticButton asChild>
        <a href="/downloads/vault/vault-all.zip" download>download the whole vault ↓</a>
      </MagneticButton>

      <div className="vault-cat-grid">
        {categories.map((c) => (
          <div key={c.slug} className="vault-cat">
            <p className="vault-cat-name">{c.label}/</p>
            <p className="vault-cat-desc">{c.description}</p>
            <div className="vault-cat-meta">
              <span>{c.count} files</span>
              <a className="vault-cat-zip" href={`/downloads/vault/${c.slug}.zip`} download>
                zip ↓
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
