import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { NioReelMascot } from '../../components/NioReelMascot';
import { CostMeter } from '../../components/CostMeter';
import { TypewriterText } from '../../components/TypewriterText';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import { useReelScale } from '../../lib/useReelScale';
import { SCENES_REEL_1 } from '../../lib/timing-reel';
import { MAX_PLAN } from '../../lib/reel-data';
import { NioReelClip } from '../../NioReelClip';
import type { AnimationCue } from '../../lib/nio-animation-state';

/* ── Internal Scenes ── */

/** Scene A: Intro — Nio idle + cost meter appears (6s / 180f) */
const Intro: React.FC = () => {
  return (
    <SceneWrapper accentColor={COLORS.trafficRed} particleCount={15} scanlineOpacity={0.02}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <TypewriterText
          text="API costs be like..."
          startFrame={10}
          speed={0.5}
          fontSize={36}
          color={COLORS.textPrimary}
          cursorColor={COLORS.trafficRed}
        />
      </div>

      {/* Nio centered — idle with occasional blinks */}
      <NioReelMascot
        tier={1}
        size={220}
        position="center"
        enterDelay={5}
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'blink', startFrame: 60 },
          { animation: 'blink', startFrame: 140 },
        ]}
      />

      {/* Cost meter fades in */}
      <CostMeter from={1000} to={1000} startFrame={0} drainFrames={1} rightOffset={80} />
    </SceneWrapper>
  );
};

/** Scene B: Drain — meter drains, Nio reacts at milestones (18s / 540f) */
const Drain: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const currentCost = interpolate(frame, [0, 540], [1000, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Sprite sheet cues — reactions escalate as cost drops
  // $1000-$500: idle with blinks
  // $500: think (alert)
  // $250: chat (alarm/agitated)
  const drainCues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
    { animation: 'blink', startFrame: 60 },
    { animation: 'blink', startFrame: 180 },
    { animation: 'think', startFrame: 270, loop: true },   // ~$500 mark
    { animation: 'chat', startFrame: 405, loop: true },     // ~$250 mark
  ];

  return (
    <SceneWrapper accentColor={COLORS.trafficRed} particleCount={20} scanlineOpacity={0.02}>
      {/* Nio reacting */}
      <NioReelMascot
        tier={1}
        size={220}
        position="center-left"
        animationCues={drainCues}
      />

      {/* Draining cost meter */}
      <CostMeter from={1000} to={0} startFrame={0} drainFrames={540} rightOffset={80} />

      {/* Milestone labels that appear */}
      {currentCost < 750 && (
        <div
          style={{
            position: 'absolute',
            right: s(160),
            top: sv(180),
            fontFamily: FONTS.mono,
            fontSize: s(14),
            color: COLORS.trafficYellow,
            opacity: interpolate(currentCost, [750, 700], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          warning: burning fast
        </div>
      )}

      {currentCost < 250 && (
        <div
          style={{
            position: 'absolute',
            right: s(160),
            top: sv(240),
            fontFamily: FONTS.mono,
            fontSize: s(16),
            color: COLORS.trafficRed,
            fontWeight: 700,
            opacity: interpolate(currentCost, [250, 200], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          WALLET PANIC
        </div>
      )}

      {/* Whoosh at $500 */}
      <Sequence from={270} durationInFrames={30}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.6} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Scene C: MAX Reveal — white flash, badge, celebration (11s / 330f) */
const MaxReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  // Flash overlay
  const flashOpacity = interpolate(frame, [0, 8, 20], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Badge scale-in
  const badgeScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={25} scanlineOpacity={0.02}>
      {/* Flash */}
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

      {/* Level up SFX */}
      <Sequence from={5} durationInFrames={60}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {/* MAX badge */}
      <div
        style={{
          position: 'absolute',
          top: sv(80),
          width: '100%',
          textAlign: 'center',
          transform: `scale(${badgeScale})`,
          zIndex: 51,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: `${sv(16)}px ${s(40)}px`,
            borderRadius: s(16),
            border: `3px solid ${COLORS.green}`,
            backgroundColor: `${COLORS.green}15`,
            boxShadow: `0 0 ${s(30)}px ${COLORS.green}40`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(42),
              fontWeight: 800,
              color: COLORS.green,
            }}
          >
            {MAX_PLAN.label}
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(28),
              color: COLORS.textPrimary,
              marginTop: sv(4),
            }}
          >
            {MAX_PLAN.price}
          </div>
        </div>
      </div>

      {/* Nio celebrates — backflip then idle */}
      <NioReelMascot
        tier={1}
        size={240}
        position="bottom-center"
        enterDelay={20}
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'backflip', startFrame: 30 },
          { animation: 'backflip', startFrame: 80 },
        ]}
      />

      {/* "Unlimited Opus" text */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(40),
          width: '100%',
          textAlign: 'center',
        }}
      >
        <TypewriterText
          text={MAX_PLAN.savings}
          startFrame={60}
          speed={0.4}
          fontSize={s(22)}
          color={COLORS.textSecondary}
          cursorColor={COLORS.green}
        />
      </div>
    </SceneWrapper>
  );
};

/** Scene D: CTA — link + fade out (11s / 330f) */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const textScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const fadeOut = interpolate(frame, [260, 330], [1, 0], {
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
        <div
          style={{
            transform: `scale(${textScale})`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(28),
              color: COLORS.textPrimary,
              fontWeight: 600,
            }}
          >
            full cost breakdown
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

        {/* Nio small — idle */}
        <NioReelMascot
          tier={1}
          size={120}
          position="bottom-center"
          enterDelay={15}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'blink', startFrame: 90 },
          ]}
        />
      </AbsoluteFill>

      {/* Resolve SFX */}
      <Sequence from={10} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Exported Composition ── */

export const ReelApiCosts: React.FC = () => (
  <NioReelClip
    totalFrames={
      SCENES_REEL_1.intro + SCENES_REEL_1.drain + SCENES_REEL_1.maxReveal + SCENES_REEL_1.cta -
      3 * 8
    }
    scenes={[
      { component: Intro, durationInFrames: SCENES_REEL_1.intro },
      { component: Drain, durationInFrames: SCENES_REEL_1.drain },
      { component: MaxReveal, durationInFrames: SCENES_REEL_1.maxReveal },
      { component: Cta, durationInFrames: SCENES_REEL_1.cta },
    ]}
  />
);
