import React from 'react';
import Loadable from 'react-loadable';

const WidgetsLoadable = Loadable({
  loader: () => import('./Widgets'),
  loading: () => <div>Loading</div>
});

export default WidgetsLoadable;
