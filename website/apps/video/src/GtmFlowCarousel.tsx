/**
 * GTM Automation Flow — LinkedIn carousel images + animated video.
 *
 * 4 compositions (1080×1350):
 *   GtmFlowThumb1  — "The Full Flow" (static)
 *   GtmFlowThumb2  — "The Pipeline Detail" (static)
 *   GtmFlowThumb3  — "The Result" (static)
 *   GtmFlowAnimated — ~5s animated version of Thumb1
 *
 * Style: dark bg, tool logo circles, dashed teal flow lines, terminal chrome.
 */
import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
} from 'remotion';
import { evolvePath } from '@remotion/paths';
import { COLORS, FONTS } from './lib/tokens';
import { SceneWrapper } from './components/SceneWrapper';

/* ─── Design tokens ──────────────────────────────── */

const ACCENT = '#F97316';

const TOOL_COLORS = {
  exa: '#3B82F6',
  python: '#3776AB',
  grok: '#E7E9EA',
  hubspot: '#FF7A59',
  claude: '#D97757',
} as const;

/** SVG paths from BuiltWithStrip.tsx (SimpleIcons, CC0) */
const SVG_PATHS = {
  hubspot:
    'M16.75 5.01V1.86c.6-.29 1.01-.89 1.01-1.56 0-.97-.78-1.75-1.75-1.75s-1.75.78-1.75 1.75c0 .67.42 1.27 1.01 1.56v3.13c-1.23.18-2.36.72-3.27 1.51l-8.6-6.7a2.28 2.28 0 0 0 .06-.52C3.46 1.02 2.44 0 1.18 0S-1.09 1.02-1.09 2.28c0 1.26 1.02 2.28 2.28 2.28.32 0 .63-.07.91-.19l8.44 6.57c-.73 1.1-1.16 2.42-1.16 3.83 0 1.54.51 2.96 1.36 4.1l-1.6 1.6a1.72 1.72 0 0 0-.5-.08c-.95 0-1.71.77-1.71 1.71 0 .95.77 1.71 1.71 1.71s1.71-.77 1.71-1.71c0-.17-.03-.34-.08-.5l1.58-1.58a7.24 7.24 0 0 0 4.16 1.31c4.01 0 7.25-3.25 7.25-7.25 0-3.63-2.67-6.63-6.15-7.17zm-.74 11.42c-2.35 0-4.25-1.9-4.25-4.25s1.9-4.25 4.25-4.25 4.25 1.9 4.25 4.25-1.9 4.25-4.25 4.25z',
  claude:
    'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
};

/* ─── Node layout constants ──────────────────────── */

const NODE_SIZE = 70;
const RING_SIZE = NODE_SIZE + 12;
const RING_R = RING_SIZE / 2;

/** Center coordinates for each node in the flow diagram (within 1080×1350 canvas) */
const NODES = {
  exa: { x: 200, y: 280 },
  python: { x: 200, y: 440 },
  claude: { x: 540, y: 360 },
  grok: { x: 880, y: 280 },
  hubspot: { x: 880, y: 440 },
};

/** Cubic bezier connection paths (edge-to-edge between rings) */
const CONNECTION_PATHS = [
  `M ${NODES.exa.x + RING_R} ${NODES.exa.y} C ${NODES.exa.x + 140} ${NODES.exa.y} ${NODES.claude.x - 140} ${NODES.claude.y} ${NODES.claude.x - RING_R} ${NODES.claude.y}`,
  `M ${NODES.python.x + RING_R} ${NODES.python.y} C ${NODES.python.x + 140} ${NODES.python.y} ${NODES.claude.x - 140} ${NODES.claude.y} ${NODES.claude.x - RING_R} ${NODES.claude.y}`,
  `M ${NODES.claude.x + RING_R} ${NODES.claude.y} C ${NODES.claude.x + 140} ${NODES.claude.y} ${NODES.grok.x - 140} ${NODES.grok.y} ${NODES.grok.x - RING_R} ${NODES.grok.y}`,
  `M ${NODES.claude.x + RING_R} ${NODES.claude.y} C ${NODES.claude.x + 140} ${NODES.claude.y} ${NODES.hubspot.x - 140} ${NODES.hubspot.y} ${NODES.hubspot.x - RING_R} ${NODES.hubspot.y}`,
];

