'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PageHero } from '../../components/PageHero'
import { RepoCard } from './RepoCard'
import { repos } from '@shawnos/shared/data/repos'

type Tab = 'mine' | 'community' | 'recommended' | 'projects'

export function RepoHubContent() {
  const t = useTranslations('Repos')
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  const filtered = repos
    .filter((r) => r.category === activeTab)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))

  const featuredRepo = filtered.find((r) => r.featured)
  const rest = filtered.filter((r) => r !== featuredRepo)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'projects', label: t('tabs.projects') },
    { key: 'mine', label: t('tabs.mine') },
    { key: 'community', label: t('tabs.community') },
    { key: 'recommended', label: t('tabs.recommended') },
  ]

  return (
    <>
      <PageHero title={t('hero.title')} subtitle={t('hero.subtitle')} compact />

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--border)',
          marginBottom: 32,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 20px',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Repo grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {featuredRepo && <RepoCard repo={featuredRepo} featured />}
            {rest.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
          }}>
            {activeTab === 'community' && (
              <>
                <p style={{ margin: '0 0 8px' }}>no community repos yet.</p>
                <p style={{ margin: 0 }}>
                  share yours on{' '}
                  <a
                    href="https://reddit.com/r/GTMBuilders"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)' }}
                  >
                    r/GTMBuilders
                  </a>
                </p>
              </>
            )}
            {activeTab === 'recommended' && (
              <p style={{ margin: 0 }}>recommended repos coming soon.</p>
            )}
          </div>
        )}

        {/* CTA section */}
        <div style={{
          marginTop: 48,
          padding: '24px',
          border: '1px dashed var(--border)',
          borderRadius: 8,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
            building something? share it with the community.
          </p>
          <a
            href="https://reddit.com/r/GTMBuilders"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            post on r/GTMBuilders
          </a>
        </div>
      </section>
    </>
  )
}
