import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { ChartFrame } from './ChartFrame'
import { CompositionBar } from './CompositionBar'
import { DailyChart } from './DailyChart'
import { WindowGauge } from './WindowGauge'
import {
  fmtDate,
  fmtInt,
  fmtMonth,
  fmtPct,
  fmtTok,
  fmtUsd,
  ledger,
  modelDisplay,
  peakDay,
} from './tokensData'
import './tokens.css'

const SITE_URL = 'https://shawnos.ai'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const tok = fmtTok(ledger.totals.tokens)
  const title = `${tok} Claude tokens since February. The ledger.`
  const description = `Every token I have run through Claude Code since ${fmtDate(ledger.range.start)}, read from my own logs: ${fmtInt(
    ledger.totals.tokens,
  )} tokens, ${fmtUsd(ledger.totals.api_equiv_usd)} at API list price, ${fmtPct(
    ledger.totals.cache_read_share,
    0,
  )} of it cache reads. What a token costs, why the session limit is the real bill, and how to keep the meter down.`
  const og = `/og?title=${encodeURIComponent(`${tok} tokens since February`)}&subtitle=${encodeURIComponent(
    `${fmtUsd(ledger.totals.api_equiv_usd)} at list. ${fmtUsd(ledger.spend.seats_usd)} in seats. Not a flex, a ledger.`,
  )}`
  return {
    title,
    description,
    keywords: [
      'Claude Code token usage',
      'Claude Max vs Team',
      'Claude API pricing explained',
      'prompt caching cost',
      'Claude Code usage limits',
      'tokens per 5 hour window',
      'Claude Code cost tracking',
    ],
    alternates: { canonical: `${SITE_URL}/tokens`, languages: hreflang('/tokens') },
    openGraph: { title, description, url: `${SITE_URL}/tokens`, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { title, description, images: [og] },
  }
}

const SECTIONS = [
  { id: 'cost', label: 'what a token costs' },
  { id: 'paid', label: 'list price vs paid' },
  { id: 'daily', label: 'every day' },
  { id: 'limit', label: 'the limit' },
  { id: 'models', label: 'by model' },
  { id: 'rules', label: 'keeping the meter down' },
  { id: 'method', label: 'method and gaps' },
]
const no = (id: string) => String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0')

