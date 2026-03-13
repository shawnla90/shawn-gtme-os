import type { Metadata } from 'next'
import { hreflang } from '../../../../i18n/hreflang'
import path from 'path'
import { Link } from '../../../../i18n/navigation'
import { getTranslations } from 'next-intl/server'
import {
  getAllLogs,
  getLogByDate,
  resolveDataRoot,
  getRPGProfile,
  getAvatarUrlsForProfile,
  tierColor,
} from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import ProgressionClient from './ProgressionClient'
import { PageHero, ScrollRevealSection } from '../LogReveal'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')
const SITE_URL = 'https://shawnos.ai'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Log.progression')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: { canonical: `${SITE_URL}/log/progression`, languages: hreflang('/log/progression') },
    openGraph: {
      title: `${t('metadata.title')} | shawnos.ai`,
      description: t('metadata.description'),
      url: `${SITE_URL}/log/progression`,
      images: [
        {
          url: '/og?title=Character+Progression&subtitle=XP+growth%2C+grades%2C+streaks%2C+milestones',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function ProgressionPage() {
  const t = await getTranslations('Log.progression')
  const profile = getRPGProfile(DATA_ROOT)

  if (!profile) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '40px 20px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <Link
          href="/log"
          style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}
        >
          &larr; {t('backToLogs')}
        </Link>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '24px' }}>
          Progression engine has not run yet. Check back after the daily cron.
        </p>
      </div>
    )
  }

  const avatarUrls = getAvatarUrlsForProfile(profile)
  const tc = tierColor(profile.avatar_tier)

  // Build cost map from daily logs
  const logs = getAllLogs(LOG_DIR)
  const costMap: Record<string, number> = {}
  for (const summary of logs) {
    const log = getLogByDate(summary.date, LOG_DIR)
    if (log) {
      costMap[summary.date] = log.token_usage.reduce((s, t) => s + (t.cost ?? 0), 0)
    }
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Log', url: `${SITE_URL}/log` },
          { name: 'Progression', url: `${SITE_URL}/log/progression` },
        ]}
      />
      <PageHero
        compact
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
      />
      <ScrollRevealSection background="var(--canvas)">
        <Link
          href="/log"
          style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}
        >
          &larr; {t('backToLogs')}
        </Link>

        <ProgressionClient
          profile={profile}
          avatarSrc={avatarUrls.idle}
          tierColor={tc}
          costMap={costMap}
        />
      </ScrollRevealSection>
    </>
  )
}
