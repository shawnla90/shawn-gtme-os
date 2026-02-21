import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { WIKI_MONTAGE } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';
import { WikiCard } from '../components/WikiCard';
import { ScanlineOverlay } from '../components/ScanlineOverlay';

/** Accent colors cycling through the palette */
const WIKI_ACCENTS = [
  COLORS.green,   // Clay Wiki
  COLORS.teal,    // Context Wiki
  COLORS.amber,   // How-To Wiki
  COLORS.purple,  // Content Wiki
  COLORS.green,   // GTM Knowledge
];

/** Use first 5 wikis for V2 (tighter montage) */
const WIKIS = WIKI_MONTAGE.slice(0, 5);
const BOOT_END = 60;  // Boot phase: frames 0-60 (2s)
const WIKI_START = 60;
const FRAMES_PER_WIKI = 57; // ~1.9s per wiki

/**
 * Scene 2 — Boot + Wiki Blitz (350 frames / ~11.7s)
 * Merged scene: terminal boots (2s), then wiki cards rapid-fire.
 */
export const BootWikiBlitz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // ── Boot Phase (frames 0-60) ──

  const windowScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const barProgress = interpolate(frame, [25, 55], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Wiki Phase (frames 60+) ──

  const wikiFrame = Math.max(0, frame - WIKI_START);
  const wikiIndex = Math.min(
    Math.floor(wikiFrame / FRAMES_PER_WIKI),
    WIKIS.length - 1,
  );
  const localFrame = wikiFrame - wikiIndex * FRAMES_PER_WIKI;

  const wiki = WIKIS[wikiIndex];
  const accent = WIKI_ACCENTS[wikiIndex] ?? COLORS.green;

  // Wiki card slide-in
  const slideInX = interpolate(localFrame, [0, 10], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideInOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wiki card wipe-out
  const wipeOutOpacity = interpolate(localFrame, [45, 57], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wipeOutX = interpolate(localFrame, [45, 57], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardOpacity = slideInOpacity * wipeOutOpacity;
  const cardTranslateX = slideInX + wipeOutX;

  // Highlight progress
  const highlightProgress = interpolate(localFrame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Running counter
  const runningTotal = WIKIS.slice(0, wikiIndex + 1).reduce((s, w) => s + w.count, 0);
  const prevTotal = WIKIS.slice(0, wikiIndex).reduce((s, w) => s + w.count, 0);
  const counterValue = Math.round(
    interpolate(localFrame, [5, 35], [prevTotal, runningTotal], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const isBootPhase = frame < BOOT_END;
  const showTerminal = frame < BOOT_END + 15; // Terminal fades during wiki phase overlap

  // Terminal fade-out
  const terminalOpacity = interpolate(frame, [BOOT_END, BOOT_END + 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* SFX: key clicks during boot typewriter (every 3 frames from 10-25) */}
      {[10, 13, 16, 19, 22, 25].map((f) => (
        <Sequence key={`click-${f}`} from={f} durationInFrames={3}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick} />
        </Sequence>
      ))}

      {/* SFX: card flip at start of each wiki card */}
      {WIKIS.map((_, i) => (
        <Sequence key={`flip-${i}`} from={WIKI_START + i * FRAMES_PER_WIKI} durationInFrames={10}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip} />
        </Sequence>
      ))}

      {/* Boot Terminal */}
      {showTerminal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isBootPhase ? 1 : terminalOpacity,
            zIndex: isBootPhase ? 20 : 5,
          }}
        >
          <div
            style={{
              width: '80%',
              transform: `scale(${windowScale})`,
              transformOrigin: 'center center',
            }}
          >
            <TerminalChrome title="shawnos.ai" accentColor={COLORS.green}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  minHeight: 160,
                }}
              >
                {frame >= 10 && (
                  <TypewriterText
                    text="$ ./boot shawnos.ai"
                    startFrame={10}
                    speed={0.8}
                    color={COLORS.green}
                    fontSize={20}
                    showCursor={frame < 25}
                    cursorColor={COLORS.green}
                  />
                )}

                {frame >= 25 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <span>loading system</span>
                      <span style={{ color: COLORS.green, fontVariantNumeric: 'tabular-nums' }}>
                        {Math.round(barProgress)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 8,
                        backgroundColor: COLORS.canvasSubtle,
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${barProgress}%`,
                          height: '100%',
                          backgroundColor: COLORS.green,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                )}

                {frame >= 55 && (
                  <TypewriterText
                    text="> system loaded — 3 sites | 7 wikis | 1 repo"
                    startFrame={55}
                    speed={1}
                    color={COLORS.textPrimary}
                    fontSize={16}
                    showCursor={false}
                    cursorColor={COLORS.green}
                  />
                )}
              </div>
            </TerminalChrome>
          </div>
        </div>
      )}

      {/* Wiki Cards Phase */}
      {!isBootPhase && (
        <>
          {/* Running counter — top right */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: COLORS.textMuted,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              total entries
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: COLORS.textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {counterValue}
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
              {wikiIndex + 1} / {WIKIS.length}
            </div>
          </div>

          {/* Wiki card — centered, slides horizontally */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              transform: `translateX(${cardTranslateX}px)`,
              opacity: cardOpacity,
            }}
          >
            <WikiCard
              name={wiki.name}
              count={wiki.count}
              label={wiki.label}
              highlights={wiki.highlights}
              accentColor={accent}
              animationProgress={highlightProgress}
            />
          </div>
        </>
      )}

      {/* Scanline overlay */}
      <ScanlineOverlay opacity={0.04} />
    </AbsoluteFill>
  );
};
