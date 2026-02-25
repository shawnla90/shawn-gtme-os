import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { NioReelMascot } from '../../components/NioReelMascot';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import { useReelScale } from '../../lib/useReelScale';
import { SCENES_REEL_3 } from '../../lib/timing-reel';
import { WRAPPER_COSTS } from '../../lib/reel-data';
import { NioReelClip } from '../../NioReelClip';

/* ── Internal Scenes ── */

/** Scene A: Split comparison — wrapper vs direct (20s / 600f) */
const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const leftScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const rightScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={15} scanlineOpacity={0.02}>
      {/* Left panel — Wrapper (red) */}
      <div
        style={{
          position: 'absolute',
          left: s(40),
          top: sv(40),
          width: s(460),
          transform: `scale(${leftScale})`,
        }}
      >
        <CostCard
          title={WRAPPER_COSTS.wrapper.name}
          cost={WRAPPER_COSTS.wrapper.monthly}
          yearly={`$${WRAPPER_COSTS.wrapper.yearly}/yr`}
          items={[...WRAPPER_COSTS.wrapper.items]}
          color={WRAPPER_COSTS.wrapper.color}
          s={s}
          sv={sv}
        />
      </div>

      {/* Right panel — Direct API (green) */}
      <div
        style={{
          position: 'absolute',
          right: s(40),
          top: sv(40),
          width: s(460),
          transform: `scale(${rightScale})`,
        }}
      >
        <CostCard
          title={WRAPPER_COSTS.direct.name}
          cost={WRAPPER_COSTS.direct.monthly}
          yearly={`$${WRAPPER_COSTS.direct.yearly}/yr`}
          items={[...WRAPPER_COSTS.direct.items]}
          color={WRAPPER_COSTS.direct.color}
          s={s}
          sv={sv}
        />
      </div>

      {/* VS divider */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: FONTS.mono,
          fontSize: s(28),
          fontWeight: 800,
          color: COLORS.textMuted,
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        vs
      </div>

      {/* Nio walking across — idle + think as it crosses to the "good" side */}
      <NioReelMascot
        tier={1}
        size={120}
        position="bottom-center"
        enterDelay={180}
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'think', startFrame: 200, loop: true },
          { animation: 'blink', startFrame: 400 },
        ]}
      />

      <Sequence from={200} durationInFrames={30}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Cost comparison card */
const CostCard: React.FC<{
  title: string;
  cost: string;
  yearly: string;
  items: string[];
  color: string;
  s: (v: number) => number;
  sv: (v: number) => number;
}> = ({ title, cost, yearly, items, color, s, sv }) => (
  <div
    style={{
      borderRadius: s(14),
      border: `2px solid ${color}60`,
      backgroundColor: `${color}08`,
      padding: `${sv(20)}px ${s(24)}px`,
    }}
  >
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: s(20),
        fontWeight: 700,
        color,
        marginBottom: sv(8),
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: s(32),
        fontWeight: 800,
        color: COLORS.textPrimary,
      }}
    >
      {cost}
    </div>
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: s(14),
        color: COLORS.textMuted,
        marginBottom: sv(12),
      }}
    >
      {yearly}
    </div>
    {items.map((item) => (
      <div
        key={item}
        style={{
          fontFamily: FONTS.mono,
          fontSize: s(13),
          color: COLORS.textSecondary,
          marginTop: sv(6),
          display: 'flex',
          alignItems: 'center',
          gap: s(8),
        }}
      >
        <span style={{ color, fontSize: s(10) }}>*</span>
        {item}
      </div>
    ))}
  </div>
);

/** Scene B: Flex — savings counter (14s / 420f) */
const Flex: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={25} scanlineOpacity={0.02}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sv(20),
        }}
      >
        {/* Nio celebration — backflips */}
        <NioReelMascot
          tier={1}
          size={200}
          position="center"
          enterDelay={10}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'backflip', startFrame: 30 },
            { animation: 'idle', startFrame: 80, loop: true },
            { animation: 'blink', startFrame: 200 },
            { animation: 'backflip', startFrame: 300 },
          ]}
        />

        {/* Savings counter */}
        <div style={{ textAlign: 'center', marginTop: sv(140) }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(18),
              color: COLORS.textMuted,
              marginBottom: sv(8),
              textTransform: 'uppercase',
              letterSpacing: s(2),
            }}
          >
            yearly savings
          </div>
          <AnimatedCounter
            from={0}
            to={WRAPPER_COSTS.savings}
            startFrame={30}
            durationFrames={120}
            fontSize={s(64)}
            color={COLORS.green}
            prefix="$"
          />
        </div>

        {/* Green glow pulse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, ${COLORS.green}15, transparent 60%)`,
            opacity: 0.5 + Math.sin(frame * 0.1) * 0.2,
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      <Sequence from={30} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Scene C: CTA (12s / 360f) */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const textScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const fadeOut = interpolate(frame, [290, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={10} scanlineOpacity={0.02}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sv(24),
          opacity: fadeOut,
        }}
      >
        <div style={{ transform: `scale(${textScale})`, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(30),
              fontWeight: 700,
              color: COLORS.textPrimary,
            }}
          >
            skip the wrapper
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(20),
              color: COLORS.green,
              marginTop: sv(16),
            }}
          >
            shawnos.ai/blog
          </div>
        </div>

        <NioReelMascot
          tier={1}
          size={120}
          position="bottom-center"
          enterDelay={15}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'blink', startFrame: 120 },
          ]}
        />
      </AbsoluteFill>

      <Sequence from={10} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Exported Composition ── */

export const ReelApiWrappers: React.FC = () => (
  <NioReelClip
    totalFrames={
      SCENES_REEL_3.split + SCENES_REEL_3.flex + SCENES_REEL_3.cta - 2 * 8
    }
    scenes={[
      { component: Split, durationInFrames: SCENES_REEL_3.split },
      { component: Flex, durationInFrames: SCENES_REEL_3.flex },
      { component: Cta, durationInFrames: SCENES_REEL_3.cta },
    ]}
  />
);
