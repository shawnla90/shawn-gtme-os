import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { ParticleField } from '../components/ParticleField';

/**
 * Scene 1 — Hook (90 frames / ~3s including transition overlap)
 * Immediate stat punch. No cursor-wait dead time.
 * Frame 0: "190+" springs in immediately
 * Frame 10: subtitle snaps in
 * Frame 25: subtitle text swaps to topic categories
 * Frame 60-75: starts fading (TransitionSeries handles this)
 */
export const HookV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Immediate spring-in of "190+" (frame 0, no delay) ---
  const numberScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 250 },
  });

  // --- Subtitle snap in (frame 10) ---
  const subtitleOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Subtitle text swap at frame 25 ---
  const showCategories = frame >= 25;
  const categoryOpacity = interpolate(frame, [25, 33], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const firstSubtitleOpacity = showCategories
    ? interpolate(frame, [23, 28], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : subtitleOpacity;

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
      {/* Ambient particle background */}
      <ParticleField count={30} opacity={0.4} speed={0.006} />

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
          gap: 20,
          zIndex: 10,
        }}
      >
        {/* Big stat number */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.textPrimary,
            transform: `scale(${numberScale})`,
            transformOrigin: 'center center',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          190+
        </div>

        {/* First subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.green,
            opacity: firstSubtitleOpacity,
            textAlign: 'center',
            letterSpacing: 0.5,
          }}
        >
          free knowledge entries
        </div>

        {/* Category swap subtitle */}
        {showCategories && (
          <div
            style={{
              fontSize: 20,
              color: COLORS.textSecondary,
              opacity: categoryOpacity,
              textAlign: 'center',
              letterSpacing: 1,
              marginTop: -8,
            }}
          >
            Clay · Context Engineering · Claude Code · GTM
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
