import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';

/**
 * Scene 1 — Hook (90 frames / 3s)
 * Stop the scroll. Bold stat + specificity creates curiosity.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Blinking cursor (frames 0-30) ---
  const cursorOnly = frame < 30;
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  // --- Bold text SLAM (frames 30-90) ---
  const textScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const textVisible = frame >= 30;

  // --- Subtitle fade (frames 45-90) ---
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.mono,
      }}
    >
      {/* Blinking cursor before text appears */}
      {cursorOnly && (
        <div
          style={{
            width: 28,
            height: 48,
            backgroundColor: COLORS.green,
            opacity: cursorBlink ? 1 : 0,
            borderRadius: 2,
          }}
        />
      )}

      {/* Main headline */}
      {textVisible && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.textPrimary,
              transform: `scale(${textScale})`,
              transformOrigin: 'center center',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: -1,
            }}
          >
            190+ free knowledge entries
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              color: COLORS.textSecondary,
              opacity: subtitleOpacity,
              textAlign: 'center',
              letterSpacing: 0.5,
            }}
          >
            Clay. Context Engineering. Claude Code. GTM.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
