import DefaultLoader from 'components/DefaultLoader';

const AboutLoadable = DefaultLoader({
  loader: () => import('./About' /* webpackChunkName: 'about' */).then(module => module.default)
});

export default AboutLoadable;
