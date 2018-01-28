import React from 'react';
import Loadable from 'react-loadable';

const LoginLoadable = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ './Login'),
  loading: () => <div>Loading</div>
});

export default LoginLoadable;
