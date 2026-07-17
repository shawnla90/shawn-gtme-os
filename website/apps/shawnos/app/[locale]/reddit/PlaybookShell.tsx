import React from 'react'

/**
 * Layout primitives for the report.
 *
 * The page used to be a single `maxWidth: 880` column holding everything —
 * prose, tables, evidence, all of it. Two problems at once: on a wide screen it
 * read as a narrow strip with dead gutters, and the prose sat in the same card
 * boxes as the data, so paragraphs looked like UI instead of writing.
 *
 * The split is: text gets a measure, exhibits get the screen.
 *
 *   <Shell>                      full-width canvas, no cap
 *     <Column>…prose…</Column>   ~68ch, centred, the reading line
 *     <Bleed>…chart/table…</Bleed>  escapes to the full canvas
 *   </Shell>
 */

/** Full-bleed canvas. `<main>` has no container, so this owns page width. */
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="rr-shell">{children}</div>
}

/**
 * The reading line. Everything a person reads left-to-right lives here.
 * 68ch is the measure; the shell is wider on purpose.
 */
export function Column({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rr-col ${className}`.trim()}>{children}</div>
}

/**
 * Exhibits: charts, wide tables, the scorer, comparisons. Breaks out of the
 * reading line and uses the canvas, capped so it stays legible on very wide
 * displays rather than stretching to 2560px.
 */
export function Bleed({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rr-bleed ${className}`.trim()}>{children}</div>
}

/** A section with a kicker, a title, and an optional standfirst. */
export function Section({
  id,
  no,
  title,
  standfirst,
  children,
}: {
  id: string
  no: string
  title: string
  standfirst?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={id} className="rr-section">
      <Column>
        <p className="rr-kicker">section {no}</p>
        <h2 className="rr-h2">{title}</h2>
        {standfirst && <p className="rr-standfirst">{standfirst}</p>}
      </Column>
      {children}
    </section>
  )
}

/**
 * A numbered editorial step. Replaces the card grid for sequential prose:
 * a rule, a number, and text on the reading line. Reads as writing, not UI.
 */
export function Step({
  n,
  title,
  aside,
  children,
}: {
  n: React.ReactNode
  title: React.ReactNode
  /** the right-hand meta: a window, a verdict, a live stat line. */
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rr-step">
      <div className="rr-step-mark" aria-hidden="true">
        {n}
      </div>
      <div className="rr-step-body">
        <p className="rr-step-title">
          {title}
          {aside && <span className="rr-step-aside">{aside}</span>}
        </p>
        <p className="rr-p">{children}</p>
      </div>
    </div>
  )
}

/** A pull-quote / receipt line. Sits on the reading line, set off by rule. */
export function Note({ children }: { children: React.ReactNode }) {
  return <p className="rr-note">{children}</p>
}
