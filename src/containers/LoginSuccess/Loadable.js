import DefaultLoader from 'components/DefaultLoader';

const LoginSuccessLoadable = DefaultLoader({
  loader: () => import('./LoginSuccess' /* webpackChunkName: 'loggin-success' */).then(module => module.default)
});

export default LoginSuccessLoadable;
