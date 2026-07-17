import React from 'react'
import redditStats from '@shawnos/shared/data/reddit-stats.json'
import { fmtViews } from './reportData'
import { RampChart } from './RampChart'


/**
 * The right rail's exhibits, one per section.
 *
 * Same rule as the page: if the db knows a number, it is read from here, not
 * typed. Everything below indexes into reddit-stats.json. A rail that would
 * need a number the exporter does not emit yet does not get written with a
 * remembered one - the section falls through to the "where you are" panel
 * until the exporter can produce it.
 *
 * Sections deliberately without a rail: staying-alive, whose headline is a
 * first-person "never banned" claim and needs sign-off before it is published
 * as a rail. It falls through to "where you are", which is real context.
 */

type Rail = { head: string; body: React.ReactNode }

function RailStat({
  n,
  label,
  note,
}: {
  n: string
  label: React.ReactNode
  note?: React.ReactNode
}) {
  return (
    <div className="rr-rail-card">
      <p className="rr-rail-stat-n">{n}</p>
      <p className="rr-rail-stat-l">{label}</p>
      {note && <p className="rr-rail-note">{note}</p>}
    </div>
  )
}

/** Comparison bars, scaled to the largest value in the set. */
function RailBars({
  rows,
  note,
}: {
  rows: { k: string; v: number; fmt?: string; mute?: boolean }[]
  note?: React.ReactNode
}) {
  const max = Math.max(...rows.map((r) => r.v), 1)
  return (
    <div className="rr-rail-card">
      {rows.map((r) => (
        <div className="rr-rail-bar-row" key={r.k}>
          <div className="rr-rail-bar-top">
            <span className="rr-rail-bar-k">{r.k}</span>
            <span className="rr-rail-bar-v">{r.fmt ?? r.v.toLocaleString()}</span>
          </div>
          <div
            className={`rr-rail-bar${r.mute ? ' rr-rail-bar--mute' : ''}`}
            style={{ width: `${Math.max(2, (r.v / max) * 100)}%` }}
          />
        </div>
      ))}
      {note && <p className="rr-rail-note">{note}</p>}
    </div>
  )
}

const sub = (name: string) =>
  redditStats.topSubreddits.find((s) => s.subreddit === name)

/** r/OnePiece vs the three product subs it out-pulled, all from topSubreddits. */
const KARMA_ENGINE_RIVALS = ['hubspot', 'UseApolloIo', 'buildinpublic']

