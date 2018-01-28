import React from 'react';
import Loadable from 'react-loadable';

const ChatFeathersLoadable = Loadable({
  loader: () => import(/* webpackChunkName: "chat-feathers" */ './ChatFeathers'),
  loading: () => <div>Loading</div>
});

export default ChatFeathersLoadable;
