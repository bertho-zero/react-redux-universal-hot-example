import DefaultLoader from 'components/DefaultLoader';

const LoginLoadable = DefaultLoader({
  loader: () => import('./Login' /* webpackChunkName: 'login' */).then(module => module.default)
});

export default LoginLoadable;
