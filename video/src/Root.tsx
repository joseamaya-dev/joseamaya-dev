import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import { EP01 } from './ep01';
import { buildTimeline, FPS } from './timeline';

export const Root: React.FC = () => {
  const { total } = buildTimeline(EP01.id, EP01.lines);
  return (
    <Composition id="Ep01" component={Episode} durationInFrames={total} fps={FPS} width={1080} height={1920} />
  );
};
