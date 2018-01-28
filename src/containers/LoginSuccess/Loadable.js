import React from 'react';
import Loadable from 'react-loadable';

const LoginSuccessLoadable = Loadable({
  loader: () => import(/* webpackChunkName: "login-success" */ './LoginSuccess'),
  loading: () => <div>Loading</div>
});

export default LoginSuccessLoadable;
