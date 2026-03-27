'use client'

interface GitHubCTAProps {
  repoUrl: string
  chapterPath?: string
}

export function GitHubCTA({ repoUrl, chapterPath }: GitHubCTAProps) {
  const viewUrl = chapterPath ? `${repoUrl}/blob/main/${chapterPath}` : repoUrl

  return (
    <div
      style={{
        padding: '24px',
        background: 'var(--canvas-subtle)',
        border: '1px dashed var(--border-dashed, var(--border))',
        borderRadius: '12px',
        marginTop: 32,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 12,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'var(--text-primary)', flexShrink: 0 }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
          Open Source Playbook
        </span>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px', fontFamily: 'var(--font-sans)' }}>
        This guide is open source. Fork the repo to get the hands-on version with exercises, templates, and a full GTM-OS skeleton.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {chapterPath ? 'View on GitHub' : 'View Repo'}
        </a>
        <a
          href={`${repoUrl}/fork`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          Fork &amp; Build
        </a>
      </div>
    </div>
  )
}
