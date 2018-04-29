import React from 'react';
import Loadable from 'react-loadable';

const AboutLoadable = Loadable({
  loader: () => import('./About' /* webpackChunkName: 'about' */),
  loading: () => <div>Loading</div>
});

export default AboutLoadable;
