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
import { AUDIO, VOLUMES } from '../lib/sounds';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

interface SiteHookProps {
  totalEntries: number;
  subtitle: string;
  growingText?: string;
  accentColor?: string;
}

/**
 * Generic Hook scene — big stat punch.
 * Frame 0: count springs in
 * Frame 3: subtitle snaps in
 * Frame 7: "and growing" fades in
 */
export const SiteHook: React.FC<SiteHookProps> = ({
  totalEntries,
  subtitle,
  growingText = 'and growing',
  accentColor = COLORS.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  const displayCount = `${Math.floor(totalEntries / 10) * 10}+`;

  const numberScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 280 },
  });

  const subtitleOpacity = interpolate(frame, [3, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const growingOpacity = interpolate(frame, [7, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={accentColor} particleCount={30}>
      <Sequence from={0} durationInFrames={10}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep} />
      </Sequence>

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
            textShadow: `0 0 ${s(30)}px ${accentColor}44, 0 0 ${s(60)}px ${accentColor}22`,
          }}
        >
          {displayCount}
        </div>

        <div
          style={{
            fontSize: s(28),
            fontWeight: 600,
            color: accentColor,
            opacity: subtitleOpacity,
            textAlign: 'center',
            letterSpacing: 0.5,
            textShadow: `0 0 ${s(20)}px ${accentColor}33`,
          }}
        >
          {subtitle}
        </div>

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
          {growingText}
        </div>
      </div>
    </SceneWrapper>
  );
};
