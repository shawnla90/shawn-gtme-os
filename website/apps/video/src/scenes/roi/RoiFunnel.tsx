import React from 'react';
import { Audio, Sequence } from 'remotion';
import { SceneWrapper } from '../../components/SceneWrapper';
import { FunnelWaterfall, FunnelStage } from '../../components/FunnelWaterfall';
import { COLORS } from '../../lib/tokens';
import { AUDIO, VOLUMES } from '../../lib/sounds';
import type { RoiVideoData } from '../../lib/roi-schema';
import { computeRoiFunnel } from '../../lib/roi-schema';

interface Props {
  data: RoiVideoData;
}

export const RoiFunnel: React.FC<Props> = ({ data }) => {
  const funnel = computeRoiFunnel(data);

  const stages: FunnelStage[] = [
    {
      label: 'leads',
      leftValue: funnel.baseline.leads,
      rightValue: funnel.gtme.leads,
    },
    {
      label: 'replies',
      leftValue: funnel.baseline.replies,
      rightValue: funnel.gtme.replies,
    },
    {
      label: 'meetings',
      leftValue: funnel.baseline.meetings,
      rightValue: funnel.gtme.meetings,
    },
    {
      label: 'deals',
      leftValue: funnel.baseline.deals,
      rightValue: funnel.gtme.deals,
    },
    {
      label: 'revenue',
      leftValue: Math.round(funnel.baseline.revenue / 1000),
      rightValue: Math.round(funnel.gtme.revenue / 1000),
      prefix: '$',
      suffix: 'K',
    },
  ];

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={20} scanlineOpacity={0.02}>
      <FunnelWaterfall
        leftHeader={data.baseline.label}
        rightHeader="GTMe OS"
        stages={stages}
        stageFrames={45}
      />

      {/* Whoosh on first stage */}
      <Sequence from={25} durationInFrames={30}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.4} />
      </Sequence>
    </SceneWrapper>
  );
};
