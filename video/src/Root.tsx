import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import { EPISODES } from './episodes';
import { buildTimeline, FPS } from './timeline';

// Una composición por episodio: Ep01, Ep02, …
export const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition
        key={ep.id}
        id={`Ep${String(ep.number).padStart(2, '0')}`}
        component={Episode}
        defaultProps={{ ep }}
        durationInFrames={buildTimeline(ep.id, ep.lines).total}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
