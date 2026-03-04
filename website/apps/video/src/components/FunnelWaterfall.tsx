import React, { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AnimatedCounter } from './AnimatedCounter';
import { COLORS, FONTS } from '../lib/tokens';

export interface FunnelStage {
  label: string;
  leftValue: number;
  rightValue: number;
  prefix?: string;
  suffix?: string;
}

interface FunnelWaterfallProps {
  leftHeader: string;
  rightHeader: string;
  stages: FunnelStage[];
  stageFrames?: number;
}

export const FunnelWaterfall: React.FC<FunnelWaterfallProps> = ({
  leftHeader,
  rightHeader,
  stages,
  stageFrames = 45,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const s = (v: number) => (v * width) / 1920;
  const sv = (v: number) => (v * height) / 1080;

  // Find max value across all stages for proportional bar widths
  const maxValue = Math.max(...stages.flatMap((st) => [st.leftValue, st.rightValue]));

  // Header fade
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const funnelWidth = s(1500);
  const halfWidth = funnelWidth * 0.42;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.mono,
      }}
    >
      {/* Headers */}
      <div
        style={{
          display: 'flex',
          width: funnelWidth,
          justifyContent: 'space-between',
          marginBottom: sv(40),
          opacity: headerOpacity,
        }}
      >
        <div style={funnelHeaderStyle(s, COLORS.trafficRed, halfWidth)}>{leftHeader}</div>
        <div style={funnelHeaderStyle(s, COLORS.green, halfWidth)}>{rightHeader}</div>
      </div>

      {/* Stages */}
      {stages.map((stage, i) => {
        const stageDelay = 20 + i * stageFrames;
        const stageOpacity = interpolate(frame, [stageDelay, stageDelay + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const leftBarPct = maxValue > 0 ? stage.leftValue / maxValue : 0;
        const rightBarPct = maxValue > 0 ? stage.rightValue / maxValue : 0;

        // Bar width animates in
        const leftBarWidth = interpolate(
          frame,
          [stageDelay + 5, stageDelay + 35],
          [0, leftBarPct * 100],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const rightBarWidth = interpolate(
          frame,
          [stageDelay + 5, stageDelay + 35],
          [0, rightBarPct * 100],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const rightIsLarger = stage.rightValue > stage.leftValue * 1.5;

        return (
          <div
            key={stage.label}
            style={{
              display: 'flex',
              width: funnelWidth,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: sv(24),
              opacity: stageOpacity,
            }}
          >
            {/* Left side */}
            <div style={{ width: halfWidth }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(12) }}>
                {/* Bar grows from right to left */}
                <div style={barContainerStyle(sv)}>
                  <div
                    style={{
                      ...barStyle(COLORS.trafficRed, sv),
                      width: `${leftBarWidth}%`,
                      marginLeft: 'auto',
                    }}
                  />
                </div>
                <AnimatedCounter
                  to={stage.leftValue}
                  startFrame={stageDelay + 5}
                  durationFrames={30}
                  fontSize={s(26)}
                  color={COLORS.trafficRed}
                  prefix={stage.prefix}
                  suffix={stage.suffix}
                />
              </div>
            </div>

            {/* Center label */}
            <div style={stageLabelStyle(s)}>{stage.label}</div>

            {/* Right side */}
            <div style={{ width: halfWidth }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(12) }}>
                <AnimatedCounter
                  to={stage.rightValue}
                  startFrame={stageDelay + 5}
                  durationFrames={30}
                  fontSize={s(26)}
                  color={COLORS.green}
                  prefix={stage.prefix}
                  suffix={stage.suffix}
                />
                <div style={barContainerStyle(sv)}>
                  <div
                    style={{
                      ...barStyle(COLORS.green, sv),
                      width: `${rightBarWidth}%`,
                      boxShadow: rightIsLarger ? `0 0 ${s(10)}px ${COLORS.green}50` : undefined,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Style helpers ── */

const funnelHeaderStyle = (
  s: (v: number) => number,
  color: string,
  width: number,
): CSSProperties => ({
  width,
  textAlign: 'center',
  fontSize: s(24),
  fontWeight: 700,
  color,
  textTransform: 'uppercase',
  letterSpacing: s(2),
});

const barContainerStyle = (sv: (v: number) => number): CSSProperties => ({
  flex: 1,
  height: sv(14),
  borderRadius: sv(7),
  backgroundColor: `${COLORS.border}40`,
  overflow: 'hidden',
});

const barStyle = (color: string, sv: (v: number) => number): CSSProperties => ({
  height: '100%',
  backgroundColor: color,
  borderRadius: sv(7),
  transition: 'none',
});

const stageLabelStyle = (s: (v: number) => number): CSSProperties => ({
  fontSize: s(16),
  color: COLORS.textMuted,
  textAlign: 'center',
  minWidth: s(120),
  textTransform: 'lowercase',
});
