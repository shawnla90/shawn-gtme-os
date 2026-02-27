import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useReelScale } from '../lib/useReelScale';

interface XpBarProps {
  from?: number;
  to: number;
  max: number;
  tierLabel: string;
  tierColor?: string;
  startFrame?: number;
  fillFrames?: number;
  width?: number;
}

/**
 * Horizontal XP bar with animated fill and tier label.
 */
export const XpBar: React.FC<XpBarProps> = ({
  from = 0,
  to,
  max,
  tierLabel,
  tierColor = COLORS.nioBlue,
  startFrame = 0,
  fillFrames = 60,
  width = 500,
}) => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const barWidth = s(width);
  const barHeight = sv(28);

  const currentXp = interpolate(
    frame,
    [startFrame, startFrame + fillFrames],
    [from, to],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const fillPct = Math.min(currentXp / max, 1);

  // Glow when near full
  const glowIntensity = fillPct > 0.8 ? s(15) : s(6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sv(8) }}>
      {/* Tier label */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: s(16),
          color: tierColor,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: s(2),
        }}
      >
        {tierLabel}
      </div>

      {/* Bar track */}
      <div
        style={{
          width: barWidth,
          height: barHeight,
          borderRadius: s(14),
          border: `2px solid ${COLORS.border}`,
          backgroundColor: COLORS.canvasSubtle,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${fillPct * 100}%`,
            background: `linear-gradient(90deg, ${tierColor}CC, ${tierColor})`,
            borderRadius: s(12),
            boxShadow: `0 0 ${glowIntensity}px ${tierColor}80`,
          }}
        />
      </div>

      {/* XP count */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: s(14),
          color: COLORS.textSecondary,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(currentXp)} / {max} XP
      </div>
    </div>
  );
};
