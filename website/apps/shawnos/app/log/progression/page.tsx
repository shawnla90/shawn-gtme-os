import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import {
  getAllLogs,
  getLogByDate,
  resolveDataRoot,
  getRPGProfileV3,
  getRPGProfileV2,
  getRPGProfile,
  getAvatarUrlsForProfile,
  tierColor,
} from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import ProgressionClient from './ProgressionClient'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')
const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  title: 'Character Progression',
  description:
    'XP growth, grade trends, momentum chains, milestones, and token efficiency. Character progression from the daily build log.',
  alternates: { canonical: `${SITE_URL}/log/progression` },
  openGraph: {
    title: 'Character Progression | shawnos.ai',
    description: 'XP growth, grade trends, momentum chains, and milestones.',
    url: `${SITE_URL}/log/progression`,
    images: [
      {
        url: '/og?title=Character+Progression&subtitle=XP+growth%2C+grades%2C+chains%2C+milestones',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function ProgressionPage() {
  const profileV3 = getRPGProfileV3(DATA_ROOT)
  const profileV2 = getRPGProfileV2(DATA_ROOT)
  const profile = profileV3 ?? profileV2 ?? getRPGProfile(DATA_ROOT)

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
          &larr; back to logs
        </Link>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '24px' }}>
          Progression engine has not run yet. Check back after the daily cron.
        </p>
      </div>
    )
  }

  const isV3 = !!profileV3
  const meta = isV3 ? profileV3!.v3_meta : null
  const scoringLog = meta?.scoring_log ?? []
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
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '40px 20px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Nav */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Link
            href="/log"
            style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}
          >
            &larr; back to logs
          </Link>
          {isV3 && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'var(--canvas-subtle)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              Engine v3
            </span>
          )}
        </div>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            PROGRESSION
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            XP, grades &amp; leveling
          </p>
        </div>

        {meta ? (
          <ProgressionClient
            profile={profile}
            avatarSrc={avatarUrls.idle}
            tierColor={tc}
            scoringLog={scoringLog}
            meta={meta}
            costMap={costMap}
            logs={logs}
          />
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            V3 scoring data not available. Only V2/V1 profile loaded.
          </p>
        )}
      </div>
    </>
  )
}
