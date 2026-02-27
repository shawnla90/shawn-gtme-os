import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { SceneWrapper } from '../components/SceneWrapper';
import { TypewriterText } from '../components/TypewriterText';
import { COLORS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { useScale } from '../lib/useScale';

/**
 * Scene 5: CTA — 120f / 4s
 *
 * "Meet Nio" typewriter large text.
 * "Your AI ops layer" subtitle fade.
 * URL fade in, everything fades to black.
 */

const TEXT_START = 5;
const SUBTITLE_START = 40;
const URL_START = 65;
const FADE_OUT_START = 95;

export const NioCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [SUBTITLE_START, SUBTITLE_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL fade
  const urlOpacity = interpolate(frame, [URL_START, URL_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Everything fades to black at the end
  const fadeOut = interpolate(frame, [FADE_OUT_START, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper
      accentColor={COLORS.nioBlue}
      particleCount={12}
      scanlineOpacity={0.01}
    >
      {/* Resolve SFX */}
      <Sequence from={5} durationInFrames={60}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve} />
      </Sequence>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sv(20),
        }}
      >
        {/* "Meet Nio" */}
        <TypewriterText
          text="Meet Nio"
          startFrame={TEXT_START}
          speed={0.25}
          fontSize={s(56)}
          color={COLORS.textPrimary}
          cursorColor={COLORS.nioBlue}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: s(20),
            color: COLORS.textSecondary,
          }}
        >
          Your AI ops layer
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontSize: s(16),
            color: COLORS.nioBlue,
            marginTop: sv(20),
          }}
        >
          shawnos.ai/nio
        </div>
      </AbsoluteFill>

      {/* Fade to black */}
      {fadeOut > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.canvas,
            opacity: fadeOut,
            zIndex: 100,
          }}
        />
      )}
    </SceneWrapper>
  );
};
