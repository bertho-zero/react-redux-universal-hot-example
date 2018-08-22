import React from 'react';
import Loadable from 'react-loadable';

const ChatFeathersLoadable = Loadable({
  loader: () => import('./Chat' /* webpackChunkName: 'chat' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default ChatFeathersLoadable;
