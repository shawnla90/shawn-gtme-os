import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, Audio, Sequence } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import type { RoiVideoData } from '../../lib/roi-schema';
import { computeRoiFunnel } from '../../lib/roi-schema';

interface Props {
  data: RoiVideoData;
}

export const RoiDelta: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const s = (v: number) => (v * width) / 1920;
  const sv = (v: number) => (v * height) / 1080;

  const funnel = computeRoiFunnel(data);
  const deltaK = Math.round(funnel.delta.revenue / 1000);

  const subStats = [
    { label: `+${funnel.delta.replyPctIncrease}% replies`, delay: 50 },
    { label: `+${funnel.delta.extraDeals} deals`, delay: 60 },
    { label: `+${funnel.delta.extraMeetings} meetings`, delay: 70 },
  ];

  // "What you keep" comparison
  const keepDelay = 100;
  const keepSpring = spring({
    frame: Math.max(0, frame - keepDelay),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={30} scanlineOpacity={0.02}>
      {/* Big delta counter */}
      <div
        style={{
          position: 'absolute',
          top: sv(200),
          width: '100%',
          textAlign: 'center',
        }}
      >
        <AnimatedCounter
          to={deltaK}
          startFrame={10}
          durationFrames={50}
          fontSize={s(120)}
          color={COLORS.green}
          prefix="+$"
          suffix="K"
        />
      </div>

      {/* Sub-stats */}
      <div
        style={{
          position: 'absolute',
          top: sv(480),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(40),
        }}
      >
        {subStats.map((stat) => {
          const statScale = spring({
            frame: Math.max(0, frame - stat.delay),
            fps,
            config: { damping: 10, stiffness: 160 },
          });

          return (
            <div
              key={stat.label}
              style={{
                transform: `scale(${statScale})`,
                fontFamily: FONTS.mono,
                fontSize: s(22),
                fontWeight: 600,
                color: COLORS.green,
                padding: `${sv(10)}px ${s(20)}px`,
                borderRadius: s(8),
                backgroundColor: `${COLORS.green}12`,
                border: `1px solid ${COLORS.green}30`,
              }}
            >
              {stat.label}
            </div>
          );
        })}
      </div>

      {/* "What you keep" comparison */}
      <div
        style={{
          position: 'absolute',
          top: sv(640),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(80),
          opacity: keepSpring,
          transform: `translateY(${(1 - keepSpring) * 15}px)`,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={keepLabelStyle(s)}>{data.baseline.label}</div>
          <div style={keepValueStyle(s, COLORS.trafficRed)}>you keep nothing</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={keepLabelStyle(s)}>GTMe OS</div>
          <div style={keepValueStyle(s, COLORS.green)}>you keep everything</div>
        </div>
      </div>

      {/* Level up SFX */}
      <Sequence from={10} durationInFrames={60}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

const keepLabelStyle = (s: (v: number) => number): React.CSSProperties => ({
  fontFamily: FONTS.mono,
  fontSize: s(16),
  color: COLORS.textMuted,
  marginBottom: s(8),
  textTransform: 'uppercase',
  letterSpacing: s(1),
});

const keepValueStyle = (s: (v: number) => number, color: string): React.CSSProperties => ({
  fontFamily: FONTS.mono,
  fontSize: s(20),
  fontWeight: 700,
  color,
});
