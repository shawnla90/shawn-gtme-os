import React from 'react';
import { Audio, Sequence } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { ComparisonTable, ComparisonRow } from '../../components/ComparisonTable';
import { COLORS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import type { RoiVideoData } from '../../lib/roi-schema';

interface Props {
  data: RoiVideoData;
}

export const RoiComparison: React.FC<Props> = ({ data }) => {
  const rows: ComparisonRow[] = [
    {
      label: 'cost / month',
      left: `$${data.baseline.costPerMonth.toLocaleString()}`,
      right: 'built-in',
    },
    {
      label: 'reply rate',
      left: `${(data.baseline.replyRate * 100).toFixed(1)}%`,
      right: `${(data.gtme.replyRate * 100).toFixed(0)}%`,
      showBar: true,
      barLeftPct: data.baseline.replyRate / data.gtme.replyRate,
      barRightPct: 1,
    },
    {
      label: 'channels',
      left: data.baseline.channels,
      right: data.gtme.channels,
    },
    {
      label: 'speed',
      left: data.baseline.speedDays,
      right: data.gtme.speed,
    },
    {
      label: 'personalization',
      left: data.baseline.personalization,
      right: data.gtme.personalization,
    },
  ];

  return (
    <SceneWrapper accentColor={COLORS.teal} particleCount={20} scanlineOpacity={0.02}>
      <ComparisonTable
        leftHeader={data.baseline.label}
        rightHeader="GTMe OS"
        rows={rows}
        staggerFrames={40}
      />

      {/* Card flip SFX on first row */}
      <Sequence from={30} durationInFrames={30}>
        <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip * 0.5} />
      </Sequence>
    </SceneWrapper>
  );
};
