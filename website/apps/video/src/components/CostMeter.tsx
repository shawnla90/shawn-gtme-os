import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useReelScale } from '../lib/useReelScale';

interface CostMeterProps {
  from?: number;
  to?: number;
  startFrame?: number;
  drainFrames?: number;
  /** Position from right edge */
  rightOffset?: number;
}

/**
 * Vertical cost meter — drains from $1000→$0 with color transitions.
 * Green at top, amber at mid, red at bottom.
 */
export const CostMeter: React.FC<CostMeterProps> = ({
  from = 1000,
  to = 0,
  startFrame = 0,
  drainFrames = 540,
  rightOffset = 60,
}) => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const meterHeight = sv(500);
  const meterWidth = s(50);

  // Current cost value
  const currentCost = interpolate(
    frame,
    [startFrame, startFrame + drainFrames],
    [from, to],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Fill percentage (1 = full, 0 = empty)
  const fillPct = (currentCost - to) / (from - to);

  // Color transition: green → amber → red
  const meterColor = fillPct > 0.5
    ? COLORS.trafficGreen
    : fillPct > 0.2
      ? COLORS.trafficYellow
      : COLORS.trafficRed;

  // Entrance fade
  const enterOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse when low
  const lowPulse = fillPct < 0.2
    ? 1 + Math.sin(frame * 0.4) * 0.03
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        right: s(rightOffset),
        top: '50%',
        transform: `translateY(-50%) scale(${lowPulse})`,
        opacity: enterOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: sv(12),
      }}
    >
      {/* Dollar label */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: s(28),
          fontWeight: 700,
          color: meterColor,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        ${Math.round(currentCost)}
      </div>

      {/* Meter track */}
      <div
        style={{
          width: meterWidth,
          height: meterHeight,
          borderRadius: s(8),
          border: `2px solid ${COLORS.border}`,
          backgroundColor: COLORS.canvasSubtle,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fill bar (grows from bottom) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${fillPct * 100}%`,
            backgroundColor: meterColor,
            borderRadius: s(6),
            transition: 'background-color 0.3s',
            boxShadow: `0 0 ${s(12)}px ${meterColor}60`,
          }}
        />

        {/* Milestone ticks */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <div
            key={pct}
            style={{
              position: 'absolute',
              bottom: `${pct * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: COLORS.border,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* "API costs" label */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: s(11),
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: s(1),
        }}
      >
        API costs
      </div>
    </div>
  );
};
