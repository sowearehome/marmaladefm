import React from 'react';

//component wraps around anything so that on click it'll start playing a mix,
//provides functionality rather than design
const PlayMix = ({playMix, id, currentMix, playing, children}) => (
  <div
    className={`pointer ${id === currentMix && playing ? 'playing' : 'pause'}`}
    onClick={() => playMix(id)}
  >
    {children}
  </div>
);

export default PlayMix;
