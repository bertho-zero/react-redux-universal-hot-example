import React from 'react';
import Loadable from 'react-loadable';

const LoginSuccessLoadable = Loadable({
  loader: () => import('./LoginSuccess'),
  loading: () => <div>Loading</div>
});

export default LoginSuccessLoadable;
