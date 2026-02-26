'use client'

import { useState } from 'react'

/* ── Constants ─────────────────────────────────── */

const GOOGLE_LIMIT = 25
const MICROSOFT_LIMIT = 10
const BIZ_DAYS_WEEK = 5
const BIZ_DAYS_MONTH = 22

/* ── Shared Styles ─────────────────────────────── */

const styles = {
  wrapper: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: '80px 0 120px',
    fontFamily: 'var(--font-mono)',
  } as React.CSSProperties,

  terminalPath: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginBottom: 12,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  heroTitle: {
    fontSize: 'clamp(28px, 5vw, 42px)',
    fontWeight: 700,
    color: 'var(--accent)',
    margin: '0 0 16px',
    lineHeight: 1.15,
  } as React.CSSProperties,

  heroDesc: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth: 680,
    margin: '0 0 56px',
  } as React.CSSProperties,

  card: {
    border: '1px solid var(--border)',
    borderRadius: 6,
    marginBottom: 16,
    background: 'var(--canvas-subtle)',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease',
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'background 0.15s ease',
  } as React.CSSProperties,

  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,

  toolNumber: {
    fontSize: 11,
    color: 'var(--accent)',
    background: 'rgba(249, 115, 22, 0.1)',
    padding: '2px 8px',
    borderRadius: 3,
    fontWeight: 600,
    letterSpacing: '0.04em',
    flexShrink: 0,
  } as React.CSSProperties,

  toolTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  } as React.CSSProperties,

  chevron: {
    fontSize: 14,
    color: 'var(--accent)',
    transition: 'transform 0.2s ease',
    flexShrink: 0,
  } as React.CSSProperties,

  cardBody: {
    padding: '0 20px 24px',
  } as React.CSSProperties,

  toolDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: 20,
    marginTop: 0,
  } as React.CSSProperties,

  inputRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end',
  } as React.CSSProperties,

  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    flex: 1,
    minWidth: 180,
  } as React.CSSProperties,

  label: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  input: {
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    padding: '10px 14px',
    background: 'var(--canvas)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    width: '100%',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  button: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 600,
    padding: '10px 20px',
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease, transform 0.1s ease',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    alignSelf: 'flex-end' as const,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  resultBox: {
    background: 'var(--canvas)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: 16,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    color: '#7ee787',
    whiteSpace: 'pre-wrap' as const,
    overflowX: 'auto' as const,
    marginTop: 16,
  } as React.CSSProperties,

  errorBox: {
    background: 'var(--canvas)',
    border: '1px solid rgba(248, 81, 73, 0.4)',
    borderRadius: 4,
    padding: 16,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    color: '#f85149',
    whiteSpace: 'pre-wrap' as const,
    marginTop: 16,
  } as React.CSSProperties,

  loadingBox: {
    background: 'var(--canvas)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: 16,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--accent)',
    marginTop: 16,
  } as React.CSSProperties,

  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  } as React.CSSProperties,

  slider: {
    flex: 1,
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  } as React.CSSProperties,

  sliderLabel: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    minWidth: 120,
    textAlign: 'right' as const,
  } as React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    marginTop: 16,
  } as React.CSSProperties,

  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    borderBottom: '1px solid var(--border)',
    color: 'var(--accent)',
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  } as React.CSSProperties,

  td: {
    padding: '8px 12px',
    borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
    color: 'var(--text-primary)',
    fontSize: 13,
  } as React.CSSProperties,

  readyBadge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 3,
    background: 'rgba(126, 231, 135, 0.15)',
    color: '#7ee787',
    letterSpacing: '0.04em',
    marginTop: 12,
  } as React.CSSProperties,

  scoreBar: {
    width: '100%',
    height: 8,
    background: 'var(--canvas)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 4,
  } as React.CSSProperties,
}

/* ── Tool Card Wrapper ─────────────────────────── */

