import React from 'react';
import Loadable from 'react-loadable';

const LoginLoadable = Loadable({
  loader: () => import('./Login' /* webpackChunkName: 'login' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default LoginLoadable;
