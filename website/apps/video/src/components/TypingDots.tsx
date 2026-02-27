import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../lib/tokens';
import { useScale } from '../lib/useScale';

interface TypingDotsProps {
  /** Frame at which dots appear */
  appearFrame?: number;
  /** How many frames the dots are visible */
  durationFrames?: number;
}

export const TypingDots: React.FC<TypingDotsProps> = ({
  appearFrame = 0,
  durationFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { s } = useScale();

  const localFrame = frame - appearFrame;
  if (localFrame < 0 || localFrame > durationFrames) return null;

  const fadeIn = interpolate(localFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        opacity: fadeIn,
        marginBottom: s(12),
      }}
    >
      <div
        style={{
          padding: `${s(12)}px ${s(18)}px`,
          borderRadius: s(14),
          borderTopLeftRadius: s(4),
          backgroundColor: COLORS.canvasSubtle,
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          gap: s(6),
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => {
          // Staggered bounce: each dot offset by 0.2s
          const bounce = Math.sin(((localFrame / 30) * Math.PI * 3) - i * 1.2);
          const y = Math.max(0, bounce) * -s(6);

          return (
            <div
              key={i}
              style={{
                width: s(8),
                height: s(8),
                borderRadius: '50%',
                backgroundColor: COLORS.textSecondary,
                transform: `translateY(${y}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
