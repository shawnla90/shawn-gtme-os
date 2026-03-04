import React, { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';

export interface ComparisonRow {
  label: string;
  left: string;
  right: string;
  showBar?: boolean;
  barLeftPct?: number;
  barRightPct?: number;
}

interface ComparisonTableProps {
  leftHeader: string;
  rightHeader: string;
  rows: ComparisonRow[];
  staggerFrames?: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  leftHeader,
  rightHeader,
  rows,
  staggerFrames = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const s = (v: number) => (v * width) / 1920;
  const sv = (v: number) => (v * height) / 1080;

  // Header fade in
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Divider line grows down
  const dividerHeight = interpolate(frame, [10, 40], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tableWidth = s(1400);
  const colWidth = tableWidth * 0.38;
  const labelWidth = tableWidth * 0.24;

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
          width: tableWidth,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: sv(32),
          opacity: headerOpacity,
        }}
      >
        <div style={headerStyle(s, COLORS.trafficRed, colWidth)}>{leftHeader}</div>
        <div style={{ width: labelWidth }} />
        <div style={headerStyle(s, COLORS.green, colWidth)}>{rightHeader}</div>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          width: 1,
          height: `${dividerHeight}%`,
          maxHeight: '70%',
          backgroundColor: COLORS.border,
          opacity: 0.5,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Rows */}
      {rows.map((row, i) => {
        const rowDelay = 30 + i * staggerFrames;
        const rowSpring = spring({
          frame: Math.max(0, frame - rowDelay),
          fps,
          config: { damping: 12, stiffness: 120 },
        });

        const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={row.label}
            style={{
              display: 'flex',
              width: tableWidth,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: sv(20),
              opacity: rowOpacity,
              transform: `translateY(${(1 - rowSpring) * 20}px)`,
            }}
          >
            {/* Left value */}
            <div style={{ width: colWidth, textAlign: 'center' }}>
              <div style={valueStyle(s, COLORS.trafficRed, 0.7)}>{row.left}</div>
              {row.showBar && row.barLeftPct !== undefined && (
                <BarIndicator
                  pct={row.barLeftPct}
                  color={COLORS.trafficRed}
                  delay={rowDelay + 15}
                  s={s}
                  sv={sv}
                />
              )}
            </div>

            {/* Label */}
            <div style={labelStyle(s)}>{row.label}</div>

            {/* Right value */}
            <div style={{ width: colWidth, textAlign: 'center' }}>
              <div style={valueStyle(s, COLORS.green, 1)}>{row.right}</div>
              {row.showBar && row.barRightPct !== undefined && (
                <BarIndicator
                  pct={row.barRightPct}
                  color={COLORS.green}
                  delay={rowDelay + 15}
                  s={s}
                  sv={sv}
                  glow
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Bar sub-component ── */

const BarIndicator: React.FC<{
  pct: number;
  color: string;
  delay: number;
  s: (v: number) => number;
  sv: (v: number) => number;
  glow?: boolean;
}> = ({ pct, color, delay, s, sv, glow }) => {
  const frame = useCurrentFrame();
  const barWidth = interpolate(frame, [delay, delay + 30], [0, pct * 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        height: sv(8),
        borderRadius: s(4),
        backgroundColor: `${color}30`,
        marginTop: sv(6),
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${barWidth}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: s(4),
          boxShadow: glow ? `0 0 ${s(12)}px ${color}60` : undefined,
        }}
      />
    </div>
  );
};

/* ── Style helpers ── */

const headerStyle = (s: (v: number) => number, color: string, width: number): CSSProperties => ({
  width,
  textAlign: 'center',
  fontSize: s(28),
  fontWeight: 700,
  color,
  textTransform: 'uppercase',
  letterSpacing: s(2),
});

const labelStyle = (s: (v: number) => number): CSSProperties => ({
  fontSize: s(18),
  color: COLORS.textSecondary,
  textAlign: 'center',
  textTransform: 'lowercase',
});

const valueStyle = (
  s: (v: number) => number,
  color: string,
  opacity: number,
): CSSProperties => ({
  fontSize: s(24),
  fontWeight: 600,
  color,
  opacity,
});
