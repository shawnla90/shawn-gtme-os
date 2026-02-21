import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '@remotion/noise';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}

/**
 * Noise-driven ambient background particles.
 * Each particle drifts organically using Perlin noise.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 40,
  color = 'rgba(78, 195, 115, 0.3)',
  opacity = 0.6,
  speed = 0.008,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    // Base position seeded by index
    const baseX = ((i * 127 + 53) % 100) / 100;
    const baseY = ((i * 91 + 37) % 100) / 100;

    // Drift via noise
    const nx = noise2D(`px-${i}`, frame * speed, i * 0.5) * 0.08;
    const ny = noise2D(`py-${i}`, i * 0.5, frame * speed) * 0.08;

    const x = (baseX + nx) * width;
    const y = (baseY + ny) * height;

    // Size varies per particle
    const size = 2 + (i % 3);

    // Subtle pulse
    const pulse = 0.5 + 0.5 * noise2D(`po-${i}`, frame * 0.02, 0);

    particles.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: pulse * opacity,
        }}
      />,
    );
  }

  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
  };

  return <div style={containerStyle}>{particles}</div>;
};
