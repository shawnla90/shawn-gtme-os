import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { NioReelMascot } from '../../components/NioReelMascot';
import { OrbitingIcons } from '../../components/OrbitingIcons';
import { TypewriterText } from '../../components/TypewriterText';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import { useReelScale } from '../../lib/useReelScale';
import { SCENES_REEL_4 } from '../../lib/timing-reel';
import { MCP_TOOLS } from '../../lib/reel-data';
import { NioReelClip } from '../../NioReelClip';

/* ── Internal Scenes ── */

/** Scene A: Orbit — 9 tool icons spring in around Nio (22s / 660f) */
const Orbit: React.FC = () => {
  const { s, sv } = useReelScale();

  return (
    <SceneWrapper accentColor={COLORS.nioBlue} particleCount={15} scanlineOpacity={0.02}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: sv(30),
          width: '100%',
          textAlign: 'center',
        }}
      >
        <TypewriterText
          text="9 MCP servers. one CLI."
          startFrame={10}
          speed={0.4}
          fontSize={s(28)}
          color={COLORS.textPrimary}
          cursorColor={COLORS.nioBlue}
        />
      </div>

      {/* Orbiting tool icons */}
      <OrbitingIcons
        items={MCP_TOOLS}
        radius={300}
        iconSize={72}
        stagger={10}
        showLines={true}
      />

      {/* Nio at center — idle with blinks as icons appear */}
      <NioReelMascot
        tier={2}
        size={160}
        position="center"
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'blink', startFrame: 40 },
          { animation: 'blink', startFrame: 200 },
          { animation: 'think', startFrame: 400, loop: true },
          { animation: 'blink', startFrame: 550 },
        ]}
      />

      {/* Whoosh for each icon wave */}
      <Sequence from={20} durationInFrames={20}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.3} />
      </Sequence>
      <Sequence from={80} durationInFrames={20}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.3} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Scene B: Conduct — icons light up sequentially (13s / 390f) */
const Conduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  return (
    <SceneWrapper accentColor={COLORS.nioBlue} particleCount={20} scanlineOpacity={0.02}>
      {/* Orbiting icons with highlight sweep */}
      <OrbitingIcons
        items={MCP_TOOLS}
        radius={300}
        iconSize={72}
        stagger={0}
        highlightStartFrame={20}
        highlightInterval={35}
        showLines={true}
      />

      {/* Nio at center — chat animation (conducting) */}
      <NioReelMascot
        tier={2}
        size={160}
        position="center"
        animationCues={[
          { animation: 'chat', startFrame: 0, loop: true },
          { animation: 'backflip', startFrame: 300 },
          { animation: 'idle', startFrame: 350, loop: true },
        ]}
      />

      {/* Center glow that pulses with highlights */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: s(200),
          height: sv(200),
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.nioBlue}20, transparent 70%)`,
          opacity: 0.5 + Math.sin(frame * 0.15) * 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Card flip sounds for each highlight */}
      {MCP_TOOLS.map((_, i) => (
        <Sequence key={i} from={20 + i * 35} durationInFrames={10}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip * 0.3} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/** Scene C: CTA (11s / 330f) */
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
    <SceneWrapper accentColor={COLORS.nioBlue} particleCount={10} scanlineOpacity={0.02}>
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
            one CLI. nine integrations.
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(20),
              color: COLORS.nioBlue,
              marginTop: sv(16),
            }}
          >
            shawnos.ai/blog
          </div>
        </div>

        <NioReelMascot
          tier={2}
          size={120}
          position="bottom-center"
          enterDelay={15}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'blink', startFrame: 100 },
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

export const ReelMcpServers: React.FC = () => (
  <NioReelClip
    totalFrames={
      SCENES_REEL_4.orbit + SCENES_REEL_4.conduct + SCENES_REEL_4.cta - 2 * 8
    }
    scenes={[
      { component: Orbit, durationInFrames: SCENES_REEL_4.orbit },
      { component: Conduct, durationInFrames: SCENES_REEL_4.conduct },
      { component: Cta, durationInFrames: SCENES_REEL_4.cta },
    ]}
  />
);
