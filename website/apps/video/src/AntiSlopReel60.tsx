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
import { SCENES_SLOP_60, TRANSITION_SLOP_60, SLOP_60_TOTAL_FRAMES } from './lib/timing-antislop';
import {
  SLOPPY_SEGMENTS,
  SLOPPY_FULL_TEXT,
  CLEAN_TEXT,
  VIOLATION_COLORS,
  VIOLATION_POINTS,
  VIOLATION_LABELS,
  VIOLATION_PENALTIES,
  VIOLATION_EXAMPLES,
  VIOLATION_TYPE_ORDER,
  type ViolationType,
} from './lib/antislop-data';

/* ── Shared Constants ── */

const SLOP_RED = '#E05555';
const CLEAN_GREEN = '#4EC373';
const NPC_CYAN = '#50BED2';

/* ── Shared Terminal Components ── */

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
    <span style={{ fontFamily: FONTS.mono, fontSize: s(12), color: COLORS.textMuted, marginLeft: s(8) }}>
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
   Scene 1: NPC Hook — "your AI makes you sound like an NPC"
   ═══════════════════════════════════════════════════════════════════════════ */

const NpcHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // Line 1 fades in
  const line1Opacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line1Y = interpolate(frame, [5, 15], [sv(20), 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "like an NPC" slams in with spring
  const npcScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Subtle tag fades in
  const tagOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out at end (tighter for 120f scene)
  const fadeOut = interpolate(frame, [95, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={20} scanlineOpacity={0.03}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {/* "your AI makes you sound" */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(32),
              fontWeight: 600,
              color: COLORS.textPrimary,
              opacity: line1Opacity,
              transform: `translateY(${line1Y}px)`,
              marginBottom: sv(12),
            }}
          >
            your AI makes you sound
          </div>

          {/* "like an NPC" */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(52),
              fontWeight: 700,
              color: SLOP_RED,
              transform: `scale(${npcScale})`,
              lineHeight: 1.1,
            }}
          >
            like an NPC
          </div>

          {/* Subtle subtext */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(16),
              color: COLORS.textMuted,
              marginTop: sv(30),
              opacity: tagOpacity,
            }}
          >
            here's proof
          </div>
        </div>
      </AbsoluteFill>

      {/* Boot beep on NPC slam */}
      <Sequence from={25} durationInFrames={20}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 2: TextPaste — sloppy LinkedIn post typewriters in
   ═══════════════════════════════════════════════════════════════════════════ */

const TextPaste: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // "every LinkedIn post ever" label
  const labelOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Terminal slides in
  const terminalOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const terminalY = interpolate(frame, [25, 40], [sv(40), 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Typewriter: start at frame 40, ~2.5 chars/frame (snappy paste feel)
  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - 40) * 2.5)),
    SLOPPY_FULL_TEXT.length,
  );
  const cursorVisible = frame % 30 < 15;

  // "looks familiar?" tease
  const teaseOpacity = interpolate(frame, [160, 180], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={15} scanlineOpacity={0.02}>
      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: sv(70),
          width: '100%',
          textAlign: 'center',
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(18),
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: s(4),
          }}
        >
          every LinkedIn post ever
        </span>
      </div>

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

      {/* "looks familiar?" */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(120),
          width: '100%',
          textAlign: 'center',
          opacity: teaseOpacity,
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: s(16), color: COLORS.textMuted }}>
          looks familiar?
        </span>
      </div>

      {/* Key click sounds */}
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={45 + i * 40} durationInFrames={15}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick * 0.25} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 3: SlopScan — violations highlight one by one (slower, dramatic)
   ═══════════════════════════════════════════════════════════════════════════ */

