import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { ParticleField } from './ParticleField';
import { ScanlineOverlay } from './ScanlineOverlay';

interface SceneWrapperProps {
  children: ReactNode;
  accentColor?: string;
  particleCount?: number;
  scanlineOpacity?: number;
}

/**
 * Wraps every scene with consistent visual layers:
 * 1. Canvas background
 * 2. Radial vignette (darkens edges)
 * 3. Accent color wash at 3% opacity
 * 4. ParticleField (ambient noise particles)
 * 5. Scene content (children)
 * 6. Film grain overlay (SVG feTurbulence at 5% opacity)
 * 7. ScanlineOverlay (CRT lines)
 */
export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  children,
  accentColor = COLORS.green,
  particleCount = 30,
  scanlineOpacity = 0.04,
}) => {
  const frame = useCurrentFrame();

  const vignetteStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const colorWashStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: accentColor,
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 2,
  };

  const grainStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    opacity: 0.05,
    zIndex: 98,
  };

  // Animate grain seed for subtle variation
  const grainSeed = frame % 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* 2. Vignette */}
      <div style={vignetteStyle} />

      {/* 3. Accent color wash */}
      <div style={colorWashStyle} />

      {/* 4. Particle field */}
      <ParticleField count={particleCount} color={accentColor} opacity={0.4} speed={0.006} />

      {/* 5. Scene content */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        {children}
      </AbsoluteFill>

      {/* 6. Film grain (SVG feTurbulence) */}
      <div style={grainStyle}>
        <svg width="100%" height="100%">
          <filter id={`grain-${grainSeed}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed={grainSeed}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${grainSeed})`} />
        </svg>
      </div>

      {/* 7. Scanline overlay */}
      <ScanlineOverlay opacity={scanlineOpacity} />
    </AbsoluteFill>
  );
};
