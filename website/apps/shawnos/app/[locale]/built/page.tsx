import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { getBuildStats } from './stats'
import journeyRaw from '../../data/build-journey.json'
import contributionsRaw from '@shawnos/shared/data/github-contributions.json'
import ContributionGraph from '../../../components/smoothui/contribution-graph'
import GitHubStarsAnimation from '../../../components/smoothui/github-stars-animation'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'
const GH_FLAGSHIP = { owner: 'shawnla90' }

type Props = { params: Promise<{ locale: string }> }

interface Commit { hash: string; date: string; type: string; scope: string; subject: string }
const journey = journeyRaw as Commit[]

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Built in Public — the git log, the stars, the honest part'
  const description =
    'I built this site, the agents, and the pipelines by hand, in public — with a commit trail to prove it. ~150 stars across 16 repos. And the one thing I won’t claim credit for.'
  return {
    title,
    description,
    keywords: ['build in public', 'GTM engineering', 'Claude Code', 'open source', 'git history', 'gtm coding agent'],
    alternates: { canonical: `${SITE_URL}/built`, languages: hreflang('/built') },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/built`,
      images: [{ url: `/og?title=${encodeURIComponent('Built in Public')}&subtitle=${encodeURIComponent('the git log, the stars, the honest part')}`, width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      images: [`/og?title=${encodeURIComponent('Built in Public')}&subtitle=${encodeURIComponent('the git log, the stars, the honest part')}`],
    },
  }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function monthLabel(ym: string): string {
  const [y, m] = ym.split('-')
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

export default async function BuiltPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const stats = await getBuildStats()
  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n)

  // group the commit trail by month, newest first
  const byMonth = new Map<string, Commit[]>()
  for (const c of journey) {
    const ym = c.date.slice(0, 7)
    if (!byMonth.has(ym)) byMonth.set(ym, [])
    byMonth.get(ym)!.push(c)
  }
  const months = [...byMonth.keys()].sort((a, b) => (a < b ? 1 : -1))

  const flagship = stats.topRepos[0]

  const contribYear = parseInt(contributionsRaw.pulledAt.slice(0, 4), 10)
  const contribDays = contributionsRaw.days.filter((d) => d.date.startsWith(String(contribYear)))
  const contribYearTotal = contribDays.reduce((a, d) => a + d.count, 0)

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Built in Public', url: `${SITE_URL}/built` }]} />
      <style>{`
        .built { max-width: 920px; margin: 0 auto; padding: 56px 24px 110px; font-family: var(--font-sans); }
        .built-kicker { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-muted); margin: 0 0 14px; }
        .built-h1 { font-size: clamp(38px, 6vw, 68px); font-weight: 700; line-height: 1.02; letter-spacing: -0.03em;
          color: var(--text-primary); margin: 0 0 20px; }
        .built-lead { font-size: 18px; color: var(--text-secondary); line-height: 1.6; max-width: 660px; margin: 0; }
        .built-lead strong { color: var(--text-primary); font-weight: 600; }

        .built-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 44px 0 8px; }
        @media (max-width: 620px) { .built-stats { grid-template-columns: repeat(2, 1fr); } }
        .built-stat { background: var(--canvas-subtle); border: 1px solid var(--canvas-border);
          border-radius: var(--radius-lg); padding: 20px 18px; }
        .built-stat-n { font-size: 30px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums; line-height: 1; }
        .built-stat-l { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--text-muted); margin-top: 8px; }
        .built-live { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px;
          color: var(--text-muted); margin-top: 10px; }
        .built-live i { width: 7px; height: 7px; border-radius: 50%; background: var(--text-secondary); display: inline-block; }

        .built-section { margin-top: 72px; }
        .built-h2 { font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin: 0 0 8px; }
        .built-sub { font-size: 15px; color: var(--text-secondary); line-height: 1.6; max-width: 640px; margin: 0 0 26px; }

        .repo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
        .repo-card { background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: var(--radius-lg);
          padding: 22px 20px; text-decoration: none; color: inherit; display: flex; flex-direction: column;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease; }
        .repo-card:hover { transform: translateY(-3px); border-color: var(--text-secondary); background: var(--canvas-card); }
        .repo-name { font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 8px; }
        .repo-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 16px; flex: 1; }
        .repo-meta { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); display: flex; gap: 16px; }
        .repo-meta b { color: var(--text-primary); font-weight: 600; }

        .trail { border-left: 1px solid var(--canvas-border); margin-left: 6px; padding-left: 0; }
        .trail-month { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-muted); margin: 28px 0 12px; padding-left: 24px; position: relative; }
        .trail-month::before { content: ''; position: absolute; left: -4px; top: 4px; width: 9px; height: 9px;
          border-radius: 50%; background: var(--text-secondary); }
        .trail-item { display: flex; gap: 14px; align-items: baseline; padding: 7px 0 7px 24px; }
        .trail-date { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); min-width: 42px; }
        .trail-type { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--text-muted); border: 1px solid var(--canvas-border); border-radius: var(--radius-pill);
          padding: 2px 8px; min-width: 48px; text-align: center; }
        .trail-subj { font-size: 14px; color: var(--text-primary); line-height: 1.45; }

        .built-callout { background: var(--canvas-subtle); border: 1px solid var(--canvas-border);
          border-radius: var(--radius-lg); padding: 32px 30px; margin-top: 72px; }
        .built-callout p { font-size: 16px; color: var(--text-secondary); line-height: 1.65; margin: 0; max-width: 660px; }
        .built-callout strong { color: var(--text-primary); font-weight: 600; }

        .built-cta { margin-top: 64px; text-align: center; }
        .built-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
        .built-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;
          text-decoration: none; padding: 11px 22px; border-radius: var(--radius-pill); transition: opacity 0.15s ease; }
        .built-btn:hover { opacity: 0.82; }
        .built-btn--primary { background: var(--text-primary); color: var(--text-on-accent); }
        .built-btn--ghost { border: 1px solid var(--canvas-border); color: var(--text-primary); }
      `}</style>

      <div className="built">
        {/* hero */}
        <header>
          <p className="built-kicker">// built in public</p>
          <h1 className="built-h1">I built this in the open.</h1>
          <p className="built-lead">
            Plumber for ten years. Then 200 cold emails a day as an SDR. Then I stopped working inside the systems and
            started building them. <strong>I&apos;m not a software engineer</strong> — and these repos have{' '}
            <strong>{fmt(stats.totalStars)} stars</strong>. Every line of this site, every agent, every pipeline:
            built by hand, in public, with a git log to prove it.
          </p>
        </header>

        {/* live stats */}
        <div className="built-stats">
          <div className="built-stat">
            <div className="built-stat-n">{fmt(stats.totalStars)}</div>
            <div className="built-stat-l">stars · {stats.repoCount} repos</div>
          </div>
          <div className="built-stat">
            <div className="built-stat-n">{fmt(stats.commitCount)}</div>
            <div className="built-stat-l">commits</div>
          </div>
          <div className="built-stat">
            <div className="built-stat-n">{fmt(stats.daysBuilding)}</div>
            <div className="built-stat-l">days building</div>
          </div>
          <div className="built-stat">
            <div className="built-stat-n">{flagship ? `${flagship.forks}+` : '16'}</div>
            <div className="built-stat-l">{flagship ? 'forks on the flagship' : 'public repos'}</div>
          </div>
        </div>
        <p className="built-live"><i />{stats.live ? 'live from the GitHub API' : 'last verified count'} · refreshed hourly</p>

        {/* contribution heatmap */}
        <section className="built-section">
          <p className="built-kicker">the heatmap</p>
          <h2 className="built-h2">{fmt(contributionsRaw.total)} contributions in the last year.</h2>
          <p className="built-sub">
            My real GitHub contribution calendar, {contribYear} so far ({fmt(contribYearTotal)} and counting) —
            pulled straight from my account, rendered on my own grid. This is what building in public looks like day by day.
          </p>
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <ContributionGraph data={contribDays} year={contribYear} showLegend showTooltips />
          </div>
        </section>

        {/* repos */}
        <section className="built-section">
          <p className="built-kicker">the open source</p>
          <h2 className="built-h2">Receipts, not resume.</h2>
          <p className="built-sub">
            The work is public. Stars and forks are pulled straight from GitHub — click through and read the code.
          </p>
          {flagship && (
            <div style={{ marginBottom: 18 }}>
              <GitHubStarsAnimation owner={GH_FLAGSHIP.owner} repo={flagship.name} starCount={flagship.stars} showAvatars={false} />
            </div>
          )}
          <div className="repo-grid">
            {stats.topRepos.map((r) => (
              <a key={r.full} className="repo-card" href={r.url} target="_blank" rel="noopener noreferrer">
                <p className="repo-name">{r.name}</p>
                <p className="repo-desc">{r.desc || 'Open source.'}</p>
                <div className="repo-meta">
                  <span>★ <b>{fmt(r.stars)}</b></span>
                  <span>⑂ <b>{fmt(r.forks)}</b></span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* commit trail */}
        <section className="built-section">
          <p className="built-kicker">the build log</p>
          <h2 className="built-h2">This site has a git log. Here&apos;s the real one.</h2>
          <p className="built-sub">
            No roadmap deck — just commits. Some of these pipelines don&apos;t even run anymore; that&apos;s the point.
            The log is the lesson. If you want to learn GTM or Claude Code the way I did it, start here and read backwards.
          </p>
          <div className="trail">
            {months.map((ym) => (
              <div key={ym}>
                <p className="trail-month">{monthLabel(ym)}</p>
                {byMonth.get(ym)!.map((c) => (
                  <div key={c.hash} className="trail-item">
                    <span className="trail-date">{c.date.slice(5)}</span>
                    <span className="trail-type">{c.type}</span>
                    <span className="trail-subj">{c.subject}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* honest boundary */}
        <section className="built-callout">
          <p className="built-kicker">the honest part</p>
          <h2 className="built-h2">One thing I won&apos;t claim.</h2>
          <p>
            I did <strong>not</strong> vibe-code the Clearbox engine. Clearbox is real software — a team builds and ships
            it, and I&apos;m not going to take credit for the engine. What I built is everything around it: this site,
            the agents, the content systems, the go-to-market that puts it in front of people. I&apos;d rather be precise
            about what&apos;s mine than impressive about what isn&apos;t.
          </p>
        </section>

        {/* learn it my way */}
        <section className="built-cta">
          <h2 className="built-h2">Want to build like this?</h2>
          <p className="built-sub" style={{ margin: '8px auto 0', textAlign: 'center' }}>
            The method is open. {flagship ? `${flagship.name} has ${fmt(flagship.stars)} stars and ${fmt(flagship.forks)} forks` : 'The flagship repo'} for a
            reason — it&apos;s the whole playbook for pointing a coding agent at go-to-market.
          </p>
          <div className="built-cta-row">
            <a className="built-btn built-btn--primary" href={flagship?.url ?? 'https://github.com/shawnla90/gtm-coding-agent'} target="_blank" rel="noopener noreferrer">
              ★ {flagship?.name ?? 'gtm-coding-agent'} on GitHub
            </a>
            <a className="built-btn built-btn--ghost" href="/knowledge">Open the knowledge hub →</a>
            <a className="built-btn built-btn--ghost" href="https://discord.gg/6eKe49nth" target="_blank" rel="noopener noreferrer">Build alongside us →</a>
          </div>
        </section>
      </div>
    </>
  )
}
