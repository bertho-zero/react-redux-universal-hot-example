import DefaultLoader from 'components/DefaultLoader';

const ChatFeathersLoadable = DefaultLoader({
  loader: () => import('./Chat' /* webpackChunkName: 'chat' */).then(module => module.default)
});

export default ChatFeathersLoadable;