export default async function TokensPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const L = ledger
  const asOf = fmtDate(L.range.end)
  const peak = peakDay(L.daily)
  const team = L.limits.windows.find((w) => w.plan === 'Team')
  const max5 = L.limits.windows.find((w) => w.plan === 'Max 5x')
  const knownSeats = L.plans.filter((p) => p.seat_usd != null)
  const leverage = L.spend.leverage_x
  const cacheReadPrice = L.pricing.find((p) => p.family === 'opus')
  const gapDays = L.daily.filter((d) => d.gap).length
  const claudeModels = L.by_model.filter((m) => m.family !== 'gpt-5.x')
  const claudeTotal = claudeModels.reduce((s, m) => s + m.tokens, 0)

  return (
    <main className="tk-shell">
      <BreadcrumbSchema items={[{ name: 'The token ledger', url: `${SITE_URL}/tokens` }]} />

      {/* ── hero ─────────────────────────────────────── */}
      <header className="tk-hero">
        <p className="tk-kicker">
          Claude Code · {fmtDate(L.range.start)} to {asOf} · updated daily from my own logs
        </p>
        <h1 className="tk-hero-num">
          <em>{fmtInt(L.totals.tokens)}</em>
        </h1>
        <p className="tk-hero-sub">tokens through Claude Code since February.</p>
        <p className="tk-lede">
          Not a flex. A ledger. A token is about four characters, and every message you send re-reads the whole
          conversation, so the number gets big fast. What matters is not the size. It is that{' '}
          <strong>{fmtPct(L.totals.cache_read_share, 0)} of it was cache reads</strong> at a tenth of the input price,
          that the model only wrote <strong>{fmtPct(L.totals.output_share, 1)}</strong> of it, and that the bill that
          actually hurts is the session limit, not the invoice.
        </p>
        <ul className="tk-hero-strip">
          <li>
            <b>{fmtUsd(L.totals.api_equiv_usd)}</b>
            <span>at API list price</span>
          </li>
          <li>
            <b>{fmtUsd(L.spend.seats_usd)}</b>
            <span>paid for Max seats</span>
          </li>
          <li>
            <b>{fmtInt(L.totals.prompts)}</b>
            <span>prompts typed</span>
          </li>
          <li>
            <b>{peak ? fmtTok(peak.tokens) : ''}</b>
            <span>biggest day{peak ? `, ${fmtDate(peak.d)}` : ''}</span>
          </li>
          <li>
            <b>{fmtInt(L.totals.days)}</b>
            <span>days on record</span>
          </li>
        </ul>
      </header>

      {/* ── 01 what a token costs ────────────────────── */}
      <section id="cost" className="tk-section">
        <p className="tk-no">{no('cost')}</p>
        <h2 className="tk-h2">A token has four prices, and you mostly pay the cheapest one.</h2>
        <p className="tk-p">
          The API bills four kinds of token. Fresh input you send. Output the model writes. Cache writes, when new
          context gets stored. And cache reads, when the model re-reads what it already stored. On Opus those run{' '}
          <span className="tk-num">
            ${cacheReadPrice?.in} / ${cacheReadPrice?.out} / ${cacheReadPrice?.cache_write} / ${cacheReadPrice?.cache_read}
          </span>{' '}
          per million. Output is fifty times the price of a cache read.
        </p>
        <p className="tk-p">
          Here is my whole ledger split that way. The purple is the conversation being re-read on every turn. The
          sliver at the end is everything the model ever wrote back.
        </p>
        <CompositionBar ledger={L} />
        <p className="tk-p muted">
          This is why a 400M-token day is not a $4,000 day. It is also why the one thing that wrecks a session is
          anything that breaks the cache, because the same tokens suddenly cost ten times more and eat the limit ten
          times faster.
        </p>
      </section>

      {/* ── 02 list price vs paid ────────────────────── */}
      <section id="paid" className="tk-section">
        <p className="tk-no">{no('paid')}</p>
        <h2 className="tk-h2">List price says {fmtUsd(L.totals.api_equiv_usd)}. The seats cost {fmtUsd(L.spend.seats_usd)}.</h2>
        <p className="tk-p">
          Three plans so far. Max 20x from February, down to Max 5x in June, then a Team seat at work from August.
          Each card shows what the same tokens would have cost on the API against what the seat actually cost.
        </p>
        <ul className="tk-plans">
          {L.plans.map((p) => (
            <li key={p.plan} className="tk-plan">
              <div className="tk-plan-head">
                <h3 className="tk-plan-name">
                  {p.plan}
                  <em>{p.label}</em>
                </h3>
                {p.price_usd_month != null && <span className="tk-num">${p.price_usd_month}/mo</span>}
              </div>
              <p className="tk-plan-dates">
                {fmtDate(p.start)} to {fmtDate(p.end)} · {p.days} days
              </p>
              <p className="tk-plan-big">
                {fmtTok(p.tokens)}
                <small>tokens</small>
                {p.tokens_basis === 'estimate' && <span className="tk-badge">est. split</span>}
              </p>
              <ul className="tk-plan-rows">
                <li>
                  <span>API list price</span>
                  <span className="tk-num">{fmtUsd(p.api_equiv_usd)}</span>
                </li>
                <li>
                  <span>Seat paid</span>
                  <span className="tk-num">{p.seat_usd != null ? fmtUsd(p.seat_usd) : 'work seat, price not mine'}</span>
                </li>
                <li>
                  <span>Multiple</span>
                  <span className="tk-num tk-plan-mult">
                    {p.seat_usd ? `${(p.api_equiv_usd / p.seat_usd).toFixed(1)}x` : p.billing === 'mixed' ? 'API + seat, mixed' : ''}
                  </span>
                </li>
                <li>
                  <span>Prompts</span>
                  <span className="tk-num">{fmtInt(p.prompts)}</span>
                </li>
              </ul>
            </li>
          ))}
        </ul>
        <div className="tk-spend">
          <span>
            Max seats <b>{fmtUsd(L.spend.seats_usd)}</b>
          </span>
          <span>
            API keys, my estimate <b>{fmtUsd(L.spend.api_estimate_usd)}</b>
          </span>
          <span>
            List price <b>{fmtUsd(L.totals.api_equiv_usd)}</b>
          </span>
          {leverage != null && (
            <span>
              Multiple <b className="tk-plan-mult">{leverage}x</b>
            </span>
          )}
        </div>
        <p className="tk-p muted">
          The pre-July split between 20x and 5x is an estimate. Claude Code's own stats cache keeps exact lifetime
          totals per model through June 30 but only input and output per day, so the cache-inclusive lump is
          allocated by each plan's share of the daily numbers. The Team seat is paid by my employer and the early
          Team weeks ran on an API key, so that card carries no multiple. {knownSeats.length} of {L.plans.length}{' '}
          seat prices are mine to publish.
        </p>
      </section>

      {/* ── 03 daily ─────────────────────────────────── */}
      <section id="daily" className="tk-section">
        <p className="tk-no">{no('daily')}</p>
        <h2 className="tk-h2">Every day since {fmtDate(L.range.start)}.</h2>
        <p className="tk-p">
          The ramp is the story. Spring was a few million tokens a day on Opus 4.6 and 4.7. Summer, once agents
          started running agents, is hundreds of millions. The plan bands are shaded. The grey block in July is the
          fortnight where no log survived.
        </p>
        <ChartFrame
          title="Tokens per day, Claude Code and Codex"
          asOf={asOf}
          caption={
            <>
              Before Jul 16 only input and output exist per day (the dashed line), because Claude Code deletes session
              logs after about a month and its stats cache stops at June 30. Cache reads for those days are only known
              as a lifetime lump. {gapDays} days in July carry prompt counts and nothing else. Codex logs also begin Jul
              16, so the Codex view is not a spring-to-summer comparison.
            </>
          }
        >
          <DailyChart daily={L.daily} plans={L.plans} gap={L.gap} />
        </ChartFrame>
        <ul className="tk-months">
          {L.monthly.map((m) => (
            <li key={m.m}>
              {fmtMonth(m.m)}
              <b>{m.tokens != null ? fmtTok(m.tokens) : fmtTok(m.non_cache)}</b>
              <small>{m.tokens != null ? fmtUsd(m.api_usd) : 'in+out only'}</small>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 04 the limit ─────────────────────────────── */}
      <section id="limit" className="tk-section">
        <p className="tk-no">{no('limit')}</p>
        <h2 className="tk-h2">The limit is the real bill.</h2>
        <p className="tk-p">
          A seat does not charge per token. It gives you a 5-hour window and a 7-day window and meters both. So the
          question that matters on a seat is not what a million tokens costs, it is how many million fit in a window
          before the window closes on you. I poll both accounts every ten minutes and divide the movement in the
          window by the tokens burned between polls.
        </p>
        <WindowGauge ledger={L} />
        <p className="tk-p">
          {team && max5 ? (
            <>
              At my cache profile a Team seat holds about <b className="tk-num">{team.mtok_per_window} Mtok</b> per 5-hour
              window and Max 5x about <b className="tk-num">{max5.mtok_per_window} Mtok</b>. On a heavy day I burn 13 Mtok an
              hour, which is {((max5.mtok_per_window ?? 0) / 13).toFixed(1)} hours of runway on 5x and{' '}
              {((team.mtok_per_window ?? 0) / 13).toFixed(1)} on Team. The poller caught the Team window pinned at 100% in{' '}
              <b className="tk-num">{team.capped_polls} of {team.polls}</b> polls. Every one of those is ten minutes of work that
              did not happen.
            </>
          ) : (
            <>Window data begins {L.limits.since}; the gauge fills in as polls accumulate.</>
          )}
        </p>
        <p className="tk-p muted">
          Polling started {L.limits.since ? fmtDate(L.limits.since) : ''}. {L.limits.note}. Anthropic does not publish the
          window sizes; these are measured, not quoted.
        </p>
      </section>

      {/* ── 05 by model ──────────────────────────────── */}
      <section id="models" className="tk-section">
        <p className="tk-no">{no('models')}</p>
        <h2 className="tk-h2">By model, and the Codex column.</h2>
        <div className="tk-table-wrap">
          <table className="tk-table">
            <thead>
              <tr>
                <th>model</th>
                <th>share</th>
                <th className="tk-num">tokens</th>
                <th className="tk-num">at list</th>
                <th className="tk-num">in / out / cw / cr per Mtok</th>
              </tr>
            </thead>
            <tbody>
              {claudeModels.map((m) => (
                <tr key={m.model}>
                  <td>{modelDisplay(m.model)}</td>
                  <td>
                    <span className="tk-share" style={{ width: `${Math.max(2, (m.tokens / claudeTotal) * 120)}px` }} />
                    <span className="tk-num">{fmtPct(m.tokens / claudeTotal, 1)}</span>
                  </td>
                  <td className="tk-num">{fmtInt(m.tokens)}</td>
                  <td className="tk-num">{fmtUsd(m.api_equiv_usd)}</td>
                  <td className="tk-num">
                    {m.price.in} / {m.price.out} / {m.price.cache_write} / {m.price.cache_read}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tk-codex">
          <h3>Codex, side by side</h3>
          <div>
            <b>{fmtTok(L.codex.tokens)}</b>
            <span>tokens since {L.codex.since ? fmtDate(L.codex.since) : ''}</span>
          </div>
          <div>
            <b>{fmtInt(L.codex.turns)}</b>
            <span>turns</span>
          </div>
          <div>
            <b>{fmtUsd(L.codex.api_equiv_usd)}</b>
            <span>at a proxy list price</span>
          </div>
          <p>{L.codex.pricing_note}. Same machine, same weeks, same kind of work; the Claude column is the one I read every day.</p>
        </div>
      </section>

      {/* ── 06 rules ─────────────────────────────────── */}
      <section id="rules" className="tk-section">
        <p className="tk-no">{no('rules')}</p>
        <h2 className="tk-h2">How I keep the meter down.</h2>
        <p className="tk-p">
          The biggest problem with these tools is not a bad answer. It is the session closing on you at 2pm, or paying
          API money for work a seat already covers. Everything below follows from the numbers above.
        </p>
        <ol className="tk-rules">
          <li>
            <b>Keep the cache warm.</b> {fmtPct(L.totals.cache_read_share, 0)} of my tokens are cache reads at a tenth
            of the price. Editing early context, swapping system prompts mid-session, or letting a tool dump a huge
            file into the top of the conversation invalidates the cache and reprices the whole session upward.
          </li>
          <li>
            <b>Compact before the window does.</b> Every turn re-reads the conversation. A long session at 150K
            context costs 150K per turn even when the turn is one line. Compact when the work changes shape, not when
            the limit warning shows.
          </li>
          <li>
            <b>Hand long reads to subagents.</b> A subagent reads the ten files and returns a paragraph. The main
            conversation pays for the paragraph on every later turn instead of the ten files.
          </li>
          <li>
            <b>Pick the plan from window math, not the price tag.</b>{' '}
            {team && max5
              ? `Team holds ${team.mtok_per_window} Mtok a window against ${max5.mtok_per_window} on Max 5x at my profile. `
              : ''}
            Measure your own burn per hour, divide, and you know how many hours a window buys you before you sign up.
          </li>
          <li>
            <b>Pay API rates only for work that cannot sit in a seat.</b> Cron jobs, pipelines, anything that runs
            while you sleep. Interactive coding on an API key is the priciest way there is to buy tokens.
          </li>
        </ol>
      </section>

      {/* ── 07 method ────────────────────────────────── */}
      <section id="method" className="tk-section">
        <p className="tk-no">{no('method')}</p>
        <h2 className="tk-h2">Method and gaps.</h2>
        <p className="tk-p">
          Every number on this page is read from files on my Mac, not from Anthropic. A small Python poller logs the
          OAuth limit windows every ten minutes and ingests the per-turn usage that Claude Code and Codex write to
          disk. A daily job aggregates it into a JSON feed and this page is built from that feed. No session
          transcripts, project names, or account identifiers leave the machine.
        </p>
        <ul className="tk-sources">
          {L.sources.map((s) => (
            <li key={s.name}>
              <b>{s.name}</b>
              <span>{s.note}</span>
            </li>
          ))}
        </ul>
        <p className="tk-foot">
          generated {L.generated_at.replace('T', ' ').slice(0, 16)} · feed rebuilt daily · this page replaces a token tracker I ran in
          February and let die
        </p>
      </section>
    </main>
  )
}
