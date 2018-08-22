import React from 'react';
import Loadable from 'react-loadable';

const AboutLoadable = Loadable({
  loader: () => import('./About' /* webpackChunkName: 'about' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default AboutLoadable;