/* ─── Shared components ──────────────────────────── */

type ToolKey = 'exa' | 'python' | 'grok' | 'hubspot' | 'claude';

interface ToolDef {
  name: string;
  color: string;
  render: 'image' | 'svg' | 'letter';
  src?: string;
  path?: string;
  viewBox?: string;
  letter?: string;
}

const TOOL_DEFS: Record<ToolKey, ToolDef> = {
  exa: { name: 'Exa MCP', color: TOOL_COLORS.exa, render: 'image', src: staticFile('brands/exa_ai_logo.jpeg') },
  python: { name: 'Python SDK', color: TOOL_COLORS.python, render: 'letter', letter: 'Py' },
  grok: { name: 'Grok', color: TOOL_COLORS.grok, render: 'letter', letter: 'G' },
  hubspot: { name: 'HubSpot CLI', color: TOOL_COLORS.hubspot, render: 'svg', path: SVG_PATHS.hubspot, viewBox: '-2 -2 28 26' },
  claude: { name: 'Claude Code', color: TOOL_COLORS.claude, render: 'svg', path: SVG_PATHS.claude, viewBox: '0 0 24 24' },
};

/** Circular tool node with glow ring, logo, and label */
const ToolNode: React.FC<{
  tool: ToolKey;
  size?: number;
  subtitle?: string;
  scale?: number;
  opacity?: number;
  isOrchestrator?: boolean;
}> = ({ tool, size = NODE_SIZE, subtitle, scale = 1, opacity = 1, isOrchestrator = false }) => {
  const t = TOOL_DEFS[tool];
  const ring = size + 12;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          width: ring,
          height: ring,
          borderRadius: '50%',
          border: `2px solid ${t.color}${isOrchestrator ? 'AA' : '66'}`,
          boxShadow: isOrchestrator
            ? `0 0 20px ${t.color}44, 0 0 40px ${t.color}22, inset 0 0 15px ${t.color}11`
            : `0 0 12px ${t.color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${t.color}11`,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: COLORS.canvasSubtle,
            border: `1.5px solid ${t.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {t.render === 'image' && t.src ? (
            <Img
              src={t.src}
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : t.render === 'svg' && t.path ? (
            <svg
              viewBox={t.viewBox || '0 0 24 24'}
              fill={t.color}
              width={size * 0.5}
              height={size * 0.5}
            >
              <path d={t.path} />
            </svg>
          ) : (
            <span
              style={{
                fontSize: (t.letter?.length ?? 0) > 1 ? size * 0.3 : size * 0.4,
                fontWeight: 800,
                color: t.color,
                fontFamily: FONTS.mono,
              }}
            >
              {t.letter}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: t.color,
          fontFamily: FONTS.mono,
          textAlign: 'center',
        }}
      >
        {t.name}
      </span>

      {/* Subtitle */}
      {subtitle && (
        <span
          style={{
            fontSize: 11,
            color: COLORS.textSecondary,
            fontFamily: FONTS.mono,
            textAlign: 'center',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};

/** macOS-style terminal chrome */
const TerminalChrome: React.FC<{
  children: React.ReactNode;
  title?: string;
  fontSize?: number;
}> = ({ children, title = 'terminal', fontSize = 13 }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      border: `1px solid ${COLORS.border}`,
      overflow: 'hidden',
      backgroundColor: '#0D1117',
      boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 32,
        backgroundColor: '#161B22',
        paddingLeft: 12,
        paddingRight: 12,
        gap: 6,
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E05555' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#D2A53C' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#4EC373' }} />
      <span
        style={{
          fontSize: 11,
          color: COLORS.textMuted,
          fontFamily: FONTS.mono,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        padding: '14px 18px',
        fontFamily: FONTS.mono,
        fontSize,
        color: COLORS.textSecondary,
        lineHeight: 1.8,
      }}
    >
      {children}
    </div>
  </div>
);

/** Colored terminal line */
const TLine: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color = COLORS.textSecondary }) => (
  <div style={{ color }}>{children}</div>
);

/** Stat block (reused from Thumbnails pattern) */
const StatBlock: React.FC<{
  value: string;
  label: string;
  color: string;
  valueFontSize?: number;
}> = ({ value, label, color, valueFontSize = 40 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <span style={{ color, fontWeight: 800, fontSize: valueFontSize, lineHeight: 1.1 }}>{value}</span>
    <span style={{ fontSize: 14, color: COLORS.textSecondary }}>{label}</span>
  </div>
);

const Divider: React.FC = () => (
  <span style={{ color: COLORS.border, fontSize: 28 }}>|</span>
);

/** Bottom attribution block */
const Attribution: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      opacity,
    }}
  >
    <span style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
      Shawn | TheGTMOS.ai
    </span>
    <span
      style={{
        fontSize: 28,
        fontWeight: 800,
        color: ACCENT,
        fontFamily: FONTS.mono,
        textShadow: `0 0 16px ${ACCENT}33`,
      }}
    >
      thegtmos.ai
    </span>
  </div>
);

/** Static dashed connection lines SVG for the flow diagram */
const FlowConnectionsSVG: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <svg
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 5,
      opacity,
    }}
  >
    {CONNECTION_PATHS.map((d, i) => (
      <path
        key={i}
        d={d}
        stroke={ACCENT}
        strokeWidth={2}
        fill="none"
        strokeDasharray="8,5"
        opacity={0.5}
      />
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   1. GtmFlowThumb1 — "The Full Flow"
   ═══════════════════════════════════════════════════════ */

export const GtmFlowThumb1: React.FC = () => (
  <SceneWrapper accentColor={ACCENT} particleCount={20}>
    {/* ── Headline ── */}
    <div
      style={{
        position: 'absolute',
        top: 30,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: ACCENT,
          fontFamily: FONTS.mono,
          textShadow: `0 0 20px ${ACCENT}44`,
        }}
      >
        Landing Pages in {'<'}2 mins
      </div>
      <div
        style={{
          fontSize: 16,
          color: COLORS.textSecondary,
          fontFamily: FONTS.mono,
          letterSpacing: 1,
        }}
      >
        Exa + Python + Grok + HubSpot - fully automated
      </div>
    </div>

    {/* ── Flow Diagram ── */}
    <FlowConnectionsSVG />

    {/* Left column: inputs */}
    <div style={{ position: 'absolute', left: NODES.exa.x - RING_R, top: NODES.exa.y - RING_R - 10, zIndex: 10 }}>
      <ToolNode tool="exa" />
    </div>
    <div style={{ position: 'absolute', left: NODES.python.x - RING_R, top: NODES.python.y - RING_R - 10, zIndex: 10 }}>
      <ToolNode tool="python" />
    </div>

    {/* Center: orchestrator */}
    <div style={{ position: 'absolute', left: NODES.claude.x - RING_R - 6, top: NODES.claude.y - RING_R - 16, zIndex: 10 }}>
      <ToolNode tool="claude" size={80} isOrchestrator subtitle="ORCHESTRATOR" />
    </div>

    {/* Right column: outputs */}
    <div style={{ position: 'absolute', left: NODES.grok.x - RING_R, top: NODES.grok.y - RING_R - 10, zIndex: 10 }}>
      <ToolNode tool="grok" />
    </div>
    <div style={{ position: 'absolute', left: NODES.hubspot.x - RING_R, top: NODES.hubspot.y - RING_R - 10, zIndex: 10 }}>
      <ToolNode tool="hubspot" />
    </div>

    {/* ── Flow Labels ── */}
    <div
      style={{
        position: 'absolute',
        top: 535,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 80,
        fontFamily: FONTS.mono,
        fontSize: 13,
        letterSpacing: 2,
        color: COLORS.textMuted,
      }}
    >
      <span>INPUT</span>
      <span style={{ color: ACCENT }}>ORCHESTRATE</span>
      <span>OUTPUT</span>
    </div>

    {/* ── Terminal ── */}
    <div style={{ position: 'absolute', top: 580, left: 40, right: 40, zIndex: 10 }}>
      <TerminalChrome title="gtmos-pipeline">
        <TLine color={COLORS.textPrimary}>$ gtmos pipeline run --target acme-corp</TLine>
        <TLine>
          <span style={{ color: ACCENT }}>{'[1/4]'}</span> Exa MCP → semantic search...{' '}
          <span style={{ color: '#4EC373' }}>done</span>
        </TLine>
        <TLine>
          <span style={{ color: ACCENT }}>{'[2/4]'}</span> Python SDK → scoring 23 signals...{' '}
          <span style={{ color: '#4EC373' }}>done</span>
        </TLine>
        <TLine>
          <span style={{ color: ACCENT }}>{'[3/4]'}</span> Grok → generating landing copy...{' '}
          <span style={{ color: '#4EC373' }}>done</span>
        </TLine>
        <TLine>
          <span style={{ color: ACCENT }}>{'[4/4]'}</span> HubSpot CLI → deploying page...{' '}
          <span style={{ color: '#4EC373' }}>done</span>
        </TLine>
        <div style={{ height: 4 }} />
        <TLine color="#4EC373">Pipeline complete - 1m 48s</TLine>
      </TerminalChrome>
    </div>

    {/* ── Stats Bar ── */}
    <div
      style={{
        position: 'absolute',
        top: 930,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          padding: '18px 40px',
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.canvasSubtle,
          fontFamily: FONTS.mono,
        }}
      >
        <StatBlock value="<2m" label="total time" color={ACCENT} />
        <Divider />
        <StatBlock value="4" label="tools" color={ACCENT} />
        <Divider />
        <StatBlock value="0" label="manual steps" color={ACCENT} />
      </div>
    </div>

    {/* ── Attribution + CTA ── */}
    <div
      style={{
        position: 'absolute',
        top: 1080,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Attribution />
    </div>
  </SceneWrapper>
);

/* ═══════════════════════════════════════════════════════
   2. GtmFlowThumb2 — "The Pipeline Detail"
   ═══════════════════════════════════════════════════════ */

const PIPELINE_STEPS: {
  tool: ToolKey;
  action: string;
  description: string;
}[] = [
  { tool: 'exa', action: 'SEARCH', description: 'Semantic web search for company signals' },
  { tool: 'python', action: 'TRANSFORM', description: 'Parse, score, and structure data' },
  { tool: 'grok', action: 'GENERATE', description: 'Personalized landing page copy' },
  { tool: 'hubspot', action: 'DEPLOY', description: 'Push pages live via CLI' },
];

export const GtmFlowThumb2: React.FC = () => {
  const TIMELINE_X = 100;
  const CARD_LEFT = 160;
  const STEP_START_Y = 180;
  const STEP_HEIGHT = 175;

  return (
    <SceneWrapper accentColor={ACCENT} particleCount={20}>
      {/* ── Headline ── */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: ACCENT,
            fontFamily: FONTS.mono,
            textShadow: `0 0 20px ${ACCENT}44`,
          }}
        >
          The 4-Step Pipeline
        </div>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          From signal to live page - zero manual work
        </div>
      </div>

      {/* ── Vertical Timeline Line ── */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <line
          x1={TIMELINE_X}
          y1={STEP_START_Y}
          x2={TIMELINE_X}
          y2={STEP_START_Y + STEP_HEIGHT * 3 + 40}
          stroke={ACCENT}
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.4}
        />
      </svg>

      {/* ── Step Cards ── */}
      {PIPELINE_STEPS.map((step, i) => {
        const y = STEP_START_Y + i * STEP_HEIGHT;
        const t = TOOL_DEFS[step.tool];

        return (
          <React.Fragment key={step.tool}>
            {/* Timeline dot with step number */}
            <div
              style={{
                position: 'absolute',
                left: TIMELINE_X - 18,
                top: y,
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: ACCENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: COLORS.canvas,
                fontFamily: FONTS.mono,
                boxShadow: `0 0 12px ${ACCENT}44`,
                zIndex: 10,
              }}
            >
              {i + 1}
            </div>

            {/* Step card */}
            <div
              style={{
                position: 'absolute',
                left: CARD_LEFT,
                top: y - 10,
                right: 40,
                padding: '16px 20px',
                borderRadius: 10,
                border: `1px solid ${t.color}33`,
                backgroundColor: COLORS.canvasSubtle,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                zIndex: 10,
              }}
            >
              {/* Mini tool icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: `${t.color}15`,
                  border: `1.5px solid ${t.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {t.render === 'image' && t.src ? (
                  <Img
                    src={t.src}
                    style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : t.render === 'svg' && t.path ? (
                  <svg viewBox={t.viewBox || '0 0 24 24'} fill={t.color} width={24} height={24}>
                    <path d={t.path} />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontSize: (t.letter?.length ?? 0) > 1 ? 14 : 18,
                      fontWeight: 800,
                      color: t.color,
                      fontFamily: FONTS.mono,
                    }}
                  >
                    {t.letter}
                  </span>
                )}
              </div>

              {/* Text content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: t.color, fontFamily: FONTS.mono }}>
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: ACCENT,
                      fontFamily: FONTS.mono,
                      letterSpacing: 2,
                      padding: '2px 8px',
                      borderRadius: 4,
                      backgroundColor: `${ACCENT}15`,
                      border: `1px solid ${ACCENT}33`,
                    }}
                  >
                    {step.action}
                  </span>
                </div>
                <span style={{ fontSize: 14, color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
                  {step.description}
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* ── Claude Code Orchestrator Callout ── */}
      <div
        style={{
          position: 'absolute',
          top: 920,
          left: 60,
          right: 60,
          padding: '18px 24px',
          borderRadius: 10,
          border: `2px dashed ${TOOL_COLORS.claude}55`,
          backgroundColor: `${TOOL_COLORS.claude}08`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: `${TOOL_COLORS.claude}15`,
            border: `1.5px solid ${TOOL_COLORS.claude}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill={TOOL_COLORS.claude} width={24} height={24}>
            <path d={SVG_PATHS.claude} />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: TOOL_COLORS.claude, fontFamily: FONTS.mono }}>
            Claude Code orchestrates the entire pipeline
          </span>
          <span style={{ fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
            One command triggers all 4 steps sequentially
          </span>
        </div>
      </div>

      {/* ── Time Comparison ── */}
      <div
        style={{
          position: 'absolute',
          top: 1050,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
          fontFamily: FONTS.mono,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.red,
              textDecoration: 'line-through',
              textDecorationThickness: 3,
              opacity: 0.7,
            }}
          >
            2-4 hours
          </span>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>manual</span>
        </div>
        <span style={{ fontSize: 32, color: COLORS.textMuted }}>→</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: ACCENT,
              textShadow: `0 0 12px ${ACCENT}33`,
            }}
          >
            {'<'}2 minutes
          </span>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>automated</span>
        </div>
      </div>

      {/* ── Attribution + CTA ── */}
      <div
        style={{
          position: 'absolute',
          top: 1180,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Attribution />
      </div>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════
   3. GtmFlowThumb3 — "The Result"
   ═══════════════════════════════════════════════════════ */

export const GtmFlowThumb3: React.FC = () => (
  <SceneWrapper accentColor={ACCENT} particleCount={20}>
    {/* ── Headline ── */}
    <div
      style={{
        position: 'absolute',
        top: 30,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: ACCENT,
          fontFamily: FONTS.mono,
          textShadow: `0 0 20px ${ACCENT}44`,
        }}
      >
        One Command. Done.
      </div>
    </div>

    {/* ── Full Terminal ── */}
    <div style={{ position: 'absolute', top: 120, left: 36, right: 36, zIndex: 10 }}>
      <TerminalChrome title="gtmos-pipeline" fontSize={12}>
        <TLine color={COLORS.textPrimary}>$ gtmos pipeline run --target acme-corp</TLine>
        <div style={{ height: 6 }} />
        <TLine>
          <span style={{ color: ACCENT, fontWeight: 700 }}>{'[1/4]'}</span>{' '}
          <span style={{ color: TOOL_COLORS.exa }}>Exa MCP</span>
        </TLine>
        <TLine>{'  '}→ Searching &quot;acme-corp B2B SaaS signals&quot;...</TLine>
        <TLine>{'  '}→ Found 23 intent signals</TLine>
        <TLine color="#4EC373">{'  '}● complete (12.3s)</TLine>
        <div style={{ height: 4 }} />
        <TLine>
          <span style={{ color: ACCENT, fontWeight: 700 }}>{'[2/4]'}</span>{' '}
          <span style={{ color: TOOL_COLORS.python }}>Python SDK</span>
        </TLine>
        <TLine>{'  '}→ Parsing 23 signals...</TLine>
        <TLine>{'  '}→ Scoring relevance: avg 0.87</TLine>
        <TLine>{'  '}→ Structured payload ready</TLine>
        <TLine color="#4EC373">{'  '}● complete (8.1s)</TLine>
        <div style={{ height: 4 }} />
        <TLine>
          <span style={{ color: ACCENT, fontWeight: 700 }}>{'[3/4]'}</span>{' '}
          <span style={{ color: TOOL_COLORS.grok }}>Grok</span>
        </TLine>
        <TLine>{'  '}→ Generating personalized landing copy...</TLine>
        <TLine>{'  '}→ 3 sections, 2 CTAs generated</TLine>
        <TLine color="#4EC373">{'  '}● complete (15.4s)</TLine>
        <div style={{ height: 4 }} />
        <TLine>
          <span style={{ color: ACCENT, fontWeight: 700 }}>{'[4/4]'}</span>{' '}
          <span style={{ color: TOOL_COLORS.hubspot }}>HubSpot CLI</span>
        </TLine>
        <TLine>{'  '}→ Creating landing page...</TLine>
        <TLine>{'  '}→ Publishing to acme-corp.thegtmos.ai</TLine>
        <TLine color="#4EC373">{'  '}● complete (12.0s)</TLine>
        <div style={{ height: 8 }} />
        <TLine color="#4EC373">Pipeline complete - 1m 48s - 0 manual steps</TLine>
      </TerminalChrome>
    </div>

    {/* ── Large Stats Strip ── */}
    <div
      style={{
        position: 'absolute',
        top: 710,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          padding: '22px 44px',
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.canvasSubtle,
          fontFamily: FONTS.mono,
        }}
      >
        <StatBlock value="1m 48s" label="total time" color={ACCENT} valueFontSize={36} />
        <Divider />
        <StatBlock value="0" label="manual steps" color={ACCENT} valueFontSize={36} />
        <Divider />
        <StatBlock value="23" label="pages deployed" color={ACCENT} valueFontSize={36} />
      </div>
    </div>

    {/* ── Before/After Cards ── */}
    <div
      style={{
        position: 'absolute',
        top: 860,
        left: 40,
        right: 40,
        display: 'flex',
        gap: 16,
        zIndex: 10,
      }}
    >
      {/* Without */}
      <div
        style={{
          flex: 1,
          padding: '20px 22px',
          borderRadius: 10,
          border: `1px solid ${COLORS.red}33`,
          backgroundColor: `${COLORS.red}08`,
          fontFamily: FONTS.mono,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.red }}>Without</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: COLORS.textSecondary }}>
          <div><span style={{ color: COLORS.red }}>{'>'}</span> 2-4 hours per page</div>
          <div><span style={{ color: COLORS.red }}>{'>'}</span> Manual research</div>
          <div><span style={{ color: COLORS.red }}>{'>'}</span> Copy/paste workflows</div>
          <div><span style={{ color: COLORS.red }}>{'>'}</span> Inconsistent quality</div>
        </div>
      </div>

      {/* With */}
      <div
        style={{
          flex: 1,
          padding: '20px 22px',
          borderRadius: 10,
          border: `1px solid ${ACCENT}33`,
          backgroundColor: `${ACCENT}08`,
          fontFamily: FONTS.mono,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>With GTMOS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: COLORS.textSecondary }}>
          <div><span style={{ color: ACCENT }}>{'>'}</span> {'<'}2 minutes per page</div>
          <div><span style={{ color: ACCENT }}>{'>'}</span> Automated research</div>
          <div><span style={{ color: ACCENT }}>{'>'}</span> One CLI command</div>
          <div><span style={{ color: ACCENT }}>{'>'}</span> Consistent, personalized</div>
        </div>
      </div>
    </div>

    {/* ── Attribution + CTA ── */}
    <div
      style={{
        position: 'absolute',
        top: 1100,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <Attribution />
    </div>
  </SceneWrapper>
);

/* ═══════════════════════════════════════════════════════
   4. GtmFlowAnimated — ~5s animated flow
   ═══════════════════════════════════════════════════════ */

export const GtmFlowAnimated: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Helper: spring entrance ── */
  const appear = (startFrame: number) => {
    const raw = spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: { damping: 14, mass: 0.5, stiffness: 120 },
    });
    return { scale: raw, opacity: raw };
  };

  /* ── Helper: line draw progress ── */
  const lineProgress = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  /* ── Node animations ── */
  const headline = appear(0);
  const exaNode = appear(10);
  const pythonNode = appear(30);
  const claudeNode = appear(45);
  const grokNode = appear(65);
  const hubspotNode = appear(80);

  /* ── Line animations ── */
  const line1P = lineProgress(25, 40);
  const line2P = lineProgress(40, 55);
  const line3P = lineProgress(60, 75);
  const line4P = lineProgress(75, 90);

  /* ── Pulse at F100-120 ── */
  const pulseScale = interpolate(frame, [100, 110, 120], [1, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineGlow = interpolate(frame, [100, 110, 120], [0.5, 1, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* ── Stats + attribution fade ── */
  const statsOpacity = interpolate(frame, [100, 118], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const attrOpacity = interpolate(frame, [120, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* ── Animated line SVG with evolvePath ── */
  const renderAnimatedLine = (pathD: string, progress: number) => {
    if (progress <= 0) return null;
    const evolved = evolvePath(progress, pathD);
    return (
      <path
        d={pathD}
        stroke={ACCENT}
        strokeWidth={2}
        fill="none"
        opacity={frame >= 100 ? lineGlow : 0.5}
        style={{
          strokeDasharray: evolved.strokeDasharray,
          strokeDashoffset: evolved.strokeDashoffset,
        }}
      />
    );
  };

  /* ── Node with pulse ── */
  const nodeScale = (base: { scale: number; opacity: number }) => ({
    scale: base.scale * (frame >= 100 ? pulseScale : 1),
    opacity: base.opacity,
  });

  return (
    <SceneWrapper accentColor={ACCENT} particleCount={20}>
      {/* ── Headline ── */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: headline.opacity,
          transform: `translateY(${interpolate(headline.scale, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: ACCENT,
            fontFamily: FONTS.mono,
            textShadow: `0 0 20px ${ACCENT}44`,
          }}
        >
          Landing Pages in {'<'}2 mins
        </div>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          Exa + Python + Grok + HubSpot - fully automated
        </div>
      </div>

      {/* ── Animated Connection Lines ── */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {renderAnimatedLine(CONNECTION_PATHS[0], line1P)}
        {renderAnimatedLine(CONNECTION_PATHS[1], line2P)}
        {renderAnimatedLine(CONNECTION_PATHS[2], line3P)}
        {renderAnimatedLine(CONNECTION_PATHS[3], line4P)}
      </svg>

      {/* ── Left: inputs ── */}
      <div style={{ position: 'absolute', left: NODES.exa.x - RING_R, top: NODES.exa.y - RING_R - 10, zIndex: 10 }}>
        <ToolNode tool="exa" {...nodeScale(exaNode)} />
      </div>
      <div style={{ position: 'absolute', left: NODES.python.x - RING_R, top: NODES.python.y - RING_R - 10, zIndex: 10 }}>
        <ToolNode tool="python" {...nodeScale(pythonNode)} />
      </div>

      {/* ── Center: orchestrator ── */}
      <div style={{ position: 'absolute', left: NODES.claude.x - RING_R - 6, top: NODES.claude.y - RING_R - 16, zIndex: 10 }}>
        <ToolNode
          tool="claude"
          size={80}
          isOrchestrator
          subtitle="ORCHESTRATOR"
          {...nodeScale(claudeNode)}
        />
      </div>

      {/* ── Right: outputs ── */}
      <div style={{ position: 'absolute', left: NODES.grok.x - RING_R, top: NODES.grok.y - RING_R - 10, zIndex: 10 }}>
        <ToolNode tool="grok" {...nodeScale(grokNode)} />
      </div>
      <div style={{ position: 'absolute', left: NODES.hubspot.x - RING_R, top: NODES.hubspot.y - RING_R - 10, zIndex: 10 }}>
        <ToolNode tool="hubspot" {...nodeScale(hubspotNode)} />
      </div>

      {/* ── Flow Labels ── */}
      <div
        style={{
          position: 'absolute',
          top: 535,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 80,
          fontFamily: FONTS.mono,
          fontSize: 13,
          letterSpacing: 2,
          color: COLORS.textMuted,
          opacity: statsOpacity,
        }}
      >
        <span>INPUT</span>
        <span style={{ color: ACCENT }}>ORCHESTRATE</span>
        <span>OUTPUT</span>
      </div>

      {/* ── Terminal ── */}
      <div style={{ position: 'absolute', top: 580, left: 40, right: 40, zIndex: 10, opacity: statsOpacity }}>
        <TerminalChrome title="gtmos-pipeline">
          <TLine color={COLORS.textPrimary}>$ gtmos pipeline run --target acme-corp</TLine>
          <TLine>
            <span style={{ color: ACCENT }}>{'[1/4]'}</span> Exa MCP → semantic search...{' '}
            <span style={{ color: '#4EC373' }}>done</span>
          </TLine>
          <TLine>
            <span style={{ color: ACCENT }}>{'[2/4]'}</span> Python SDK → scoring 23 signals...{' '}
            <span style={{ color: '#4EC373' }}>done</span>
          </TLine>
          <TLine>
            <span style={{ color: ACCENT }}>{'[3/4]'}</span> Grok → generating landing copy...{' '}
            <span style={{ color: '#4EC373' }}>done</span>
          </TLine>
          <TLine>
            <span style={{ color: ACCENT }}>{'[4/4]'}</span> HubSpot CLI → deploying page...{' '}
            <span style={{ color: '#4EC373' }}>done</span>
          </TLine>
          <div style={{ height: 4 }} />
          <TLine color="#4EC373">Pipeline complete - 1m 48s</TLine>
        </TerminalChrome>
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 930,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: statsOpacity,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            padding: '18px 40px',
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.canvasSubtle,
            fontFamily: FONTS.mono,
          }}
        >
          <StatBlock value="<2m" label="total time" color={ACCENT} />
          <Divider />
          <StatBlock value="4" label="tools" color={ACCENT} />
          <Divider />
          <StatBlock value="0" label="manual steps" color={ACCENT} />
        </div>
      </div>

      {/* ── Attribution + CTA ── */}
      <div
        style={{
          position: 'absolute',
          top: 1080,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          opacity: attrOpacity,
        }}
      >
        <Attribution />
      </div>
    </SceneWrapper>
  );
};
