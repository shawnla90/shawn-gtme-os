import { getLogByDate, getLogDates, resolveDataRoot } from '@shawnos/shared/lib'
import { getRPGProfileV3 } from '@shawnos/shared/lib'
import { getRPGProfileV2 } from '@shawnos/shared/lib'
import path from 'path'
import { notFound } from 'next/navigation'
import LogDetail from '../../components/LogDetail'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export async function generateStaticParams() {
  const dates = getLogDates(LOG_DIR)
  return dates.map((date) => ({ date }))
}

export default async function LogDatePage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const log = getLogByDate(date, LOG_DIR)
  if (!log) notFound()

  const allDates = getLogDates(LOG_DIR) // newest-first
  const idx = allDates.indexOf(date)
  const nextDate = idx > 0 ? allDates[idx - 1] : null       // newer
  const prevDate = idx < allDates.length - 1 ? allDates[idx + 1] : null // older

  // Try V3 first, fall back to V2
  const profileV3 = getRPGProfileV3(DATA_ROOT)
  const profileV2 = getRPGProfileV2(DATA_ROOT)
  const profile = profileV3 ?? profileV2

  // Get grade for this date
  let grade: string | null = null
  if (profileV3?.v3_meta?.scoring_log) {
    grade = profileV3.v3_meta.scoring_log.find((e) => e.date === date)?.v3_grade ?? null
  } else if (profileV2?.v2_meta?.scoring_log) {
    grade = profileV2.v2_meta.scoring_log.find((e) => e.date === date)?.v2_grade ?? null
  }

  return (
    <LogDetail
      log={log}
      prevDate={prevDate}
      nextDate={nextDate}
      profile={profile}
      v2Grade={grade}
    />
  )
}
