import { Composition } from 'remotion';
import { LeadMagnet } from './LeadMagnet';
import { LeadMagnetV2 } from './LeadMagnetV2';
import { GtmOsVideo } from './GtmOsVideo';
import { ContentOsVideo } from './ContentOsVideo';
import { FPS, TOTAL_FRAMES, PRESETS } from './lib/timing';
import { FPS_V2, TOTAL_FRAMES_V2 } from './lib/timing-v2';

export const Root: React.FC = () => {
  return (
    <>
      {/* ── V3 Lead Magnet (shawnos.ai) ── */}

      <Composition
        id="LeadMagnetV3"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="LeadMagnetV3Reels"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="LeadMagnetV3Landscape"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── GTM OS (thegtmos.ai) ── */}

      <Composition
        id="GtmOsLandscape"
        component={GtmOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="GtmOsLinkedIn"
        component={GtmOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmOsReels"
        component={GtmOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* ── Content OS (thecontentos.ai) ── */}

      <Composition
        id="ContentOsLandscape"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="ContentOsLinkedIn"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="ContentOsReels"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* ── V1 Compositions (60s, silent — kept for reference) ── */}

      <Composition
        id="LeadMagnet"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="LeadMagnetReels"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="LeadMagnetLandscape"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />
    </>
  );
};
