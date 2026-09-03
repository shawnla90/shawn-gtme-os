import { fmtPct, fmtTok, type Ledger } from './tokensData'

/**
 * One 100% bar: input / output / cache write / cache read. Pure CSS so it
 * renders with JS off. Tiny segments keep a 4px floor so they stay visible;
 * the legend carries the exact share.
 */
export function CompositionBar({ ledger }: { ledger: Ledger }) {
  const c = ledger.composition
  const total = c.input + c.output + c.cache_write + c.cache_read
  // blended $/Mtok across families, weighted by tokens in each bucket, from the by_model table
  const blended = (key: 'in' | 'out' | 'cache_write' | 'cache_read') => {
    const rows = ledger.by_model.filter((m) => m.family !== 'gpt-5.x')
    const w = rows.reduce((s, m) => s + m.tokens, 0)
    return w ? rows.reduce((s, m) => s + m.price[key] * m.tokens, 0) / w : 0
  }
  const segs = [
    { key: 'cache_read', label: 'cache reads', n: c.cache_read, price: blended('cache_read'), tone: 'var(--aura)', hint: 'the conversation re-read from cache on every turn' },
    { key: 'cache_write', label: 'cache writes', n: c.cache_write, price: blended('cache_write'), tone: 'color-mix(in srgb, var(--aura) 55%, var(--text-primary))', hint: 'new context written into the cache' },
    { key: 'input', label: 'fresh input', n: c.input, price: blended('in'), tone: 'color-mix(in srgb, var(--text-primary) 55%, transparent)', hint: 'uncached prompt tokens' },
    { key: 'output', label: 'output', n: c.output, price: blended('out'), tone: 'color-mix(in srgb, var(--text-primary) 90%, transparent)', hint: 'what the model actually wrote' },
  ]
  return (
    <div className="tk-comp">
      <div className="tk-comp-bar" role="img" aria-label="Token composition">
        {segs.map((s) => (
          <span
            key={s.key}
            className="tk-comp-seg"
            style={{ flexGrow: s.n / total, background: s.tone }}
            title={`${s.label}: ${fmtPct(s.n / total, 2)}`}
          />
        ))}
      </div>
      <ul className="tk-comp-legend">
        {segs.map((s) => (
          <li key={s.key}>
            <span className="tk-swatch" style={{ background: s.tone }} />
            <div>
              <p className="tk-comp-label">
                {s.label} <strong>{fmtPct(s.n / total, s.n / total < 0.01 ? 2 : 1)}</strong>
              </p>
              <p className="tk-comp-meta">
                {fmtTok(s.n)} tokens · ${s.price.toFixed(2)} per million · {s.hint}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
