import React from 'react';
import Loadable from 'react-loadable';

const ChatLoadable = Loadable({
  loader: () => import('./Chat' /* webpackChunkName: 'chat' */),
  loading: () => <div>Loading</div>
});

export default ChatLoadable;
