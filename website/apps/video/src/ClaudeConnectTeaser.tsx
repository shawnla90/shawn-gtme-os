/**
 * Claude Connect Teaser — LinkedIn comment drop (1080×1350 4:5).
 *
 * Two compositions:
 *   ClaudeConnectTeaserStill    — 1 frame, PNG still (drop as a comment image today)
 *   ClaudeConnectTeaserAnimated — 150 frames @ 30fps, 5s (GIF-ready next week)
 *
 * Style: dark canvas, Claude orchestrator on left, dashed orange flow lines to
 * HubSpot (top right) and Apollo (bottom right), "Playbook coming next week" CTA.
 */
import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { evolvePath } from '@remotion/paths';
import { COLORS, FONTS } from './lib/tokens';
import { SceneWrapper } from './components/SceneWrapper';

/* ─── Design tokens ──────────────────────────────── */

const ACCENT = '#D97757'; // Claude orange — Claude is the orchestrator

const TOOL_COLORS = {
  claude: '#D97757',
  hubspot: '#FF7A59',
  apollo: '#6366F1',
} as const;

const SVG_PATHS = {
  hubspot:
    'M16.75 5.01V1.86c.6-.29 1.01-.89 1.01-1.56 0-.97-.78-1.75-1.75-1.75s-1.75.78-1.75 1.75c0 .67.42 1.27 1.01 1.56v3.13c-1.23.18-2.36.72-3.27 1.51l-8.6-6.7a2.28 2.28 0 0 0 .06-.52C3.46 1.02 2.44 0 1.18 0S-1.09 1.02-1.09 2.28c0 1.26 1.02 2.28 2.28 2.28.32 0 .63-.07.91-.19l8.44 6.57c-.73 1.1-1.16 2.42-1.16 3.83 0 1.54.51 2.96 1.36 4.1l-1.6 1.6a1.72 1.72 0 0 0-.5-.08c-.95 0-1.71.77-1.71 1.71 0 .95.77 1.71 1.71 1.71s1.71-.77 1.71-1.71c0-.17-.03-.34-.08-.5l1.58-1.58a7.24 7.24 0 0 0 4.16 1.31c4.01 0 7.25-3.25 7.25-7.25 0-3.63-2.67-6.63-6.15-7.17zm-.74 11.42c-2.35 0-4.25-1.9-4.25-4.25s1.9-4.25 4.25-4.25 4.25 1.9 4.25 4.25-1.9 4.25-4.25 4.25z',
  claude:
    'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
};

/* ─── Node layout (within 1080×1350 canvas) ──────── */

const CLAUDE_SIZE = 140;
const TARGET_SIZE = 110;
const RING_PAD = 14;

const NODES = {
  claude: { x: 280, y: 640 },
  hubspot: { x: 820, y: 470 },
  apollo: { x: 820, y: 810 },
};

const claudeRingR = (CLAUDE_SIZE + RING_PAD * 2) / 2;
const targetRingR = (TARGET_SIZE + RING_PAD * 2) / 2;

const CONNECTION_PATHS = [
  // Claude → HubSpot (gentle upward curve)
  `M ${NODES.claude.x + claudeRingR} ${NODES.claude.y} C ${NODES.claude.x + 240} ${NODES.claude.y - 60} ${NODES.hubspot.x - 220} ${NODES.hubspot.y + 40} ${NODES.hubspot.x - targetRingR} ${NODES.hubspot.y}`,
  // Claude → Apollo (gentle downward curve)
  `M ${NODES.claude.x + claudeRingR} ${NODES.claude.y} C ${NODES.claude.x + 240} ${NODES.claude.y + 60} ${NODES.apollo.x - 220} ${NODES.apollo.y - 40} ${NODES.apollo.x - targetRingR} ${NODES.apollo.y}`,
];

/* ─── ToolNode ───────────────────────────────────── */

type NodeKind = 'claude-svg' | 'hubspot-svg' | 'apollo-letter';

