import type { CSSProperties } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  startFrame?: number;
  durationFrames?: number;
  fontSize?: number;
  color?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationFrames = 30,
  fontSize = 48,
  color = COLORS.textPrimary,
  suffix = '',
  prefix = '',
}) => {
  const frame = useCurrentFrame();

  const value = Math.round(
    interpolate(frame, [startFrame, startFrame + durationFrames], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const style: CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize,
    fontWeight: 700,
    color,
    fontVariantNumeric: 'tabular-nums',
    display: 'inline-block',
  };

  return <span style={style}>{prefix}{value}{suffix}</span>;
};
