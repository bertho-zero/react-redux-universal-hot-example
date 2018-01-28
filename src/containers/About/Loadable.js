import React from 'react';
import Loadable from 'react-loadable';

const AboutLoadable = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ './About'),
  loading: () => <div>Loading</div>
});

export default AboutLoadable;
