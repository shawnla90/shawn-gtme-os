import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, Audio, Sequence } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { TypewriterText } from '../../components/TypewriterText';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import type { RoiVideoData } from '../../lib/roi-schema';
import { computeRoiFunnel } from '../../lib/roi-schema';

interface Props {
  data: RoiVideoData;
}

export const RoiHook: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const s = (v: number) => (v * width) / 1920;
  const sv = (v: number) => (v * height) / 1080;

  const funnel = computeRoiFunnel(data);
  const annualCost = `$${Math.round(funnel.annualAgencyCost / 1000)}K/yr`;
  const replyPct = `${(data.baseline.replyRate * 100).toFixed(1)}% reply`;
  const dealCount = `${funnel.baseline.deals} deal${funnel.baseline.deals !== 1 ? 's' : ''}`;

  const pills = [
    { label: annualCost, delay: 35 },
    { label: replyPct, delay: 45 },
    { label: dealCount, delay: 55 },
  ];

  return (
    <SceneWrapper accentColor={COLORS.trafficRed} particleCount={15} scanlineOpacity={0.02}>
      {/* Question */}
      <div style={{ position: 'absolute', top: sv(280), width: '100%', textAlign: 'center' }}>
        <TypewriterText
          text="what's your outbound actually returning?"
          startFrame={5}
          speed={0.6}
          fontSize={s(38)}
          color={COLORS.textPrimary}
          cursorColor={COLORS.trafficRed}
        />
      </div>

      {/* Stat pills */}
      <div
        style={{
          position: 'absolute',
          top: sv(520),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(32),
        }}
      >
        {pills.map((pill) => {
          const pillScale = spring({
            frame: Math.max(0, frame - pill.delay),
            fps,
            config: { damping: 10, stiffness: 160 },
          });

          return (
            <div
              key={pill.label}
              style={{
                transform: `scale(${pillScale})`,
                padding: `${sv(14)}px ${s(28)}px`,
                borderRadius: s(12),
                border: `2px solid ${COLORS.trafficRed}`,
                backgroundColor: `${COLORS.trafficRed}15`,
                fontFamily: FONTS.mono,
                fontSize: s(24),
                fontWeight: 700,
                color: COLORS.trafficRed,
              }}
            >
              {pill.label}
            </div>
          );
        })}
      </div>

      {/* Boot beep on pill entrance */}
      <Sequence from={35} durationInFrames={30}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};
