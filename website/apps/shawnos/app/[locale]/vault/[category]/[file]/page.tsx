import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { markdownToHtml } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../../i18n/hreflang'
import { getAllVaultParams, getVaultFile, VAULT_CATEGORIES } from '../../../../../lib/vault'
import Breadcrumbs from '../../../../../components/Breadcrumbs'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'

type Props = { params: Promise<{ locale: string; category: string; file: string }> }

export function generateStaticParams() {
  return getAllVaultParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, file } = await params
  const vf = getVaultFile(category, file)
  if (!vf) return { title: 'Not found' }
  const url = `${SITE_URL}/vault/${category}/${file}`
  const title = `${vf.title} — the Vault`
  return {
    title,
    description: vf.description,
    alternates: { canonical: url, languages: hreflang(`/vault/${category}/${file}`) },
    openGraph: {
      type: 'article',
      title,
      description: vf.description,
      url,
      images: [{ url: `/og?title=${encodeURIComponent(vf.title)}&subtitle=${encodeURIComponent(`vault/${category}`)}`, width: 1200, height: 630 }],
    },
    twitter: { title, description: vf.description },
  }
}

export default async function VaultFilePage({ params }: Props) {
  const { locale, category, file } = await params
  setRequestLocale(locale)

  const vf = getVaultFile(category, file)
  if (!vf) notFound()

  const html = await markdownToHtml(vf.content)
  const catLabel = VAULT_CATEGORIES[category]?.label ?? category

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: vf.title,
    description: vf.description,
    dateModified: vf.updated,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    url: `${SITE_URL}/vault/${category}/${file}`,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'The Vault', url: `${SITE_URL}/vault` },
          { name: catLabel, url: `${SITE_URL}/vault` },
          { name: vf.title, url: `${SITE_URL}/vault/${category}/${file}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <style>{`
        .vf-head { border-bottom: 1px solid var(--canvas-border); padding-bottom: 22px; margin-bottom: 26px; }
        .vf-path { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); margin: 0 0 10px; }
        .vf-path b { color: var(--aura-strong); font-weight: 600; }
        .vf-title { font-size: clamp(26px, 4vw, 38px); font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 10px; line-height: 1.1; }
        .vf-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 16px; max-width: 620px; }
        .vf-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .vf-meta a { color: var(--text-secondary); text-decoration: none; border: 1px solid var(--canvas-border); border-radius: var(--radius-pill); padding: 5px 14px; transition: color 0.15s, border-color 0.15s; }
        .vf-meta a:hover { color: var(--text-primary); border-color: var(--aura); }
        .vf-source { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
      `}</style>

      <Breadcrumbs
        items={[
          { label: 'vault', href: '/vault' },
          { label: catLabel },
          { label: `${vf.slug}.md` },
        ]}
      />
      <header className="vf-head">
        <p className="vf-path">
          ~/vault/<b>{category}</b>/{vf.slug}.md
        </p>
        <h1 className="vf-title">{vf.title}</h1>
        {vf.description && <p className="vf-desc">{vf.description}</p>}
        <div className="vf-meta">
          <a href={`/downloads/vault/${category}/${vf.slug}.md`} download>
            raw .md ↓
          </a>
          <a href={`/downloads/vault/${category}.zip`} download>
            {category}.zip ↓
          </a>
          {vf.updated && <span>updated {vf.updated}</span>}
          <span>{vf.wordCount.toLocaleString('en-US')} words</span>
          {vf.source && <span className="vf-source">source: {vf.source}</span>}
        </div>
      </header>
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}
