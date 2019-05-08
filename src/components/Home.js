import React from 'react';
import Mix from './Mix.js';

const Home = ({mixes, ...props}) => (
  <div className="flex flex-wrap justify-between mixes ph3 ph4-l">
    {mixes.slice(0, 6).map(mix => (
      <div className="mix mb4 pad-bottom">
        <Mix {...props} {...mix} id={mix.key} />
      </div>
    ))}
  </div>
);
export default Home;