export function buildRails(): Record<string, Rail> {
  const karmaEra = redditStats.eras.find((e) => e.era === 'karma-building')
  const clearboxEra = redditStats.eras.find((e) => e.era === 'clearbox')
  const onePiece = sub('OnePiece')
  const rivals = KARMA_ENGINE_RIVALS.map(sub).filter(Boolean) as NonNullable<
    ReturnType<typeof sub>
  >[]
  const rivalViews = rivals.reduce((a, s) => a + s.views, 0)
  // the comment the link-map section renders as its receipt (LINK_ZONE_EVIDENCE)
  const linkZone = (
    redditStats.posts as Record<string, { score: number; subreddit: string }>
  )['oab1cv3']

  const rails: Record<string, Rail> = {}

  if (karmaEra && clearboxEra) {
    rails.journey = {
      head: 'the two eras',
      body: (
        <RailBars
          rows={[
            { k: 'era 01 · karma', v: karmaEra.items, fmt: `${karmaEra.items} items` },
            {
              k: 'era 02 · clearbox',
              v: clearboxEra.items,
              fmt: `${clearboxEra.items} items`,
              mute: true,
            },
          ]}
          note={
            <>
              {fmtViews(karmaEra.views)} vs {fmtViews(clearboxEra.views)} views. era
              one is the bigger era and the shorter one: {karmaEra.days} days at{' '}
              {karmaEra.itemsPerDay} items a day, against {clearboxEra.days} days at{' '}
              {clearboxEra.itemsPerDay}.
            </>
          }
        />
      ),
    }
  }

  if (onePiece && rivals.length === KARMA_ENGINE_RIVALS.length) {
    rails['karma-engine'] = {
      head: 'farm where you already are',
      body: (
        <RailBars
          rows={[
            {
              k: 'r/OnePiece',
              v: onePiece.views,
              fmt: fmtViews(onePiece.views),
            },
            {
              k: 'the 3 product subs',
              v: rivalViews,
              fmt: fmtViews(rivalViews),
              mute: true,
            },
          ]}
          note={
            <>
              one anime sub out-pulled r/{rivals.map((r) => r.subreddit).join(', r/')}{' '}
              combined, on {onePiece.items} items against{' '}
              {rivals.reduce((a, r) => a + r.items, 0)}.
            </>
          }
        />
      ),
    }
  }

  // the flagship chart, small. it proves the section it sits beside.
  // the head reads off the first bucket rather than saying "week one": the
  // account opened on a Friday, so bucket one is 3 days, not 7.
  const firstWeek = redditStats.ramp.series[0]
  rails['account-ramp'] = {
    head: firstWeek
      ? `first ${firstWeek.days} days: ${firstWeek.comments} comments, ${firstWeek.posts} posts`
      : 'the ramp',
    body: (
      <div className="rr-rail-card">
        <RampChart
          series={redditStats.ramp.series}
          eras={redditStats.ramp.eras}
          clearboxFrom={redditStats.ramp.clearboxFrom}
          asOf={redditStats.asOf}
          compact
        />
        <p className="rr-rail-note">
          comments in accent, posts under them. the full chart is in this
          section.
        </p>
      </div>
    ),
  }

  // the spread, not the whole chart: seven bars where the top is 85x the
  // bottom collapses to slivers in a 288px rail. the two ends carry it.
  const convo = redditStats.conversation.rows
  if (convo.length >= 2) {
    const top = convo[0]
    const bottom = convo[convo.length - 1]
    rails.comments = {
      head: 'which subs talk back',
      body: (
        <RailBars
          rows={[
            {
              k: `r/${top.subreddit}`,
              v: top.perPost,
              fmt: `${top.perPost.toFixed(1)}/post`,
            },
            {
              k: `r/${bottom.subreddit}`,
              v: bottom.perPost,
              fmt: `${bottom.perPost.toFixed(2)}/post`,
              mute: true,
            },
          ]}
          note={
            <>
              comments per post, {(top.perPost / bottom.perPost).toFixed(0)}x apart on{' '}
              {top.posts} and {bottom.posts} posts. the sub decides whether you get
              views or a conversation.
            </>
          }
        />
      ),
    }
  }

  rails['post-types'] = {
    head: 'the top post',
    body: (
      <RailStat
        n={`${redditStats.topPost.score}↑`}
        label={
          <>
            {fmtViews(redditStats.topPost.views)} views in r/
            {redditStats.topPost.subreddit}
          </>
        }
        note={
          <>
            &ldquo;{redditStats.topPost.title}&rdquo; · the single best post of{' '}
            {redditStats.totalPosts}.
          </>
        }
      />
    ),
  }

  rails['karma-gating'] = {
    head: 'the karma split',
    body: (
      <RailBars
        rows={[
          { k: 'link karma', v: redditStats.linkKarma },
          { k: 'comment karma', v: redditStats.commentKarma, mute: true },
        ]}
        note={
          <>
            {redditStats.totalKarma.toLocaleString()} total. subs gate on both, and the
            split is what falls out of commenting more often than posting.
          </>
        }
      />
    ),
  }

  /**
   * link-map only, and it is oab1cv3, not oapxd4n.
   *
   * The first cut of this rail put oapxd4n on both link-map and the-ask and
   * captioned it "a comment someone asked to follow up on". oapxd4n is Shawn
   * dropping his own link in a thread about his own work (reportData.ts:404,
   * "own post, replying about what he shipped") and it lives in r/ClaudeCode,
   * so the rail invented the ask AND named the wrong sub for link-map. The
   * link-map evidence the page actually renders is oab1cv3.
   *
   * the-ask gets no rail: THE_ASK_EVIDENCE carries no redditId, so there is no
   * db-backed number for it, and the rule here is that a rail without one is
   * not written from memory. It falls through to "where you are".
   */
  if (linkZone) {
    rails['link-map'] = {
      head: 'the link that landed',
      body: (
        <RailStat
          n={`${linkZone.score}↑`}
          label={
            <>a comment in r/{linkZone.subreddit} pointing a reader at the site</>
          }
          note={
            <>
              reddit reports no view count on comments, so this is upvotes and
              nothing else. the number is small and that is the point: the link
              landed because the thread wanted it, not because it travelled far.
            </>
          }
        />
      ),
    }
  }

  const citations: Rail = {
    head: 'what the models read',
    body: (
      <RailStat
        n={`${(redditStats.trackedViews / 1_000_000).toFixed(1)}M`}
        label={<>tracked views across {redditStats.totalPosts} posts</>}
        note={
          <>
            posts only. reddit reports view counts on posts and the tracker does not
            scrape them for comments, so the {redditStats.totalComments} comments are
            not in this number.
          </>
        }
      />
    ),
  }
  rails['ai-citations'] = citations
  rails.llmo = citations

  rails.delegation = {
    head: 'what got flagged',
    body: (
      <RailStat
        n={`${redditStats.wins}`}
        label={
          <>
            threads flagged worth acting on, of{' '}
            {Object.keys(redditStats.posts).length} tracked
          </>
        }
        note={
          <>
            {((redditStats.wins / Object.keys(redditStats.posts).length) * 100).toFixed(1)}
            % of everything the account touched. the rest was the cost of being there.
          </>
        }
      />
    ),
  }

  return rails
}
