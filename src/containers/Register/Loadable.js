import React from 'react';
import Loadable from 'react-loadable';

const RegisterLoadable = Loadable({
  loader: () => import('./Register' /* webpackChunkName: 'register' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default RegisterLoadable;
