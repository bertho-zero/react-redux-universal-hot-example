import React from 'react';
import Loadable from 'react-loadable';

const ChatFeathersLoadable = Loadable({
  loader: () => import('./ChatFeathers'),
  loading: () => <div>Loading</div>
});

export default ChatFeathersLoadable;
