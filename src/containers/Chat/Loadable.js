import React from 'react';
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./Chat'),
  loading: () => <div>Loading</div>
});
