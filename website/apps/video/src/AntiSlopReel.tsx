import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors,
  spring,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { SceneWrapper } from './components/SceneWrapper';
import { COLORS, FONTS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import { useScale } from './lib/useScale';
import { SCENES_SLOP, TRANSITION_SLOP, SLOP_TOTAL_FRAMES } from './lib/timing-antislop';
import {
  SLOPPY_SEGMENTS,
  SLOPPY_FULL_TEXT,
  CLEAN_TEXT,
  VIOLATION_COLORS,
  VIOLATION_POINTS,
} from './lib/antislop-data';

/* ── Shared Constants ── */

const SLOP_RED = '#E05555';
const CLEAN_GREEN = '#4EC373';

/* ── Terminal Chrome (reused across scenes) ── */

const TerminalChrome: React.FC<{
  title: string;
  s: (px: number) => number;
  sv: (px: number) => number;
}> = ({ title, s, sv }) => (
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
    {[SLOP_RED, '#D2A53C', CLEAN_GREEN].map((c) => (
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
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: s(12),
        color: COLORS.textMuted,
        marginLeft: s(8),
      }}
    >
      {title}
    </span>
  </div>
);

const TerminalBody: React.FC<{
  children: React.ReactNode;
  s: (px: number) => number;
  sv: (px: number) => number;
  glowColor?: string;
}> = ({ children, s, sv, glowColor }) => (
  <div
    style={{
      backgroundColor: '#0D1117F0',
      border: `1px solid ${COLORS.border}`,
      borderTop: 'none',
      borderRadius: `0 0 ${s(12)}px ${s(12)}px`,
      padding: `${sv(24)}px ${s(24)}px`,
      minHeight: sv(160),
      boxShadow: glowColor ? `0 0 ${s(30)}px ${glowColor}20` : 'none',
    }}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 1: TextPaste — hook text + sloppy LinkedIn post typewriters in
   ═══════════════════════════════════════════════════════════════════════════ */

const TextPaste: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Hook text: "your AI content is telling on you"
  const hookOpacity = interpolate(frame, [0, 8, 22, 32], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Terminal slides in
  const terminalOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const terminalY = interpolate(frame, [28, 42], [sv(40), 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Typewriter: start at frame 38, ~3 chars/frame (fast paste feel)
  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - 38) * 3)),
    SLOPPY_FULL_TEXT.length,
  );
  const cursorVisible = frame % 30 < 15;

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={15} scanlineOpacity={0.02}>
      {/* Hook text */}
      {hookOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: hookOpacity,
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(36),
              fontWeight: 700,
              color: COLORS.textPrimary,
              lineHeight: 1.4,
            }}
          >
            your AI content
            <br />
            <span style={{ color: SLOP_RED }}>is telling on you</span>
          </div>
        </div>
      )}

      {/* Terminal */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${terminalY}px)`,
          opacity: terminalOpacity,
          width: s(900),
        }}
      >
        <TerminalChrome title="linkedin-post.txt" s={s} sv={sv} />
        <TerminalBody s={s} sv={sv}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(18),
              color: COLORS.textPrimary,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {SLOPPY_FULL_TEXT.slice(0, charsVisible)}
          </span>
          {charsVisible < SLOPPY_FULL_TEXT.length && cursorVisible && (
            <span
              style={{
                display: 'inline-block',
                width: s(10),
                height: sv(20),
                backgroundColor: CLEAN_GREEN,
                marginLeft: 2,
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </TerminalBody>
      </div>

      {/* Subtle label */}
      {terminalOpacity > 0.5 && (
        <div
          style={{
            position: 'absolute',
            bottom: sv(120),
            width: '100%',
            textAlign: 'center',
            opacity: interpolate(frame, [50, 65], [0, 0.6], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(14),
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: s(3),
            }}
          >
            looks normal, right?
          </span>
        </div>
      )}

      {/* Key click sounds */}
      {[0, 1, 2].map((i) => (
        <Sequence key={i} from={38 + i * 25} durationInFrames={15}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick * 0.3} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 2: SlopScan — violations highlight sequentially, counter ticks up
   ═══════════════════════════════════════════════════════════════════════════ */

const SlopScan: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Violation reveal timing: start at frame 12, ~8 frames apart
  const getRevealFrame = (order: number) => 12 + order * 8;

  // Count revealed violations and running score
  let revealedCount = 0;
  let currentScore = 0;
  for (const seg of SLOPPY_SEGMENTS) {
    if (seg.type && seg.order !== undefined && frame >= getRevealFrame(seg.order)) {
      revealedCount++;
      currentScore = Math.min(100, currentScore + VIOLATION_POINTS[seg.type]);
    }
  }

  // Scanning label animation
  const scanLabelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dots = '.'.repeat(Math.floor(frame / 8) % 4);

  // Fade out counter in last frames (smooth transition to Scene 3)
  const counterFadeOut = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Score color
  const scoreColor =
    currentScore >= 60 ? SLOP_RED : currentScore >= 30 ? '#E08C45' : currentScore >= 10 ? '#D2A53C' : CLEAN_GREEN;

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={20} scanlineOpacity={0.02}>
      {/* SCANNING... label */}
      <div
        style={{
          position: 'absolute',
          top: sv(55),
          width: '100%',
          textAlign: 'center',
          opacity: scanLabelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(16),
            color: SLOP_RED,
            textTransform: 'uppercase',
            letterSpacing: s(4),
          }}
        >
          {`/// scanning${dots} ///`}
        </span>
      </div>

      {/* Terminal with highlighted text */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: s(900),
        }}
      >
        <TerminalChrome title="linkedin-post.txt" s={s} sv={sv} />
        <TerminalBody s={s} sv={sv}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(18),
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {SLOPPY_SEGMENTS.map((seg, i) => {
              if (!seg.type || seg.order === undefined) {
                return (
                  <span key={i} style={{ color: COLORS.textPrimary }}>
                    {seg.text}
                  </span>
                );
              }

              const revealFrame = getRevealFrame(seg.order);
              const isRevealed = frame >= revealFrame;
              const revealProgress = interpolate(frame, [revealFrame, revealFrame + 6], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              const color = VIOLATION_COLORS[seg.type];

              return (
                <span
                  key={i}
                  style={{
                    color: isRevealed ? color : COLORS.textPrimary,
                    backgroundColor: isRevealed ? `${color}${Math.round(revealProgress * 32).toString(16).padStart(2, '0')}` : 'transparent',
                    borderBottom: isRevealed ? `2px solid ${color}` : '2px solid transparent',
                    paddingBottom: 2,
                  }}
                >
                  {seg.text}
                </span>
              );
            })}
          </span>
        </TerminalBody>

        {/* Scan sweep line */}
        {frame >= 8 && frame <= 120 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'hidden',
              borderRadius: s(12),
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `${interpolate(frame, [8, 120], [-5, 105], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}%`,
                top: 0,
                width: '4%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${SLOP_RED}25, transparent)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Violation counter + score */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(130),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(60),
          opacity: counterFadeOut,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(52),
              fontWeight: 700,
              color: SLOP_RED,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {revealedCount}
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(13),
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: s(2),
            }}
          >
            violations
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(52),
              fontWeight: 700,
              color: scoreColor,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentScore}
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(13),
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: s(2),
            }}
          >
            score
          </div>
        </div>
      </div>

      {/* Whoosh sounds at key moments */}
      <Sequence from={12} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.25} />
      </Sequence>
      <Sequence from={50} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.3} />
      </Sequence>
      <Sequence from={95} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.35} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 3: ScoreReveal — big counter 0→100, score bar fills, badge stamp
   ═══════════════════════════════════════════════════════════════════════════ */

const ScoreReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // Score animates 0 → 100 over frames 8–55
  const scoreValue = Math.round(
    interpolate(frame, [8, 55], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // Score bar color: green → amber → orange → red
  const barColor = interpolateColors(scoreValue, [0, 30, 60, 100], [CLEAN_GREEN, '#D2A53C', '#E08C45', SLOP_RED]);

  // "MAXIMUM SLOP" badge springs in
  const badgeScale = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // Red edge glow intensifies with score
  const edgeGlow = interpolate(frame, [25, 55], [0, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade-in for the whole scene content
  const contentOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={25} scanlineOpacity={0.02}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        {/* Big score number */}
        <div
          style={{
            position: 'absolute',
            top: '32%',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(140),
              fontWeight: 700,
              color: barColor,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {scoreValue}
          </div>

          {/* Score bar */}
          <div
            style={{
              width: s(500),
              height: sv(14),
              backgroundColor: `${COLORS.border}40`,
              borderRadius: s(7),
              overflow: 'hidden',
              margin: `${sv(20)}px auto 0`,
            }}
          >
            <div
              style={{
                width: `${scoreValue}%`,
                height: '100%',
                backgroundColor: barColor,
                borderRadius: s(7),
                boxShadow: `0 0 ${s(12)}px ${barColor}60`,
              }}
            />
          </div>

          {/* Label */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(14),
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: s(3),
              marginTop: sv(12),
            }}
          >
            slop score
          </div>
        </div>

        {/* MAXIMUM SLOP badge */}
        {frame >= 58 && (
          <div
            style={{
              position: 'absolute',
              top: '58%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                transform: `scale(${badgeScale}) rotate(-3deg)`,
                border: `${s(3)}px solid ${SLOP_RED}`,
                borderRadius: s(8),
                padding: `${sv(12)}px ${s(28)}px`,
                backgroundColor: `${SLOP_RED}15`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: s(28),
                  fontWeight: 700,
                  color: SLOP_RED,
                  textTransform: 'uppercase',
                  letterSpacing: s(4),
                }}
              >
                maximum slop
              </span>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Red edge glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(224, 85, 85, ${edgeGlow}) 100%)`,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* Level-up sound (plays as dramatic impact) */}
      <Sequence from={55} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 4: CleanFlip — clean text scores 0, CTA drives to site
   ═══════════════════════════════════════════════════════════════════════════ */

const CleanFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // White flash at start
  const flashOpacity = interpolate(frame, [0, 4, 14], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Score badge springs in
  const scoreBadgeScale = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // "CLEAN" badge
  const cleanBadgeScale = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // CTA fade in
  const ctaOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Overall fade out
  const fadeOut = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Terminal content fade in
  const terminalOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Green edge glow
  const greenGlow = interpolate(frame, [18, 35, 90, 120], [0, 0.15, 0.15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={CLEAN_GREEN} particleCount={20} scanlineOpacity={0.02}>
      {/* Flash */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'white',
            opacity: flashOpacity,
            zIndex: 60,
          }}
        />
      )}

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Score: 0 */}
        <div
          style={{
            position: 'absolute',
            top: sv(80),
            width: '100%',
            textAlign: 'center',
            transform: `scale(${scoreBadgeScale})`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(72),
              fontWeight: 700,
              color: CLEAN_GREEN,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            0
          </div>

          {/* Score bar (empty) */}
          <div
            style={{
              width: s(400),
              height: sv(10),
              backgroundColor: `${COLORS.border}40`,
              borderRadius: s(5),
              overflow: 'hidden',
              margin: `${sv(12)}px auto 0`,
            }}
          >
            <div
              style={{
                width: s(4),
                height: '100%',
                backgroundColor: CLEAN_GREEN,
                borderRadius: s(5),
                boxShadow: `0 0 ${s(8)}px ${CLEAN_GREEN}60`,
              }}
            />
          </div>
        </div>

        {/* Clean text in terminal */}
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: s(900),
            opacity: terminalOpacity,
          }}
        >
          <TerminalChrome title="clean-post.txt" s={s} sv={sv} />
          <TerminalBody s={s} sv={sv} glowColor={CLEAN_GREEN}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: s(18),
                color: COLORS.textPrimary,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {CLEAN_TEXT}
            </span>
          </TerminalBody>
        </div>

        {/* CLEAN badge */}
        {frame >= 32 && (
          <div
            style={{
              position: 'absolute',
              top: '56%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                transform: `scale(${cleanBadgeScale}) rotate(2deg)`,
                border: `${s(3)}px solid ${CLEAN_GREEN}`,
                borderRadius: s(8),
                padding: `${sv(10)}px ${s(24)}px`,
                backgroundColor: `${CLEAN_GREEN}15`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: s(24),
                  fontWeight: 700,
                  color: CLEAN_GREEN,
                  textTransform: 'uppercase',
                  letterSpacing: s(3),
                }}
              >
                clean
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: sv(110),
            width: '100%',
            textAlign: 'center',
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(22),
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: sv(10),
            }}
          >
            Score yours free
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(16),
              color: COLORS.purple,
            }}
          >
            thecontentos.ai/anti-slop
          </div>
        </div>
      </AbsoluteFill>

      {/* Green edge glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(78, 195, 115, ${greenGlow}) 100%)`,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* Resolve sound */}
      <Sequence from={12} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Background Music ── */

const SlopBgm: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 12, SLOP_TOTAL_FRAMES - 25, SLOP_TOTAL_FRAMES],
    [0, VOLUMES.bgm * 0.6, VOLUMES.bgm * 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <Sequence from={0} durationInFrames={SLOP_TOTAL_FRAMES}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main Composition
   ═══════════════════════════════════════════════════════════════════════════ */

export const AntiSlopReel: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.canvas,
      fontFamily: FONTS.mono,
    }}
  >
    <SlopBgm />

    <TransitionSeries>
      {/* Scene 1: Text Paste */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP.textPaste}>
        <TextPaste />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP })}
      />

      {/* Scene 2: Slop Scan */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP.slopScan}>
        <SlopScan />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP })}
      />

      {/* Scene 3: Score Reveal */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP.scoreReveal}>
        <ScoreReveal />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP })}
      />

      {/* Scene 4: Clean Flip */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP.cleanFlip}>
        <CleanFlip />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
