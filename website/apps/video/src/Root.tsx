import { Composition } from 'remotion';
import { LeadMagnet } from './LeadMagnet';
import { LeadMagnetV2, SHAWNOS_TOTAL_FRAMES } from './LeadMagnetV2';
import { GtmOsVideo, GTM_OS_TOTAL_FRAMES } from './GtmOsVideo';
import { ContentOsVideo } from './ContentOsVideo';
import { ShawnOsThumbnail, GtmOsThumbnail, ContentOsThumbnail } from './Thumbnails';
import { FPS, TOTAL_FRAMES, PRESETS } from './lib/timing';
import { FPS_V2, TOTAL_FRAMES_V2 } from './lib/timing-v2';

export const Root: React.FC = () => {
  return (
    <>
      {/* ── V4 Lead Magnet (shawnos.ai) — 8.2s ── */}

      <Composition
        id="LeadMagnetV3"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="LeadMagnetV3Reels"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="LeadMagnetV3Landscape"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── GTM OS (thegtmos.ai) — 8.2s ── */}

      <Composition
        id="GtmOsLandscape"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="GtmOsLinkedIn"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmOsReels"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
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

      {/* ── Static Thumbnails (LinkedIn carousel images) ── */}

      <Composition
        id="ShawnOsThumb"
        component={ShawnOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmOsThumb"
        component={GtmOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="ContentOsThumb"
        component={ContentOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
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
