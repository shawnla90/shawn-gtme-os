import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';
import { TypewriterText } from '../components/TypewriterText';
import { MatrixRain } from '../components/MatrixRain';

/**
 * Scene 6 — CTA (240 frames / 8s)
 * One URL, clean exit, memorable.
 */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Subtitle fade (frames 90-120) ---
  const subtitleOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Matrix rain background fade (frames 150-180) ---
  const matrixOpacity = interpolate(frame, [150, 180], [0, 0.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Blinking cursor for hold phase (frames 130+) ---
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;
  const showCursorBlink = frame >= 90;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Matrix rain background — subtle, atmospheric */}
      {frame >= 150 && (
        <MatrixRain opacity={matrixOpacity} color={COLORS.green} columns={25} speed={0.6} />
      )}

      {/* Content layer */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Main URL — typed slowly */}
        {frame >= 30 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TypewriterText
              text="shawnos.ai"
              startFrame={30}
              speed={0.3}
              color={COLORS.green}
              fontSize={64}
              showCursor={true}
              cursorColor={COLORS.green}
            />
          </div>
        )}

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: COLORS.textSecondary,
            opacity: subtitleOpacity,
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          Free. Open. Updated daily.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