function ToolCard({
  num,
  title,
  description,
  children,
  isOpen,
  onToggle,
}: {
  num: number
  title: string
  description: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        ...styles.card,
        borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
      }}
    >
      <div
        style={styles.cardHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        aria-expanded={isOpen}
      >
        <div style={styles.cardHeaderLeft}>
          <span style={styles.toolNumber}>0{num}</span>
          <h3 style={styles.toolTitle}>{title}</h3>
        </div>
        <span
          style={{
            ...styles.chevron,
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          &#9654;
        </span>
      </div>
      {isOpen && (
        <div style={styles.cardBody}>
          <p style={styles.toolDesc}>{description}</p>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Tool 1: MX Record Checker ─────────────────── */

function MXChecker() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const identifyProvider = (mx: string): string => {
    const lower = mx.toLowerCase()
    if (lower.includes('google') || lower.includes('googlemail'))
      return 'Google Workspace'
    if (lower.includes('outlook') || lower.includes('protection.outlook'))
      return 'Microsoft 365'
    return 'Other'
  }

  const checkMX = async () => {
    const clean = domain.trim().toLowerCase()
    if (!clean) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=MX`
      )
      if (!res.ok) throw new Error(`DNS query failed (${res.status})`)
      const data = await res.json()

      if (!data.Answer || data.Answer.length === 0) {
        setResult(`$ check-mx ${clean}\n\n[!] No MX records found for ${clean}\n    Domain may not be configured for email.`)
        setLoading(false)
        return
      }

      const records = data.Answer.filter(
        (r: { type: number }) => r.type === 15
      ).map((r: { data: string }) => {
        const parts = r.data.split(' ')
        const priority = parts[0]
        const host = parts[1]?.replace(/\.$/, '') || r.data
        return { priority, host }
      })

      if (records.length === 0) {
        setResult(`$ check-mx ${clean}\n\n[!] No MX records found for ${clean}`)
        setLoading(false)
        return
      }

      const providers = new Set(
        records.map((r: { host: string }) => identifyProvider(r.host))
      )
      const providerStr = Array.from(providers).join(', ')

      let output = `$ check-mx ${clean}\n\n`
      output += `PROVIDER  ${providerStr}\n`
      output += `RECORDS   ${records.length} found\n\n`
      output += `PRI  HOST\n`
      output += `---  ${''.padEnd(50, '-')}\n`
      records.forEach((r: { priority: string; host: string }) => {
        output += `${String(r.priority).padEnd(5)}${r.host}\n`
      })
      output += `\n[OK] MX lookup complete`

      setResult(output)
    } catch (err) {
      setError(
        `$ check-mx ${clean}\n\n[ERR] ${err instanceof Error ? err.message : 'DNS lookup failed'}`
      )
    }
    setLoading(false)
  }

  return (
    <>
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Domain</label>
          <input
            style={styles.input}
            type="text"
            placeholder="$ check-mx acme.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') checkMX()
            }}
          />
        </div>
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}
          onClick={checkMX}
        >
          {loading ? 'Checking...' : 'Run Check'}
        </button>
      </div>
      {loading && (
        <div style={styles.loadingBox}>Resolving MX records...</div>
      )}
      {result && <div style={styles.resultBox}>{result}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}
    </>
  )
}

/* ── Tool 2: Deliverability Multiplier Calculator ── */

function DeliverabilityCalc() {
  const [domains, setDomains] = useState(5)
  const [mailboxesPerDomain, setMailboxesPerDomain] = useState(2)
  const [googlePct, setGooglePct] = useState(70)
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const totalMailboxes = domains * mailboxesPerDomain
    const msPct = 100 - googlePct
    const gMailboxes = Math.round(totalMailboxes * (googlePct / 100))
    const msMailboxes = totalMailboxes - gMailboxes

    const gDaily = gMailboxes * GOOGLE_LIMIT
    const msDaily = msMailboxes * MICROSOFT_LIMIT
    const totalDaily = gDaily + msDaily
    const totalWeekly = totalDaily * BIZ_DAYS_WEEK
    const totalMonthly = totalDaily * BIZ_DAYS_MONTH

    let output = `$ calc-capacity --domains ${domains} --per-domain ${mailboxesPerDomain} --split ${googlePct}/${msPct}\n\n`
    output += `INFRASTRUCTURE\n`
    output += `  Domains          ${domains}\n`
    output += `  Mailboxes/domain ${mailboxesPerDomain}\n`
    output += `  Total mailboxes  ${totalMailboxes}\n\n`
    output += `PROVIDER SPLIT\n`
    output += `  Google Workspace ${gMailboxes} mailboxes (${googlePct}%) @ ${GOOGLE_LIMIT}/day\n`
    output += `  Microsoft 365    ${msMailboxes} mailboxes (${msPct}%) @ ${MICROSOFT_LIMIT}/day\n\n`
    output += `DAILY CAPACITY\n`
    output += `  Google           ${gDaily.toLocaleString()} emails\n`
    output += `  Microsoft        ${msDaily.toLocaleString()} emails\n`
    output += `  Total            ${totalDaily.toLocaleString()} emails/day\n\n`
    output += `PROJECTIONS\n`
    output += `  Weekly  (5d)     ${totalWeekly.toLocaleString()} emails\n`
    output += `  Monthly (22d)    ${totalMonthly.toLocaleString()} emails\n\n`
    output += `[OK] Capacity calculated`

    setResult(output)
  }

  return (
    <>
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Domains</label>
          <input
            style={styles.input}
            type="number"
            min={1}
            max={500}
            value={domains}
            onChange={(e) => setDomains(Math.max(1, parseInt(e.target.value) || 1))}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mailboxes per Domain</label>
          <input
            style={styles.input}
            type="number"
            min={1}
            max={50}
            value={mailboxesPerDomain}
            onChange={(e) =>
              setMailboxesPerDomain(Math.max(1, parseInt(e.target.value) || 1))
            }
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
          />
        </div>
      </div>
      <div style={{ ...styles.inputGroup, marginBottom: 16 }}>
        <label style={styles.label}>Provider Split</label>
        <div style={styles.sliderRow}>
          <input
            type="range"
            min={0}
            max={100}
            value={googlePct}
            onChange={(e) => setGooglePct(parseInt(e.target.value))}
            style={styles.slider}
          />
          <span style={styles.sliderLabel}>
            G: {googlePct}% / MS: {100 - googlePct}%
          </span>
        </div>
      </div>
      <button style={styles.button} onClick={calculate}>
        Calculate
      </button>
      {result && <div style={styles.resultBox}>{result}</div>}
    </>
  )
}

/* ── Tool 3: Sending Volume Planner ────────────── */

function VolumePlanner() {
  const [target, setTarget] = useState(10000)
  const [result, setResult] = useState<string | null>(null)

  const plan = () => {
    // 70% Google, 30% Microsoft, 1 mailbox per domain
    // Blended daily rate per domain: 0.7 * 25 + 0.3 * 10 = 20.5
    const blendedDaily = 0.7 * GOOGLE_LIMIT + 0.3 * MICROSOFT_LIMIT
    const dailyNeeded = Math.ceil(target / BIZ_DAYS_MONTH)
    const totalDomains = Math.ceil(dailyNeeded / blendedDaily)
    const gDomains = Math.round(totalDomains * 0.7)
    const msDomains = totalDomains - gDomains

    const actualDaily = gDomains * GOOGLE_LIMIT + msDomains * MICROSOFT_LIMIT
    const actualMonthly = actualDaily * BIZ_DAYS_MONTH

    let output = `$ plan-volume --target ${target.toLocaleString()}/month\n\n`
    output += `TARGET\n`
    output += `  Monthly goal     ${target.toLocaleString()} emails\n`
    output += `  Daily needed     ${dailyNeeded.toLocaleString()} emails (22 biz days)\n\n`
    output += `RECOMMENDED INFRASTRUCTURE\n`
    output += `  Total domains    ${totalDomains}\n`
    output += `  Total mailboxes  ${totalDomains} (1 per domain)\n\n`
    output += `  Google Workspace ${gDomains} domains @ ${GOOGLE_LIMIT}/day = ${(gDomains * GOOGLE_LIMIT).toLocaleString()}/day\n`
    output += `  Microsoft 365    ${msDomains} domains @ ${MICROSOFT_LIMIT}/day = ${(msDomains * MICROSOFT_LIMIT).toLocaleString()}/day\n\n`
    output += `ACTUAL CAPACITY\n`
    output += `  Daily            ${actualDaily.toLocaleString()} emails\n`
    output += `  Monthly (22d)    ${actualMonthly.toLocaleString()} emails\n`
    output += `  Headroom         ${actualMonthly >= target ? '+' : ''}${(actualMonthly - target).toLocaleString()} emails\n\n`
    output += `[OK] Infrastructure plan ready`

    setResult(output)
  }

  return (
    <>
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Target emails per month</label>
          <input
            style={styles.input}
            type="number"
            min={100}
            max={1000000}
            value={target}
            onChange={(e) =>
              setTarget(Math.max(100, parseInt(e.target.value) || 100))
            }
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') plan()
            }}
          />
        </div>
        <button style={styles.button} onClick={plan}>
          Plan Infrastructure
        </button>
      </div>
      {result && <div style={styles.resultBox}>{result}</div>}
    </>
  )
}

/* ── Tool 4: Domain Health Scorer ──────────────── */

function DomainHealth() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    const clean = domain.trim().toLowerCase()
    if (!clean) return
    setLoading(true)
    setError(null)
    setResult(null)
    setScore(null)

    try {
      // Fetch TXT records for SPF
      const txtRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=TXT`
      )
      if (!txtRes.ok) throw new Error(`TXT lookup failed (${txtRes.status})`)
      const txtData = await txtRes.json()

      // Fetch DMARC
      const dmarcRes = await fetch(
        `https://dns.google/resolve?name=_dmarc.${encodeURIComponent(clean)}&type=TXT`
      )
      const dmarcData = dmarcRes.ok ? await dmarcRes.json() : { Answer: [] }

      // Parse SPF
      const txtRecords: string[] = (txtData.Answer || []).map(
        (r: { data: string }) => r.data.replace(/"/g, '')
      )
      const spfRecord = txtRecords.find((r: string) =>
        r.startsWith('v=spf1')
      )
      const hasSPF = !!spfRecord
      const spfHasPlusAll = spfRecord?.includes('+all') || false

      // Parse DMARC
      const dmarcRecords: string[] = (dmarcData.Answer || []).map(
        (r: { data: string }) => r.data.replace(/"/g, '')
      )
      const dmarcRecord = dmarcRecords.find((r: string) =>
        r.startsWith('v=DMARC1')
      )
      const hasDMARC = !!dmarcRecord
      const dmarcPolicyNone =
        dmarcRecord?.includes('p=none') || !hasDMARC

      // Score
      let pts = 0
      if (hasSPF) pts += 35
      if (hasDMARC) pts += 35
      if (hasDMARC && !dmarcPolicyNone) pts += 15
      if (hasSPF && !spfHasPlusAll) pts += 15
      setScore(pts)

      const check = (pass: boolean) => (pass ? '[PASS]' : '[FAIL]')
      const scoreLabel =
        pts >= 85 ? 'Excellent' : pts >= 60 ? 'Good' : pts >= 35 ? 'Fair' : 'Critical'

      let output = `$ health-check ${clean}\n\n`
      output += `DOMAIN HEALTH REPORT\n\n`
      output += `${check(hasSPF)}  SPF Record              ${hasSPF ? '+35 pts' : ' +0 pts'}  ${hasSPF ? spfRecord?.substring(0, 60) + (spfRecord && spfRecord.length > 60 ? '...' : '') : 'Not found'}\n`
      output += `${check(hasSPF && !spfHasPlusAll)}  SPF (no +all)           ${hasSPF && !spfHasPlusAll ? '+15 pts' : ' +0 pts'}  ${!hasSPF ? 'No SPF' : spfHasPlusAll ? 'Dangerous: uses +all' : 'Safe: no +all'}\n`
      output += `${check(hasDMARC)}  DMARC Record            ${hasDMARC ? '+35 pts' : ' +0 pts'}  ${hasDMARC ? dmarcRecord?.substring(0, 60) + (dmarcRecord && dmarcRecord.length > 60 ? '...' : '') : 'Not found'}\n`
      output += `${check(hasDMARC && !dmarcPolicyNone)}  DMARC Policy (not none) ${hasDMARC && !dmarcPolicyNone ? '+15 pts' : ' +0 pts'}  ${!hasDMARC ? 'No DMARC' : dmarcPolicyNone ? 'Policy is p=none (weak)' : 'Enforced policy'}\n\n`
      output += `SCORE  ${pts}/100 - ${scoreLabel}\n\n`
      output += `[OK] Health check complete`

      setResult(output)
    } catch (err) {
      setError(
        `$ health-check ${clean}\n\n[ERR] ${err instanceof Error ? err.message : 'DNS lookup failed'}`
      )
    }
    setLoading(false)
  }

  const getScoreColor = (s: number) => {
    if (s >= 85) return '#7ee787'
    if (s >= 60) return '#f0c000'
    if (s >= 35) return '#f09000'
    return '#f85149'
  }

  return (
    <>
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Domain</label>
          <input
            style={styles.input}
            type="text"
            placeholder="$ health-check acme.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') checkHealth()
            }}
          />
        </div>
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}
          onClick={checkHealth}
        >
          {loading ? 'Scanning...' : 'Run Check'}
        </button>
      </div>
      {loading && (
        <div style={styles.loadingBox}>Scanning DNS records...</div>
      )}
      {result && (
        <>
          {score !== null && (
            <div style={styles.scoreBar}>
              <div
                style={{
                  height: '100%',
                  width: `${score}%`,
                  background: getScoreColor(score),
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          )}
          <div style={styles.resultBox}>{result}</div>
        </>
      )}
      {error && <div style={styles.errorBox}>{error}</div>}
    </>
  )
}

/* ── Tool 5: Warmup Timeline Generator ─────────── */

function WarmupTimeline() {
  const [domainCount, setDomainCount] = useState(5)
  const [result, setResult] = useState<{
    schedule: { day: number; perDomain: number; total: number }[]
  } | null>(null)

  const WARMUP_PHASES = [
    { start: 1, end: 3, volume: 2 },
    { start: 4, end: 6, volume: 5 },
    { start: 7, end: 9, volume: 10 },
    { start: 10, end: 12, volume: 15 },
    { start: 13, end: 14, volume: 25 },
  ]

  const generate = () => {
    const schedule: { day: number; perDomain: number; total: number }[] = []
    for (let day = 1; day <= 14; day++) {
      const phase = WARMUP_PHASES.find((p) => day >= p.start && day <= p.end)
      const perDomain = phase?.volume || 0
      schedule.push({ day, perDomain, total: perDomain * domainCount })
    }
    setResult({ schedule })
  }

  return (
    <>
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Fresh Domains</label>
          <input
            style={styles.input}
            type="number"
            min={1}
            max={200}
            value={domainCount}
            onChange={(e) =>
              setDomainCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') generate()
            }}
          />
        </div>
        <button style={styles.button} onClick={generate}>
          Generate Timeline
        </button>
      </div>
      {result && (
        <>
          <div
            style={{
              overflowX: 'auto',
              border: '1px solid var(--border)',
              borderRadius: 4,
              marginTop: 16,
            }}
          >
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Day</th>
                  <th style={styles.th}>Phase</th>
                  <th style={styles.th}>Per Domain</th>
                  <th style={styles.th}>
                    Total ({domainCount} domain{domainCount !== 1 ? 's' : ''})
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => {
                  const phase = WARMUP_PHASES.find(
                    (p) => row.day >= p.start && row.day <= p.end
                  )
                  const phaseLabel = phase
                    ? `${phase.start}-${phase.end}`
                    : ''
                  const isReady = row.day === 14

                  return (
                    <tr
                      key={row.day}
                      style={{
                        background: isReady
                          ? 'rgba(126, 231, 135, 0.06)'
                          : 'transparent',
                      }}
                    >
                      <td
                        style={{
                          ...styles.td,
                          color: isReady ? '#7ee787' : 'var(--text-primary)',
                          fontWeight: isReady ? 600 : 400,
                        }}
                      >
                        {row.day}
                      </td>
                      <td style={{ ...styles.td, color: 'var(--text-secondary)' }}>
                        Day {phaseLabel}
                      </td>
                      <td style={styles.td}>
                        {row.perDomain} emails
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color: isReady ? '#7ee787' : 'var(--accent)',
                          fontWeight: 600,
                        }}
                      >
                        {row.total.toLocaleString()} emails
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16 }}>
            <span style={styles.readyBadge}>
              READY TO SEND at Day 14 - {(25 * domainCount).toLocaleString()} emails/day capacity
            </span>
          </div>
          <div style={styles.resultBox}>
            {`$ warmup-plan --domains ${domainCount}\n\n`}
            {`14-DAY WARMUP SUMMARY\n\n`}
            {`Total warmup emails  ${result.schedule.reduce((s, r) => s + r.total, 0).toLocaleString()}\n`}
            {`Final daily capacity ${(25 * domainCount).toLocaleString()} emails/day\n`}
            {`Monthly capacity     ${(25 * domainCount * BIZ_DAYS_MONTH).toLocaleString()} emails/month (22 biz days)\n\n`}
            {`[OK] Warmup timeline generated`}
          </div>
        </>
      )}
    </>
  )
}

