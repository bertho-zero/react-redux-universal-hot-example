import React from 'react';
import Loadable from 'react-loadable';

const SurveyLoadable = Loadable({
  loader: () => import('./Survey' /* webpackChunkName: 'survey' */),
  loading: () => <div>Loading</div>
});

export default SurveyLoadable;