const SlopScan: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Snappier reveal: ~22 frames apart
  const getRevealFrame = (order: number) => 15 + order * 22;

  // Count revealed violations and running score
  let revealedCount = 0;
  let currentScore = 0;
  for (const seg of SLOPPY_SEGMENTS) {
    if (seg.type && seg.order !== undefined && frame >= getRevealFrame(seg.order)) {
      revealedCount++;
      currentScore = Math.min(100, currentScore + VIOLATION_POINTS[seg.type]);
    }
  }

  // Scanning label
  const scanLabelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dots = '.'.repeat(Math.floor(frame / 8) % 4);

  // Fade out counter at end (tighter for 340f scene)
  const counterFadeOut = interpolate(frame, [300, 340], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scoreColor =
    currentScore >= 60 ? SLOP_RED : currentScore >= 30 ? '#E08C45' : currentScore >= 10 ? '#D2A53C' : CLEAN_GREEN;

  // Category label popup: show the type of the most recently revealed violation
  let activeCategory: ViolationType | null = null;
  let activeCategoryFrame = 0;
  for (const seg of SLOPPY_SEGMENTS) {
    if (seg.type && seg.order !== undefined) {
      const rf = getRevealFrame(seg.order);
      if (frame >= rf && frame < rf + 20 && rf > activeCategoryFrame) {
        activeCategory = seg.type;
        activeCategoryFrame = rf;
      }
    }
  }
  const categoryOpacity = activeCategory
    ? interpolate(frame, [activeCategoryFrame, activeCategoryFrame + 4, activeCategoryFrame + 15, activeCategoryFrame + 20], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={20} scanlineOpacity={0.02}>
      {/* SCANNING... label */}
      <div
        style={{
          position: 'absolute',
          top: sv(50),
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
          top: '32%',
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
              const revealProgress = interpolate(frame, [revealFrame, revealFrame + 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const color = VIOLATION_COLORS[seg.type];

              return (
                <span
                  key={i}
                  style={{
                    color: isRevealed ? color : COLORS.textPrimary,
                    backgroundColor: isRevealed
                      ? `${color}${Math.round(revealProgress * 32).toString(16).padStart(2, '0')}`
                      : 'transparent',
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
        {frame >= 12 && frame <= 310 && (
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
                left: `${interpolate(frame, [12, 310], [-5, 105], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}%`,
                top: 0,
                width: '3%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${SLOP_RED}25, transparent)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Category label popup */}
      {activeCategory && categoryOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '53%',
            width: '100%',
            textAlign: 'center',
            opacity: categoryOpacity,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(14),
              color: VIOLATION_COLORS[activeCategory],
              textTransform: 'uppercase',
              letterSpacing: s(2),
              backgroundColor: `${VIOLATION_COLORS[activeCategory]}15`,
              padding: `${sv(6)}px ${s(16)}px`,
              borderRadius: s(4),
              border: `1px solid ${VIOLATION_COLORS[activeCategory]}40`,
            }}
          >
            {VIOLATION_LABELS[activeCategory]}
          </span>
        </div>
      )}

      {/* Violation counter + score — white cards, big numbers, social style */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(90),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(20),
          opacity: counterFadeOut,
        }}
      >
        {/* Violations card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: s(16),
            padding: `${sv(14)}px ${s(28)}px`,
            textAlign: 'center',
            minWidth: s(190),
            boxShadow: `0 ${sv(4)}px ${s(20)}px rgba(0,0,0,0.3)`,
          }}
        >
          <div
            style={{
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, sans-serif',
              fontSize: s(68),
              fontWeight: 800,
              color: '#111111',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {revealedCount}
          </div>
          <div
            style={{
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, sans-serif',
              fontSize: s(13),
              fontWeight: 700,
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: s(2),
              marginTop: sv(6),
            }}
          >
            violations
          </div>
        </div>

        {/* Score card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: s(16),
            padding: `${sv(14)}px ${s(28)}px`,
            textAlign: 'center',
            minWidth: s(190),
            boxShadow: `0 ${sv(4)}px ${s(20)}px rgba(0,0,0,0.3)`,
          }}
        >
          <div
            style={{
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, sans-serif',
              fontSize: s(68),
              fontWeight: 800,
              color: '#111111',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {currentScore}
          </div>
          <div
            style={{
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, sans-serif',
              fontSize: s(13),
              fontWeight: 700,
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: s(2),
              marginTop: sv(6),
            }}
          >
            score
          </div>
        </div>
      </div>

      {/* Whoosh sounds at intervals */}
      {[20, 100, 200, 300].map((f) => (
        <Sequence key={f} from={f} durationInFrames={15}>
          <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.25} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 4: ScoreReveal — 0→100 counter, badge, "NPC DETECTED"
   ═══════════════════════════════════════════════════════════════════════════ */

const ScoreReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // Score animates 0 → 100 (faster climb for 170f scene)
  const scoreValue = Math.round(
    interpolate(frame, [8, 60], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const barColor = interpolateColors(scoreValue, [0, 30, 60, 100], [CLEAN_GREEN, '#D2A53C', '#E08C45', SLOP_RED]);

  // "MAXIMUM SLOP" badge (earlier)
  const badgeScale = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // "NPC DETECTED" flash (tighter)
  const npcOpacity = interpolate(frame, [105, 112, 150, 165], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const npcScale = spring({
    frame: Math.max(0, frame - 105),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Red edge glow
  const edgeGlow = interpolate(frame, [30, 60], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const contentOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={SLOP_RED} particleCount={25} scanlineOpacity={0.02}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        {/* Big score */}
        <div
          style={{
            position: 'absolute',
            top: '28%',
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
        {frame >= 68 && (
          <div style={{ position: 'absolute', top: '52%', width: '100%', textAlign: 'center' }}>
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

        {/* NPC DETECTED */}
        {frame >= 103 && (
          <div
            style={{
              position: 'absolute',
              top: '65%',
              width: '100%',
              textAlign: 'center',
              opacity: npcOpacity,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                transform: `scale(${npcScale})`,
                fontFamily: FONTS.mono,
                fontSize: s(20),
                fontWeight: 700,
                color: SLOP_RED,
                letterSpacing: s(6),
                textTransform: 'uppercase',
              }}
            >
              {'// NPC DETECTED //'}
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

      <Sequence from={65} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.5} />
      </Sequence>
      <Sequence from={105} durationInFrames={20}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep * 0.3} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 5: ViolationBreakdown — 4 types with before/after examples
   ═══════════════════════════════════════════════════════════════════════════ */

const ViolationBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // 4 cards, ~65 frames each, snappier cuts
  const CARD_DURATION = 65;
  const CARD_GAP = 8;

  // Determine which card is active
  const cardIndex = Math.min(3, Math.floor(frame / (CARD_DURATION + CARD_GAP)));
  const cardLocalFrame = frame - cardIndex * (CARD_DURATION + CARD_GAP);

  // After all 4 cards: summary grid (frames 360+)
  const inSummary = frame >= 4 * (CARD_DURATION + CARD_GAP) - CARD_GAP;

  // Card animation
  const cardOpacity = interpolate(cardLocalFrame, [0, 8, CARD_DURATION - 5, CARD_DURATION], [0, 1, 1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentType = VIOLATION_TYPE_ORDER[cardIndex];
  const color = VIOLATION_COLORS[currentType];
  const examples = VIOLATION_EXAMPLES[currentType];

  return (
    <SceneWrapper accentColor={color} particleCount={18} scanlineOpacity={0.02}>
      {!inSummary ? (
        /* Individual violation type cards */
        <AbsoluteFill style={{ opacity: cardOpacity }}>
          {/* Type header */}
          <div
            style={{
              position: 'absolute',
              top: sv(100),
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Colored accent line */}
            <div
              style={{
                width: s(60),
                height: sv(4),
                backgroundColor: color,
                margin: '0 auto',
                marginBottom: sv(16),
                borderRadius: s(2),
              }}
            />
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: s(28),
                fontWeight: 700,
                color,
                textTransform: 'uppercase',
                letterSpacing: s(3),
              }}
            >
              {VIOLATION_LABELS[currentType]}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: s(14),
                color: COLORS.textMuted,
                marginTop: sv(8),
              }}
            >
              {VIOLATION_PENALTIES[currentType]}
            </div>
          </div>

          {/* Before → After examples */}
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: s(800),
            }}
          >
            {examples.map((ex, i) => {
              const exDelay = 15 + i * 18;
              const exOpacity = interpolate(cardLocalFrame, [exDelay, exDelay + 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: s(20),
                    marginBottom: sv(24),
                    opacity: exOpacity,
                  }}
                >
                  {/* Bad */}
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(20),
                      color,
                      textDecoration: 'line-through',
                      textDecorationColor: `${color}80`,
                      minWidth: s(250),
                      textAlign: 'right',
                    }}
                  >
                    {`"${ex.bad}"`}
                  </div>

                  {/* Arrow */}
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(20),
                      color: COLORS.textMuted,
                    }}
                  >
                    {'\u2192'}
                  </div>

                  {/* Good */}
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(20),
                      color: CLEAN_GREEN,
                      fontWeight: 600,
                      minWidth: s(250),
                      textAlign: 'left',
                    }}
                  >
                    {ex.good}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : (
        /* Summary: all 4 types in a 2x2 grid */
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              top: sv(80),
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: s(24),
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              4 violation types. 20 rules.
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'grid',
              gridTemplateColumns: `${s(380)}px ${s(380)}px`,
              gap: `${sv(20)}px ${s(20)}px`,
            }}
          >
            {VIOLATION_TYPE_ORDER.map((type, i) => {
              const gridDelay = (frame - 4 * (CARD_DURATION + CARD_GAP) + CARD_GAP);
              const itemScale = spring({
                frame: Math.max(0, gridDelay - i * 5),
                fps,
                config: { damping: 12, stiffness: 160 },
              });

              return (
                <div
                  key={type}
                  style={{
                    transform: `scale(${itemScale})`,
                    border: `1px solid ${VIOLATION_COLORS[type]}40`,
                    borderLeft: `${s(4)}px solid ${VIOLATION_COLORS[type]}`,
                    borderRadius: s(8),
                    padding: `${sv(16)}px ${s(20)}px`,
                    backgroundColor: `${VIOLATION_COLORS[type]}08`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(14),
                      fontWeight: 700,
                      color: VIOLATION_COLORS[type],
                      textTransform: 'uppercase',
                      letterSpacing: s(1),
                    }}
                  >
                    {VIOLATION_LABELS[type]}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(12),
                      color: COLORS.textMuted,
                      marginTop: sv(4),
                    }}
                  >
                    {VIOLATION_PENALTIES[type]}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* Card flip sounds */}
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={i * (CARD_DURATION + CARD_GAP)} durationInFrames={15}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip * 0.3} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 6: CleanFlip — clean text scores 0
   ═══════════════════════════════════════════════════════════════════════════ */

const CleanFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // White flash
  const flashOpacity = interpolate(frame, [0, 5, 15], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "now read this" label
  const labelOpacity = interpolate(frame, [15, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Terminal
  const terminalOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Score badge springs in
  const scoreBadgeScale = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // "CLEAN" badge
  const cleanBadgeScale = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // "this is what real sounds like"
  const realTextOpacity = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Green glow (tighter for 200f scene)
  const greenGlow = interpolate(frame, [45, 65, 165, 200], [0, 0.15, 0.15, 0], {
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

      {/* "now read this" */}
      <div
        style={{
          position: 'absolute',
          top: sv(60),
          width: '100%',
          textAlign: 'center',
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(16),
            color: CLEAN_GREEN,
            textTransform: 'uppercase',
            letterSpacing: s(4),
          }}
        >
          now read this
        </span>
      </div>

      {/* Score: 0 */}
      <div
        style={{
          position: 'absolute',
          top: sv(90),
          width: '100%',
          textAlign: 'center',
          transform: `scale(${scoreBadgeScale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(64),
            fontWeight: 700,
            color: CLEAN_GREEN,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          0
        </div>
        <div
          style={{
            width: s(350),
            height: sv(10),
            backgroundColor: `${COLORS.border}40`,
            borderRadius: s(5),
            overflow: 'hidden',
            margin: `${sv(10)}px auto 0`,
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

      {/* Clean text terminal */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
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
      {frame >= 68 && (
        <div style={{ position: 'absolute', top: '57%', width: '100%', textAlign: 'center' }}>
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

      {/* "this is what real sounds like" */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(120),
          width: '100%',
          textAlign: 'center',
          opacity: realTextOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(18),
            color: COLORS.textMuted,
          }}
        >
          this is what real sounds like
        </span>
      </div>

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

      <Sequence from={18} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 7: CTA — "don't sound like an NPC" + check Content OS
   ═══════════════════════════════════════════════════════════════════════════ */

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // "don't sound like an NPC" callback
  const npcScale = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // "Score your content free"
  const scoreTextOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL
  const urlOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "check Content OS"
  const contentOsOpacity = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const contentOsScale = spring({
    frame: Math.max(0, frame - 85),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Fade out (tighter for 170f scene)
  const fadeOut = interpolate(frame, [145, 170], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.purple} particleCount={20} scanlineOpacity={0.02}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <div
          style={{
            position: 'absolute',
            top: '32%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {/* Main CTA */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(36),
              fontWeight: 700,
              color: COLORS.textPrimary,
              transform: `scale(${npcScale})`,
              lineHeight: 1.3,
            }}
          >
            don't sound
            <br />
            <span style={{ color: SLOP_RED }}>like an NPC</span>
          </div>
        </div>

        {/* Score your content free */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            width: '100%',
            textAlign: 'center',
            opacity: scoreTextOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(22),
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            Score your content free
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            top: '57%',
            width: '100%',
            textAlign: 'center',
            opacity: urlOpacity,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontFamily: FONTS.mono,
              fontSize: s(18),
              color: COLORS.purple,
              padding: `${sv(8)}px ${s(20)}px`,
              border: `1px solid ${COLORS.purple}40`,
              borderRadius: s(6),
              backgroundColor: `${COLORS.purple}10`,
            }}
          >
            thecontentos.ai/anti-slop
          </div>
        </div>

        {/* check Content OS */}
        <div
          style={{
            position: 'absolute',
            bottom: sv(140),
            width: '100%',
            textAlign: 'center',
            opacity: contentOsOpacity,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              transform: `scale(${contentOsScale})`,
              fontFamily: FONTS.mono,
              fontSize: s(16),
              color: COLORS.purple,
              letterSpacing: s(2),
            }}
          >
            check Content OS
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: s(13),
              color: COLORS.textMuted,
              marginTop: sv(8),
            }}
          >
            free playbooks, guides & voice tools
          </div>
        </div>
      </AbsoluteFill>

      <Sequence from={5} durationInFrames={30}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve * 0.3} />
      </Sequence>
    </SceneWrapper>
  );
};

/* ── Background Music ── */

const SlopBgm60: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 15, SLOP_60_TOTAL_FRAMES - 30, SLOP_60_TOTAL_FRAMES],
    [0, VOLUMES.bgm * 0.5, VOLUMES.bgm * 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <Sequence from={0} durationInFrames={SLOP_60_TOTAL_FRAMES}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main 60s Composition
   ═══════════════════════════════════════════════════════════════════════════ */

export const AntiSlopReel60: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.canvas,
      fontFamily: FONTS.mono,
    }}
  >
    <SlopBgm60 />

    <TransitionSeries>
      {/* Scene 1: NPC Hook */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.npcHook}>
        <NpcHook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 2: Text Paste */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.textPaste}>
        <TextPaste />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 3: Slop Scan */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.slopScan}>
        <SlopScan />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 4: Score Reveal */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.scoreReveal}>
        <ScoreReveal />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 5: Violation Breakdown */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.violationBreakdown}>
        <ViolationBreakdown />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 6: Clean Flip */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.cleanFlip}>
        <CleanFlip />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_SLOP_60 })}
      />

      {/* Scene 7: CTA */}
      <TransitionSeries.Sequence durationInFrames={SCENES_SLOP_60.cta}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