const ToolNode: React.FC<{
  kind: NodeKind;
  name: string;
  subtitle?: string;
  size: number;
  color: string;
  scale?: number;
  opacity?: number;
  orchestrator?: boolean;
}> = ({ kind, name, subtitle, size, color, scale = 1, opacity = 1, orchestrator = false }) => {
  const ring = size + RING_PAD * 2;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: ring,
          height: ring,
          borderRadius: '50%',
          border: `2px solid ${color}${orchestrator ? 'BB' : '77'}`,
          boxShadow: orchestrator
            ? `0 0 28px ${color}55, 0 0 60px ${color}33, inset 0 0 18px ${color}18`
            : `0 0 18px ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}14`,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: COLORS.canvasSubtle,
            border: `1.5px solid ${color}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {kind === 'claude-svg' ? (
            <svg viewBox="0 0 24 24" fill={color} width={size * 0.52} height={size * 0.52}>
              <path d={SVG_PATHS.claude} />
            </svg>
          ) : kind === 'hubspot-svg' ? (
            <svg viewBox="-2 -2 28 26" fill={color} width={size * 0.52} height={size * 0.52}>
              <path d={SVG_PATHS.hubspot} />
            </svg>
          ) : (
            <span
              style={{
                fontSize: size * 0.48,
                fontWeight: 900,
                color,
                fontFamily: FONTS.mono,
                letterSpacing: -2,
              }}
            >
              A
            </span>
          )}
        </div>
      </div>

      <span
        style={{
          fontSize: orchestrator ? 20 : 17,
          fontWeight: 700,
          color,
          fontFamily: FONTS.mono,
          textAlign: 'center',
        }}
      >
        {name}
      </span>

      {subtitle && (
        <span
          style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            fontFamily: FONTS.mono,
            textAlign: 'center',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};

/* ─── Shared layout pieces ───────────────────────── */

const Headline: React.FC<{ opacity?: number; translateY?: number }> = ({
  opacity = 1,
  translateY = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 80,
      left: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      opacity,
      transform: `translateY(${translateY}px)`,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: ACCENT,
        fontFamily: FONTS.mono,
        letterSpacing: 6,
        padding: '6px 14px',
        borderRadius: 4,
        border: `1px solid ${ACCENT}55`,
        backgroundColor: `${ACCENT}12`,
      }}
    >
      COMING SOON
    </div>
    <div
      style={{
        fontSize: 64,
        fontWeight: 800,
        color: COLORS.textPrimary,
        fontFamily: FONTS.mono,
        textAlign: 'center',
        lineHeight: 1.1,
      }}
    >
      Claude <span style={{ color: ACCENT, textShadow: `0 0 18px ${ACCENT}55` }}>→</span> HubSpot + Apollo
    </div>
    <div
      style={{
        fontSize: 20,
        color: COLORS.textSecondary,
        fontFamily: FONTS.mono,
        letterSpacing: 1,
        textAlign: 'center',
      }}
    >
      One CLI. Two CRMs. Zero swivel-chair.
    </div>
  </div>
);

const FlowLabels: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: 980,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      gap: 110,
      fontFamily: FONTS.mono,
      fontSize: 13,
      letterSpacing: 3,
      color: COLORS.textMuted,
      opacity,
    }}
  >
    <span style={{ color: ACCENT }}>ORCHESTRATOR</span>
    <span>CONNECTORS</span>
  </div>
);

const CtaBlock: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: 1060,
      left: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      opacity,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 32px',
        borderRadius: 10,
        border: `1px solid ${ACCENT}44`,
        backgroundColor: `${ACCENT}0F`,
        fontFamily: FONTS.mono,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: ACCENT,
          boxShadow: `0 0 12px ${ACCENT}`,
        }}
      />
      <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>
        Playbook drops <span style={{ color: ACCENT }}>next week</span>
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 18 }}>
      <span style={{ fontSize: 15, color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
        Shawn | TheGTMOS.ai
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: ACCENT,
          fontFamily: FONTS.mono,
          textShadow: `0 0 16px ${ACCENT}33`,
        }}
      >
        thegtmos.ai
      </span>
    </div>
  </div>
);

const ConnectionLines: React.FC<{
  progress?: [number, number];
  glow?: number;
}> = ({ progress = [1, 1], glow = 0.6 }) => (
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
    {CONNECTION_PATHS.map((d, i) => {
      const p = progress[i];
      if (p <= 0) return null;
      if (p >= 1) {
        return (
          <path
            key={i}
            d={d}
            stroke={ACCENT}
            strokeWidth={2.5}
            fill="none"
            strokeDasharray="10,6"
            opacity={glow}
          />
        );
      }
      const evolved = evolvePath(p, d);
      return (
        <path
          key={i}
          d={d}
          stroke={ACCENT}
          strokeWidth={2.5}
          fill="none"
          opacity={glow}
          style={{
            strokeDasharray: evolved.strokeDasharray,
            strokeDashoffset: evolved.strokeDashoffset,
          }}
        />
      );
    })}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   Static still — drop as a LinkedIn comment today
   ═══════════════════════════════════════════════════════ */

export const ClaudeConnectTeaserStill: React.FC = () => (
  <SceneWrapper accentColor={ACCENT} particleCount={22}>
    <Headline />
    <ConnectionLines progress={[1, 1]} glow={0.55} />

    <div
      style={{
        position: 'absolute',
        left: NODES.claude.x - claudeRingR - 28,
        top: NODES.claude.y - claudeRingR - 28,
        zIndex: 10,
      }}
    >
      <ToolNode
        kind="claude-svg"
        name="Claude Code"
        subtitle="Orchestrator"
        size={CLAUDE_SIZE}
        color={TOOL_COLORS.claude}
        orchestrator
      />
    </div>

    <div
      style={{
        position: 'absolute',
        left: NODES.hubspot.x - targetRingR,
        top: NODES.hubspot.y - targetRingR - 10,
        zIndex: 10,
      }}
    >
      <ToolNode
        kind="hubspot-svg"
        name="HubSpot"
        size={TARGET_SIZE}
        color={TOOL_COLORS.hubspot}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        left: NODES.apollo.x - targetRingR,
        top: NODES.apollo.y - targetRingR - 10,
        zIndex: 10,
      }}
    >
      <ToolNode
        kind="apollo-letter"
        name="Apollo.io"
        size={TARGET_SIZE}
        color={TOOL_COLORS.apollo}
      />
    </div>

    <FlowLabels />
    <CtaBlock />
  </SceneWrapper>
);

/* ═══════════════════════════════════════════════════════
   Animated — 5s loopable, GIF-ready
   ═══════════════════════════════════════════════════════ */

export const CLAUDE_CONNECT_TEASER_FRAMES = 150;

export const ClaudeConnectTeaserAnimated: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = (start: number) => {
    const v = spring({
      frame: Math.max(0, frame - start),
      fps,
      config: { damping: 14, mass: 0.5, stiffness: 140 },
    });
    return { scale: v, opacity: v, translateY: interpolate(v, [0, 1], [18, 0]) };
  };

  const headline = appear(0);
  const claudeIn = appear(12);
  const hubspotIn = appear(50);
  const apolloIn = appear(68);

  const line1 = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [48, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pulse starting at 90 — "data flowing"
  const pulse = interpolate(frame, [90, 105, 120, 135, 149], [1, 1.06, 1, 1.04, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineGlow = interpolate(
    frame,
    [85, 100, 115, 130, 149],
    [0.55, 0.95, 0.6, 0.9, 0.55],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const flowLabelOpacity = interpolate(frame, [85, 105], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulseScale = (base: { scale: number; opacity: number }) => ({
    scale: base.scale * (frame >= 90 ? pulse : 1),
    opacity: base.opacity,
  });

  return (
    <SceneWrapper accentColor={ACCENT} particleCount={22}>
      <Headline opacity={headline.opacity} translateY={headline.translateY} />

      <ConnectionLines progress={[line1, line2]} glow={lineGlow} />

      <div
        style={{
          position: 'absolute',
          left: NODES.claude.x - claudeRingR - 28,
          top: NODES.claude.y - claudeRingR - 28,
          zIndex: 10,
        }}
      >
        <ToolNode
          kind="claude-svg"
          name="Claude Code"
          subtitle="Orchestrator"
          size={CLAUDE_SIZE}
          color={TOOL_COLORS.claude}
          orchestrator
          {...pulseScale(claudeIn)}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: NODES.hubspot.x - targetRingR,
          top: NODES.hubspot.y - targetRingR - 10,
          zIndex: 10,
        }}
      >
        <ToolNode
          kind="hubspot-svg"
          name="HubSpot"
          size={TARGET_SIZE}
          color={TOOL_COLORS.hubspot}
          {...pulseScale(hubspotIn)}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: NODES.apollo.x - targetRingR,
          top: NODES.apollo.y - targetRingR - 10,
          zIndex: 10,
        }}
      >
        <ToolNode
          kind="apollo-letter"
          name="Apollo.io"
          size={TARGET_SIZE}
          color={TOOL_COLORS.apollo}
          {...pulseScale(apolloIn)}
        />
      </div>

      <FlowLabels opacity={flowLabelOpacity} />
      <CtaBlock opacity={ctaOpacity} />
    </SceneWrapper>
  );
};
