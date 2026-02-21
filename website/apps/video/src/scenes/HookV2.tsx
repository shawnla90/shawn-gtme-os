import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS } from '../lib/tokens';
import { TOTAL_ENTRIES } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

/**
 * Scene 1 — Hook (36 frames / 1.2s)
 * Immediate stat punch. Snappy — everything lands fast.
 * Frame 0: count springs in
 * Frame 3: subtitle snaps in
 * Frame 7: "and growing" fades in
 */
export const HookV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  // Dynamic count — rounds down to nearest 10
  const displayCount = `${Math.floor(TOTAL_ENTRIES / 10) * 10}+`;

  // --- Immediate spring-in of count (frame 0) ---
  const numberScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 280 },
  });

  // --- Subtitle snap in (frame 3) ---
  const subtitleOpacity = interpolate(frame, [3, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- "and growing" fade in (frame 7) ---
  const growingOpacity = interpolate(frame, [7, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={30}>
      {/* Boot beep SFX at frame 0 */}
      <Sequence from={0} durationInFrames={10}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep} />
      </Sequence>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: s(12),
        }}
      >
        {/* Big stat number */}
        <div
          style={{
            fontSize: s(96),
            fontWeight: 800,
            color: COLORS.textPrimary,
            transform: `scale(${numberScale})`,
            transformOrigin: 'center center',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: s(-3),
            textShadow: `0 0 ${s(30)}px ${COLORS.green}44, 0 0 ${s(60)}px ${COLORS.green}22`,
          }}
        >
          {displayCount}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: s(28),
            fontWeight: 600,
            color: COLORS.green,
            opacity: subtitleOpacity,
            textAlign: 'center',
            letterSpacing: 0.5,
            textShadow: `0 0 ${s(20)}px ${COLORS.green}33`,
          }}
        >
          free wiki pages, guides & terms
        </div>

        {/* "and growing" tag */}
        <div
          style={{
            fontSize: s(18),
            fontWeight: 500,
            color: COLORS.textMuted,
            opacity: growingOpacity,
            textAlign: 'center',
            letterSpacing: s(2),
            textTransform: 'uppercase',
          }}
        >
          and growing
        </div>
      </div>
    </SceneWrapper>
  );
};
