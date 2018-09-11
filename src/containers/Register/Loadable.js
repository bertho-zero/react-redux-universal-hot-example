import DefaultLoader from 'components/DefaultLoader';

const RegisterLoadable = DefaultLoader({
  loader: () => import('./Register' /* webpackChunkName: 'register' */).then(module => module.default)
});

export default RegisterLoadable;
