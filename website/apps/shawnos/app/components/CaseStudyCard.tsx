import Link from 'next/link'

interface CaseStudy {
  title: string
  description: string
  tags: string[]
  href: string
  external?: boolean
}

interface CaseStudyGridProps {
  studies: CaseStudy[]
  style?: React.CSSProperties
}

export function CaseStudyGrid({ studies, style }: CaseStudyGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
        ...style,
      }}
    >
      {studies.map((study, i) => (
        <CaseStudyCard key={i} study={study} />
      ))}
    </div>
  )
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const Wrapper = study.external ? 'a' : Link

  return (
    <div className="case-study-card" style={{
      border: '1px dashed var(--border-dashed)',
      borderRadius: 12,
      padding: 20,
      transition: 'border-color 0.2s ease',
    }}>
      <Wrapper
        href={study.href}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
        }}
        {...(study.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            marginBottom: 8,
          }}
        >
          {study.title}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.6,
            marginBottom: 12,
          }}
        >
          {study.description}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {study.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(78, 195, 115, 0.1)',
                color: 'var(--accent)',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Wrapper>
    </div>
  )
}
