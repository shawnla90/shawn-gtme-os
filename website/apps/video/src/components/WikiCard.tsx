import type { CSSProperties } from 'react';
import { COLORS, FONTS } from '../lib/tokens';

interface WikiCardProps {
  name: string;
  count: number;
  label: string;
  highlights: string[];
  accentColor?: string;
  animationProgress?: number;
  glowColor?: string;
  padding?: number;
  minWidth?: number;
  maxWidth?: number;
  nameFontSize?: number;
  countFontSize?: number;
  labelFontSize?: number;
  highlightFontSize?: number;
  gap?: number;
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
  glowColor,
  padding = 32,
  minWidth = 400,
  maxWidth = 520,
  nameFontSize = 28,
  countFontSize = 56,
  labelFontSize = 18,
  highlightFontSize = 16,
  gap = 16,
}) => {
  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.canvasSubtle,
    fontFamily: FONTS.mono,
    minWidth,
    maxWidth,
    ...(glowColor
      ? {
          boxShadow: `0 0 30px ${glowColor}22, 0 0 60px ${glowColor}11`,
        }
      : {}),
  };

  const nameStyle: CSSProperties = {
    fontSize: nameFontSize,
    fontWeight: 700,
    color: accentColor,
    letterSpacing: -0.5,
  };

  const countStyle: CSSProperties = {
    fontSize: countFontSize,
    fontWeight: 800,
    color: COLORS.textPrimary,
    lineHeight: 1,
  };

  const labelStyle: CSSProperties = {
    fontSize: labelFontSize,
    color: COLORS.textSecondary,
    marginLeft: Math.round(labelFontSize * 0.44),
  };

  const highlightContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: Math.round(gap * 0.375),
    marginTop: Math.round(gap * 0.5),
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
                fontSize: highlightFontSize,
                color: COLORS.textSecondary,
                opacity: itemProgress,
                transform: `translateX(${(1 - itemProgress) * 12}px)`,
              }}
            >
              <span style={{ color: accentColor, marginRight: Math.round(highlightFontSize * 0.5) }}>{'>'}</span>
              {h}
            </div>
          );
        })}
      </div>
    </div>
  );
};
