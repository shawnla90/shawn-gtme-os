import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { NioReelMascot } from '../../components/NioReelMascot';
import { COLORS, FONTS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import { useReelScale } from '../../lib/useReelScale';
import { SCENES_REEL_5 } from '../../lib/timing-reel';
import { REMOTION_CODE_LINES } from '../../lib/reel-data';
import { NioReelClip } from '../../NioReelClip';

/* ── Internal Scenes ── */

/** Scene A: Code Appear — JSX typewriters into terminal frame (16s / 480f) */
const CodeAppear: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  return (
    <SceneWrapper accentColor={COLORS.purple} particleCount={15} scanlineOpacity={0.02}>
      {/* Terminal with code */}
      <div
        style={{
          position: 'absolute',
          top: sv(30),
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <CodeTerminal
          lines={REMOTION_CODE_LINES}
          startFrame={15}
          interval={35}
          s={s}
          sv={sv}
          frame={frame}
        />
      </div>

      {/* Nio watching — think animation (focused on code) */}
      <NioReelMascot
        tier={2}
        size={120}
        position="bottom-right"
        enterDelay={5}
        animationCues={[
          { animation: 'idle', startFrame: 0, loop: true },
          { animation: 'think', startFrame: 15, loop: true },
          { animation: 'blink', startFrame: 150 },
          { animation: 'think', startFrame: 160, loop: true },
          { animation: 'blink', startFrame: 350 },
          { animation: 'chat', startFrame: 400 },
        ]}
      />

      {/* Key click sounds */}
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={15 + i * 35} durationInFrames={15}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick * 0.3} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/** Custom code terminal with syntax highlighting */
const CodeTerminal: React.FC<{
  lines: readonly string[];
  startFrame: number;
  interval: number;
  s: (v: number) => number;
  sv: (v: number) => number;
  frame: number;
}> = ({ lines, startFrame, interval, s, sv, frame }) => {
  const termWidth = s(820);
  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width: termWidth, opacity: enterOpacity }}>
      {/* Terminal chrome */}
      <div
        style={{
          backgroundColor: COLORS.canvasSubtle,
          borderRadius: `${s(12)}px ${s(12)}px 0 0`,
          border: `1px solid ${COLORS.border}`,
          borderBottom: 'none',
          padding: `${sv(10)}px ${s(16)}px`,
          display: 'flex',
          alignItems: 'center',
          gap: s(8),
        }}
      >
        {['#E05555', '#D2A53C', '#4EC373'].map((c) => (
          <div
            key={c}
            style={{
              width: s(12),
              height: s(12),
              borderRadius: '50%',
              backgroundColor: c,
              opacity: 0.8,
            }}
          />
        ))}
        <span style={{ fontFamily: FONTS.mono, fontSize: s(12), color: COLORS.textMuted, marginLeft: s(8) }}>
          NioReelClip.tsx
        </span>
      </div>

      {/* Code body */}
      <div
        style={{
          backgroundColor: '#0D1117F0',
          border: `1px solid ${COLORS.border}`,
          borderTop: 'none',
          borderRadius: `0 0 ${s(12)}px ${s(12)}px`,
          padding: `${sv(16)}px ${s(20)}px`,
          minHeight: sv(350),
        }}
      >
        {lines.map((line, i) => {
          const lineStart = startFrame + i * interval;
          if (frame < lineStart) return null;

          const lineOpacity = interpolate(frame, [lineStart, lineStart + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const colored = colorizeJsx(line);

          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.mono,
                fontSize: s(14),
                lineHeight: 1.6,
                opacity: lineOpacity,
                whiteSpace: 'pre',
              }}
              dangerouslySetInnerHTML={{ __html: colored }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Simple JSX syntax coloring */
function colorizeJsx(line: string): string {
  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w.]+)/g, `$1<span style="color:${COLORS.nioBlue}">$2</span>`)
    .replace(/([\w]+)=/g, `<span style="color:${COLORS.nioAmber}">$1</span>=`)
    .replace(/\{([^}]+)\}/g, `{<span style="color:${COLORS.green}">$1</span>}`)
    .replace(/(&gt;)/g, `<span style="color:${COLORS.textMuted}">$1</span>`);
}

/** Scene B: Transform — terminal shrinks, video frame springs in (15s / 450f) */
const Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const termScale = interpolate(frame, [0, 60], [1, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const termX = interpolate(frame, [0, 60], [0, -s(200)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const videoScale = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const arrowOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const labelOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.purple} particleCount={20} scanlineOpacity={0.02}>
      {/* Terminal (shrunk) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: `translate(-50%, -50%) translateX(${termX}px) scale(${termScale})`,
        }}
      >
        <div
          style={{
            width: s(400),
            height: sv(300),
            borderRadius: s(12),
            border: `2px solid ${COLORS.purple}60`,
            backgroundColor: COLORS.canvasSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.mono,
            fontSize: s(14),
            color: COLORS.textMuted,
          }}
        >
          {'<JSX />'}
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          fontFamily: FONTS.mono,
          fontSize: s(36),
          color: COLORS.purple,
          opacity: arrowOpacity,
        }}
      >
        {'\u2192'}
      </div>

      {/* Video frame */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: `translate(-50%, -50%) translateX(${s(200)}px) scale(${videoScale})`,
        }}
      >
        <div
          style={{
            width: s(400),
            height: sv(300),
            borderRadius: s(12),
            border: `2px solid ${COLORS.green}60`,
            backgroundColor: COLORS.canvasSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${s(20)}px ${COLORS.green}30`,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: s(40), marginBottom: sv(8) }}>
              <span role="img" aria-label="video">{'|>'}</span>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: s(14), color: COLORS.green }}>
              .mp4
            </div>
          </div>
        </div>
      </div>

      {/* "code -> video" label */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(80),
          width: '100%',
          textAlign: 'center',
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(24),
            color: COLORS.textPrimary,
            fontWeight: 600,
          }}
        >
          {'code \u2192 video'}
        </span>
      </div>

      <Sequence from={70} durationInFrames={30}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/** Scene C: Mic Drop — celebration + self-referential (15s / 450f) */
const MicDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const flashOpacity = interpolate(frame, [0, 8, 20], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [380, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  return (
    <SceneWrapper accentColor={COLORS.purple} particleCount={25} scanlineOpacity={0.02}>
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

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Nio celebrates — backflip then idle */}
        <NioReelMascot
          tier={2}
          size={240}
          position="center"
          enterDelay={15}
          animationCues={[
            { animation: 'idle', startFrame: 0, loop: true },
            { animation: 'backflip', startFrame: 25 },
            { animation: 'idle', startFrame: 75, loop: true },
            { animation: 'blink', startFrame: 200 },
            { animation: 'backflip', startFrame: 300 },
          ]}
        />

        {/* Self-referential text */}
        <div
          style={{
            position: 'absolute',
            bottom: sv(100),
            width: '100%',
            textAlign: 'center',
            transform: `scale(${textScale})`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(22),
              color: COLORS.textPrimary,
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            this video was rendered
            <br />
            <span style={{ color: COLORS.purple }}>from this code.</span>
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(16),
              color: COLORS.textMuted,
              marginTop: sv(20),
            }}
          >
            shawnos.ai/blog
          </div>
        </div>
      </AbsoluteFill>

      <Sequence from={5} durationInFrames={60}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.6} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Exported Composition ── */

export const ReelRemotionMeta: React.FC = () => (
  <NioReelClip
    totalFrames={
      SCENES_REEL_5.codeAppear + SCENES_REEL_5.transform + SCENES_REEL_5.micDrop - 2 * 8
    }
    scenes={[
      { component: CodeAppear, durationInFrames: SCENES_REEL_5.codeAppear },
      { component: Transform, durationInFrames: SCENES_REEL_5.transform },
      { component: MicDrop, durationInFrames: SCENES_REEL_5.micDrop },
    ]}
  />
);
