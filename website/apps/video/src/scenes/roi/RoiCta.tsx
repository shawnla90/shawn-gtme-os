import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Audio, Sequence } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { TypewriterText } from '../../components/TypewriterText';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import type { RoiVideoData } from '../../lib/roi-schema';

interface Props {
  data: RoiVideoData;
}

export const RoiCta: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const s = (v: number) => (v * width) / 1920;
  const sv = (v: number) => (v * height) / 1080;

  // Fade out at end
  const fadeOut = interpolate(frame, [110, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={10} scanlineOpacity={0.02}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sv(32),
          opacity: fadeOut,
        }}
      >
        {/* Main CTA line */}
        <TypewriterText
          text={data.cta.line}
          startFrame={8}
          speed={0.5}
          fontSize={s(36)}
          color={COLORS.textPrimary}
          cursorColor={COLORS.green}
        />

        {/* Subtitle */}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(20),
            color: COLORS.textSecondary,
            opacity: interpolate(frame, [60, 75], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {data.cta.subtitle}
        </div>
      </div>

      {/* Resolve SFX */}
      <Sequence from={8} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};
