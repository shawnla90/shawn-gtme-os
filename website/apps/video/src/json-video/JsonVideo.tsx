import React from 'react';
import { Renderer } from '@json-render/remotion';
import type { TimelineSpec } from '@json-render/remotion';
import { componentRegistry } from './catalog';

export interface JsonVideoProps {
  readonly spec: TimelineSpec;
  [key: string]: unknown;
}

export const JsonVideo: React.FC<JsonVideoProps> = ({ spec }) => {
  return <Renderer spec={spec} components={componentRegistry} />;
};