/* ── Main Page Component ───────────────────────── */

export function ToolsClient() {
  const [openTools, setOpenTools] = useState<Record<number, boolean>>({
    1: true,
  })

  const toggle = (num: number) => {
    setOpenTools((prev) => ({ ...prev, [num]: !prev[num] }))
  }

  return (
    <div style={styles.wrapper} className="page-enter">
      <p style={styles.terminalPath}>$ cd ~/gtm-os/features/</p>
      <h1 style={styles.heroTitle}>Email Deliverability Toolkit</h1>
      <p style={styles.heroDesc}>
        Free tools for GTM engineers who run cold email at scale. Check your MX
        records, calculate sending capacity, score domain health, and plan warmup
        timelines - all from your browser.
      </p>

      <ToolCard
        num={1}
        title="MX Record Checker"
        description="Look up the mail exchange records for any domain. Identifies the email provider (Google Workspace, Microsoft 365, or other) and shows all MX entries with priority."
        isOpen={!!openTools[1]}
        onToggle={() => toggle(1)}
      >
        <MXChecker />
      </ToolCard>

      <ToolCard
        num={2}
        title="Deliverability Multiplier Calculator"
        description="Calculate your total sending capacity based on your domain and mailbox infrastructure. Accounts for different daily limits between Google Workspace (25/day) and Microsoft 365 (10/day)."
        isOpen={!!openTools[2]}
        onToggle={() => toggle(2)}
      >
        <DeliverabilityCalc />
      </ToolCard>

      <ToolCard
        num={3}
        title="Sending Volume Planner"
        description="Tell us your monthly email target and we calculate exactly how many domains and mailboxes you need. Assumes 1 mailbox per domain with a 70/30 Google/Microsoft split."
        isOpen={!!openTools[3]}
        onToggle={() => toggle(3)}
      >
        <VolumePlanner />
      </ToolCard>

      <ToolCard
        num={4}
        title="Domain Health Scorer"
        description="Scan any domain for SPF and DMARC records. Get a deliverability health score out of 100 based on authentication setup, policy enforcement, and security posture."
        isOpen={!!openTools[4]}
        onToggle={() => toggle(4)}
      >
        <DomainHealth />
      </ToolCard>

      <ToolCard
        num={5}
        title="Warmup Timeline Generator"
        description="Generate a 14-day warmup schedule for your fresh domains. See daily sending volumes ramp from 2 to 25 emails per domain, with total volume across your infrastructure."
        isOpen={!!openTools[5]}
        onToggle={() => toggle(5)}
      >
        <WarmupTimeline />
      </ToolCard>
    </div>
  )
}
