import React from 'react';
import Loadable from 'react-loadable';

const RegisterLoadable = Loadable({
  loader: () => import('./Register'),
  loading: () => <div>Loading</div>
});

export default RegisterLoadable;
