import type { CSSProperties } from 'react';
import { COLORS, FONTS } from '../lib/tokens';

interface WikiCardProps {
  name: string;
  count: number;
  label: string;
  highlights: string[];
  accentColor?: string;
  animationProgress?: number;
}

/**
 * A stylised card representing one knowledge-base wiki.
 * animationProgress (0-1) drives the highlight items reveal.
 */
export const WikiCard: React.FC<WikiCardProps> = ({
  name,
  count,
  label,
  highlights,
  accentColor = COLORS.green,
  animationProgress = 1,
}) => {
  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 32,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.canvasSubtle,
    fontFamily: FONTS.mono,
    minWidth: 400,
    maxWidth: 520,
  };

  const nameStyle: CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    color: accentColor,
    letterSpacing: -0.5,
  };

  const countStyle: CSSProperties = {
    fontSize: 56,
    fontWeight: 800,
    color: COLORS.textPrimary,
    lineHeight: 1,
  };

  const labelStyle: CSSProperties = {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginLeft: 8,
  };

  const highlightContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 8,
  };

  return (
    <div style={cardStyle}>
      <div style={nameStyle}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={countStyle}>{count}</span>
        <span style={labelStyle}>{label}</span>
      </div>
      <div style={highlightContainerStyle}>
        {highlights.map((h, i) => {
          const itemProgress = Math.min(
            1,
            Math.max(0, (animationProgress - i * 0.25) / 0.25),
          );
          return (
            <div
              key={h}
              style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                opacity: itemProgress,
                transform: `translateX(${(1 - itemProgress) * 12}px)`,
              }}
            >
              <span style={{ color: accentColor, marginRight: 8 }}>{'>'}</span>
              {h}
            </div>
          );
        })}
      </div>
    </div>
  );
};
