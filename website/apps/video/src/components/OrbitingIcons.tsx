import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useReelScale } from '../lib/useReelScale';

interface OrbitItem {
  name: string;
  icon: string;
  color: string;
}

interface OrbitingIconsProps {
  items: readonly OrbitItem[];
  radius?: number;
  iconSize?: number;
  /** Stagger delay between each icon entrance (frames) */
  stagger?: number;
  /** Frame when the highlight sweep starts (-1 = no sweep) */
  highlightStartFrame?: number;
  /** Frames per highlight step */
  highlightInterval?: number;
  /** Show connection lines to center */
  showLines?: boolean;
}

/**
 * Circular tool icon layout with staggered spring entrance.
 * Icons orbit around the center with optional highlight sweep.
 */
export const OrbitingIcons: React.FC<OrbitingIconsProps> = ({
  items,
  radius = 280,
  iconSize = 70,
  stagger = 8,
  highlightStartFrame = -1,
  highlightInterval = 15,
  showLines = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const orbitRadius = s(radius);
  const size = s(iconSize);
  const centerX = 540; // 1080 / 2
  const centerY = 480; // 960 / 2

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2; // start from top
        const ix = s(centerX) + Math.cos(angle) * orbitRadius;
        const iy = sv(centerY) + Math.sin(angle) * orbitRadius;

        // Staggered spring entrance
        const enterScale = spring({
          frame: Math.max(0, frame - i * stagger),
          fps,
          config: { damping: 12, stiffness: 180 },
        });

        // Highlight sweep
        const isHighlighted =
          highlightStartFrame >= 0 &&
          frame >= highlightStartFrame + i * highlightInterval &&
          frame < highlightStartFrame + i * highlightInterval + highlightInterval;

        const highlightScale = isHighlighted ? 1.2 : 1;
        const highlightGlow = isHighlighted ? s(15) : 0;

        // Connection line opacity
        const lineOpacity = interpolate(
          frame,
          [i * stagger + 10, i * stagger + 20],
          [0, 0.3],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <React.Fragment key={item.name}>
            {/* Connection line to center */}
            {showLines && enterScale > 0.5 && (
              <svg
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
                width="100%"
                height="100%"
              >
                <line
                  x1={s(centerX)}
                  y1={sv(centerY)}
                  x2={ix}
                  y2={iy}
                  stroke={item.color}
                  strokeWidth={2}
                  opacity={lineOpacity * (isHighlighted ? 2 : 1)}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                />
              </svg>
            )}

            {/* Icon node */}
            <div
              style={{
                position: 'absolute',
                left: ix - size / 2,
                top: iy - size / 2,
                width: size,
                height: size,
                borderRadius: s(16),
                backgroundColor: `${item.color}20`,
                border: `2px solid ${item.color}${isHighlighted ? 'FF' : '60'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${enterScale * highlightScale})`,
                boxShadow: highlightGlow > 0
                  ? `0 0 ${highlightGlow}px ${item.color}80`
                  : 'none',
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: s(24) }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: s(9),
                  color: isHighlighted ? item.color : COLORS.textSecondary,
                  marginTop: sv(2),
                  fontWeight: isHighlighted ? 700 : 400,
                }}
              >
                {item.name}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
