import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { SceneWrapper } from '../components/SceneWrapper';
import { TypewriterText } from '../components/TypewriterText';
import { COLORS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { useScale } from '../lib/useScale';

/**
 * Scene 3: Graph Complete + Flash — 105f / 3.5s
 *
 * Energy pulse ripples outward from center.
 * White flash, graph fades/scales back.
 * "Knowledge loaded." typewriter text.
 */

const PULSE_START = 0;
const FLASH_START = 15;
const FLASH_PEAK = 22;
const FLASH_END = 35;
const TEXT_START = 45;

export const NioGraphComplete: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Expanding ring pulse from center
  const pulseProgress = interpolate(frame, [PULSE_START, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringRadius = pulseProgress * sv(500);
  const ringOpacity = interpolate(pulseProgress, [0, 0.3, 1], [0, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // White flash overlay
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_PEAK, FLASH_END],
    [0, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Post-flash dim
  const postFlashDim = interpolate(frame, [FLASH_END, FLASH_END + 15], [0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper
      accentColor={COLORS.nioBlue}
      particleCount={10}
      scanlineOpacity={0.02}
    >
      {/* Level up SFX */}
      <Sequence from={5} durationInFrames={60}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      <AbsoluteFill>
        {/* Expanding energy ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ringRadius * 2,
            height: ringRadius * 2,
            marginLeft: -ringRadius,
            marginTop: -ringRadius,
            borderRadius: '50%',
            border: `3px solid ${COLORS.nioBlue}`,
            opacity: ringOpacity,
            boxShadow: `0 0 ${s(30)}px ${COLORS.nioBlue}40, inset 0 0 ${s(30)}px ${COLORS.nioBlue}20`,
            pointerEvents: 'none',
          }}
        />

        {/* Second ring (staggered) */}
        {frame >= 8 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: Math.max(0, ringRadius * 2 - sv(100)),
              height: Math.max(0, ringRadius * 2 - sv(100)),
              marginLeft: -Math.max(0, ringRadius - sv(50)),
              marginTop: -Math.max(0, ringRadius - sv(50)),
              borderRadius: '50%',
              border: `2px solid ${COLORS.nioBlue}`,
              opacity: ringOpacity * 0.5,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* White flash overlay */}
        {flashOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'white',
              opacity: flashOpacity,
              zIndex: 50,
            }}
          />
        )}

        {/* Post-flash subtle blue glow */}
        {postFlashDim > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at center, ${COLORS.nioBlue}20, transparent 60%)`,
              opacity: postFlashDim,
              zIndex: 49,
            }}
          />
        )}

        {/* "Knowledge loaded." typewriter text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            width: '100%',
            textAlign: 'center',
            transform: 'translateY(-50%)',
            zIndex: 51,
          }}
        >
          <TypewriterText
            text="Knowledge loaded."
            startFrame={TEXT_START}
            speed={0.4}
            fontSize={s(32)}
            color={COLORS.textPrimary}
            cursorColor={COLORS.nioBlue}
          />
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};
