import { fmtInt, type Ledger } from './tokensData'

/**
 * The 5-hour window, per plan: how many million tokens fit in one window at
 * my cache profile, and how often the poller caught the window pinned at 100%.
 * Pure CSS bars; the numbers are the point.
 */
export function WindowGauge({ ledger }: { ledger: Ledger }) {
  const rows = ledger.limits.windows.filter((w) => w.mtok_per_window != null)
  const max = Math.max(...rows.map((w) => w.mtok_per_window ?? 0), 1)
  return (
    <div className="tk-gauge">
      {rows.map((w) => (
        <div key={w.plan} className="tk-gauge-row">
          <div className="tk-gauge-head">
            <span className="tk-gauge-plan">
              {w.plan} <em>{w.label}</em>
            </span>
            <span className="tk-gauge-val">
              {w.mtok_per_window} <small>Mtok per window</small>
            </span>
          </div>
          <div className="tk-gauge-track">
            <div className="tk-gauge-fill" style={{ width: `${((w.mtok_per_window ?? 0) / max) * 100}%` }} />
          </div>
          <p className="tk-gauge-meta">
            {w.pct_per_mtok}% of the window per million tokens · peak {w.peak}% · pinned at 100% in {fmtInt(w.capped_polls)} of{' '}
            {fmtInt(w.polls)} polls · measured on {w.sample_mtok} Mtok
          </p>
        </div>
      ))}
    </div>
  )
}
