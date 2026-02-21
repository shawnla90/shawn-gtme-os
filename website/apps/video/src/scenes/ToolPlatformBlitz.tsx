import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS } from '../lib/tokens';
import { SHAWNOS_BLITZ } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

interface ToolBlitzProps {
  items?: ReadonlyArray<{ readonly name: string; readonly color: string }>;
  framesPerItem?: number;
  /** Counter label groups: [firstLabel, secondLabel, dividerIndex] */
  labelGroups?: { first: string; second: string; divider: number };
}

/**
 * Ultra-fast name montage — platforms, tools, MCP servers, etc.
 * Configurable via props; defaults to ShawnOS blitz.
 */
export const ToolPlatformBlitz: React.FC<ToolBlitzProps> = ({
  items: itemsProp,
  framesPerItem: fpProp,
  labelGroups,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  const ITEMS = itemsProp ?? SHAWNOS_BLITZ;
  const FRAMES_PER_ITEM = fpProp ?? 6;
  const MONTAGE_END = FRAMES_PER_ITEM * ITEMS.length;
  const FLASH_START = MONTAGE_END;

  const labels = labelGroups ?? { first: 'platforms', second: 'tools', divider: 5 };

  const itemIndex = Math.min(
    Math.floor(frame / FRAMES_PER_ITEM),
    ITEMS.length - 1,
  );
  const localFrame = frame - itemIndex * FRAMES_PER_ITEM;
  const current = ITEMS[itemIndex];

  const nameScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 400 },
  });

  const itemOpacity = interpolate(
    localFrame,
    [0, 1, FRAMES_PER_ITEM - 2, FRAMES_PER_ITEM],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const flashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_START + 3, FLASH_START + 5],
    [0, 0.7, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const counterLabel = frame < MONTAGE_END
    ? (itemIndex < labels.divider ? labels.first : labels.second)
    : 'total';
  const counterValue = frame < MONTAGE_END
    ? itemIndex + 1
    : ITEMS.length;

  const isMontage = frame < MONTAGE_END;

  return (
    <SceneWrapper accentColor={current.color} particleCount={30}>
      <Sequence from={0} durationInFrames={10}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh} />
      </Sequence>

      {ITEMS.map((_, i) => (
        <Sequence key={`blitz-${i}`} from={i * FRAMES_PER_ITEM} durationInFrames={4}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip * 0.6} />
        </Sequence>
      ))}

      <Sequence from={FLASH_START} durationInFrames={10}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp * 0.7} />
      </Sequence>

      {/* Counter — top right */}
      <div
        style={{
          position: 'absolute',
          top: s(32),
          right: s(32),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: s(2),
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: s(12),
            color: COLORS.textMuted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {counterLabel}
        </div>
        <div
          style={{
            fontSize: s(32),
            fontWeight: 800,
            color: COLORS.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counterValue}
        </div>
        <div style={{ fontSize: s(11), color: COLORS.textMuted }}>
          {itemIndex + 1} / {ITEMS.length}
        </div>
      </div>

      {isMontage && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: s(8),
            opacity: itemOpacity,
          }}
        >
          <div
            style={{
              fontSize: s(64),
              fontWeight: 800,
              color: current.color,
              transform: `scale(${nameScale})`,
              transformOrigin: 'center center',
              textAlign: 'center',
              letterSpacing: s(1),
              textShadow: `0 0 ${s(25)}px ${current.color}55`,
            }}
          >
            {current.name}
          </div>

          <div style={{ display: 'flex', gap: s(6) }}>
            {ITEMS.map((item, i) => (
              <div
                key={item.name}
                style={{
                  width: s(6),
                  height: s(6),
                  borderRadius: '50%',
                  backgroundColor: i === itemIndex ? item.color : COLORS.textMuted,
                  opacity: i === itemIndex ? 1 : 0.25,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {frame >= FLASH_START && (
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
    </SceneWrapper>
  );
};
