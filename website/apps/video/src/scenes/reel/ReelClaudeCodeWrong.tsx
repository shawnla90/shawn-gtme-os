import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { NioReelMascot } from '../../components/NioReelMascot';
import { TerminalCommandLine } from '../../components/TerminalCommandLine';
import { XpBar } from '../../components/XpBar';
import { TypewriterText } from '../../components/TypewriterText';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import { useReelScale } from '../../lib/useReelScale';
import { SCENES_REEL_2 } from '../../lib/timing-reel';
import { CLAUDE_COMMANDS, EVOLUTION_TIERS } from '../../lib/reel-data';
import { NioReelClip } from '../../NioReelClip';

/* ── Internal Scenes ── */

/** Scene A: Terminal — 5 commands typewriter, Nio watches (15s / 450f) */
const Terminal: React.FC = () => {
  return (
    <SceneWrapper accentColor={COLORS.nioBlue} particleCount={15} scanlineOpacity={0.02}>
      {/* Terminal commands */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <TerminalCommandLine
          commands={CLAUDE_COMMANDS}
          interval={80}
          startFrame={15}
          width={820}
        />
      </div>

      {/* Nio watching — think animation (focused), blinks during errors */}
      <NioReelMascot
        tier={1}
        size={140}
        position="bottom-right"
        enterDelay={5}
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'think', startFrame: 15, loop: true },   // watching code
          { animation: 'chat', startFrame: 95 },                 // reacts to error
          { animation: 'think', startFrame: 120, loop: true },   // back to watching
          { animation: 'chat', startFrame: 175 },                // reacts to error
          { animation: 'think', startFrame: 200, loop: true },   // watching again
          { animation: 'blink', startFrame: 255 },               // reacts to error
          { animation: 'backflip', startFrame: 335 },            // celebrates success
          { animation: 'idle', startFrame: 380, loop: true },    // settles
        ]}
      />

      {/* Key click sounds */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={i} from={15 + i * 80} durationInFrames={20}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick * 0.4} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/** Scene B: Evolution — Spark→Blade using NioEvolution (15s / 450f) */
const Evolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const tier1 = EVOLUTION_TIERS[0];
  const tier2 = EVOLUTION_TIERS[1];

  // XP bar fills from 0 → 500 over first 180 frames
  const xpFillComplete = 180;

  // Evolution trigger at frame 200 — NioEvolution handles the full sequence
  const evolveAt = 200;
  const showTier2 = frame >= evolveAt + 50; // after flash + evolve_in
  const tierLabel = showTier2
    ? `${tier2.name} — Tier ${tier2.tier}`
    : `${tier1.name} — Tier ${tier1.tier}`;
  const tierColor = showTier2 ? tier2.color : tier1.color;

  return (
    <SceneWrapper accentColor={tierColor} particleCount={20} scanlineOpacity={0.02}>
      {/* XP Bar at top */}
      <div
        style={{
          position: 'absolute',
          top: sv(60),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <XpBar
          from={0}
          to={tier2.xp}
          max={tier2.xp}
          tierLabel={tierLabel}
          tierColor={tierColor}
          startFrame={20}
          fillFrames={xpFillComplete}
          width={600}
        />
      </div>

      {/* Nio evolution — full sprite sheet sequence */}
      <NioReelMascot
        size={260}
        position="center"
        evolution={{
          tierFrom: 1,
          tierTo: 2,
          triggerFrame: evolveAt,
          accentColor: tier2.color,
        }}
      />

      {/* Boot beep at XP fill */}
      <Sequence from={xpFillComplete} durationInFrames={20}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Scene C: Showcase — Nio tier 2 with floating panels (15s / 450f) */
const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const fadeOut = interpolate(frame, [380, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panels = [
    'context-first engineering',
    'plan mode precision',
    'parallel agent teams',
    'MCP tool integration',
  ];

  return (
    <SceneWrapper accentColor={COLORS.nioBlue} particleCount={20} scanlineOpacity={0.02}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Nio tier 2 centered — idle with blinks */}
        <NioReelMascot
          tier={2}
          size={200}
          position="center"
          enterDelay={5}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'blink', startFrame: 60 },
            { animation: 'blink', startFrame: 200 },
            { animation: 'backflip', startFrame: 300 },
          ]}
        />

        {/* Floating capability panels */}
        <div
          style={{
            position: 'absolute',
            bottom: sv(60),
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: s(16),
            padding: `0 ${s(40)}px`,
          }}
        >
          {panels.map((label, i) => {
            const panelScale = spring({
              frame: Math.max(0, frame - 30 - i * 15),
              fps,
              config: { damping: 12, stiffness: 160 },
            });

            return (
              <div
                key={label}
                style={{
                  padding: `${sv(10)}px ${s(20)}px`,
                  borderRadius: s(10),
                  border: `1px solid ${COLORS.nioBlue}60`,
                  backgroundColor: `${COLORS.nioBlue}10`,
                  fontFamily: FONTS.mono,
                  fontSize: s(14),
                  color: COLORS.nioBlue,
                  transform: `scale(${panelScale})`,
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Tagline */}
        <div
          style={{
            position: 'absolute',
            top: sv(80),
            width: '100%',
            textAlign: 'center',
          }}
        >
          <TypewriterText
            text="not a chatbot. an operating system."
            startFrame={60}
            speed={0.35}
            fontSize={s(22)}
            color={COLORS.textSecondary}
            cursorColor={COLORS.nioBlue}
          />
        </div>
      </AbsoluteFill>

      <Sequence from={20} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Exported Composition ── */

export const ReelClaudeCodeWrong: React.FC = () => (
  <NioReelClip
    totalFrames={
      SCENES_REEL_2.terminal + SCENES_REEL_2.evolution + SCENES_REEL_2.showcase - 2 * 8
    }
    scenes={[
      { component: Terminal, durationInFrames: SCENES_REEL_2.terminal },
      { component: Evolution, durationInFrames: SCENES_REEL_2.evolution },
      { component: Showcase, durationInFrames: SCENES_REEL_2.showcase },
    ]}
  />
);
