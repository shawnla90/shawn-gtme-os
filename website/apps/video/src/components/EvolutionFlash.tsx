import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { useReelScale } from '../lib/useReelScale';
import { TypewriterText } from './TypewriterText';

interface EvolutionFlashProps {
  /** Frame within this scene when the flash triggers */
  flashFrame?: number;
  accentColor?: string;
  levelUpText?: string;
}

/**
 * Evolution flash effect — expanding ring + white flash + "LEVEL UP" text.
 * Reuses pattern from NioGraphComplete.tsx (ring pulse + flash overlay).
 */
export const EvolutionFlash: React.FC<EvolutionFlashProps> = ({
  flashFrame = 0,
  accentColor = COLORS.nioBlue,
  levelUpText = 'LEVEL UP',
}) => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const rf = frame - flashFrame;
  if (rf < 0) return null;

  // Expanding ring pulse
  const pulseProgress = interpolate(rf, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringRadius = pulseProgress * sv(400);
  const ringOpacity = interpolate(pulseProgress, [0, 0.3, 1], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // White flash overlay
  const flashOpacity = interpolate(rf, [5, 12, 25], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Post-flash glow
  const postGlow = interpolate(rf, [25, 45], [0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Level up text appears after flash
  const textOpacity = interpolate(rf, [30, 40, 80, 100], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textScale = interpolate(rf, [30, 45], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 40 }}>
      {/* SFX */}
      <Sequence from={flashFrame + 2} durationInFrames={60}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {/* Expanding ring */}
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
          border: `3px solid ${accentColor}`,
          opacity: ringOpacity,
          boxShadow: `0 0 ${s(30)}px ${accentColor}40`,
        }}
      />

      {/* Second ring (staggered) */}
      {rf >= 6 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: Math.max(0, ringRadius * 2 - sv(80)),
            height: Math.max(0, ringRadius * 2 - sv(80)),
            marginLeft: -Math.max(0, ringRadius - sv(40)),
            marginTop: -Math.max(0, ringRadius - sv(40)),
            borderRadius: '50%',
            border: `2px solid ${accentColor}`,
            opacity: ringOpacity * 0.5,
          }}
        />
      )}

      {/* White flash */}
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

      {/* Post-flash glow */}
      {postGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, ${accentColor}30, transparent 60%)`,
            opacity: postGlow,
            zIndex: 49,
          }}
        />
      )}

      {/* LEVEL UP text */}
      {textOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            width: '100%',
            textAlign: 'center',
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            zIndex: 51,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: s(48),
            fontWeight: 800,
            color: accentColor,
            textShadow: `0 0 ${s(20)}px ${accentColor}80`,
            letterSpacing: s(6),
          }}
        >
          {levelUpText}
        </div>
      )}
    </AbsoluteFill>
  );
};
