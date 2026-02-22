import { getLogByDate, getLogDates, resolveDataRoot, getRPGProfile } from '@shawnos/shared/lib'
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

  const profile = getRPGProfile(DATA_ROOT)

  return (
    <LogDetail
      log={log}
      prevDate={prevDate}
      nextDate={nextDate}
      profile={profile}
      v2Grade={null}
    />
  )
}
