'use client'

import { StaggerContainer, StaggerItem } from './motion'

interface Step {
  command?: string
  title: string
  description: string
}

interface ProcessStepsProps {
  steps: Step[]
  style?: React.CSSProperties
}

export function ProcessSteps({ steps, style }: ProcessStepsProps) {
  return (
    <StaggerContainer stagger={0.1} style={style}>
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        {/* Connecting line */}
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 16,
            bottom: 16,
            width: 2,
            background: 'var(--accent)',
            opacity: 0.2,
          }}
        />

        {steps.map((step, i) => (
          <StaggerItem key={i}>
            <div
              style={{
                position: 'relative',
                marginBottom: i < steps.length - 1 ? 48 : 0,
              }}
            >
              {/* Numbered circle */}
              <div
                style={{
                  position: 'absolute',
                  left: -40,
                  top: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid var(--accent)',
                  background: 'var(--canvas-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 1,
                }}
              >
                {i + 1}
              </div>

              {/* Content */}
              <div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  )
}
