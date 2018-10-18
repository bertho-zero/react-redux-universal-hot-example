import _ from 'lodash';
import feathersNedb from 'feathers-nedb';
import { SOCKET_KEY } from '@feathersjs/socketio';
import NeDB from 'nedb';
import hooks from './hooks';

const updateVisitors = app => {
  const { connections } = app.channel('chat');

  app.service('messages').emit('updateVisitors', {
    authenticated: _.uniqBy(connections.filter(v => v.user).map(con => con.user), '_id'),
    anonymous: connections.filter(v => !v.user).length
  });
};

export default function messagesService(app) {
  const options = {
    Model: new NeDB({
      filename: `${__dirname}/messages.nedb`,
      autoload: true
    }),
    paginate: {
      default: 25,
      max: 100
    },
    events: ['updateVisitors']
  };

  app.use('/messages', feathersNedb(options));

  const service = app.service('messages');

  service.hooks(hooks);

  service.publish('created', () => app.channel('anonymous', 'authenticated'));

  service.publish('updateVisitors', () => app.channel('chat'));

  app.on('connection', connection => {
    const socket = connection[SOCKET_KEY];
    const chatChannel = app.channel('chat');

    socket.on('joinChat', () => {
      chatChannel.join(connection);
      updateVisitors(app);
    });

    socket.on('leaveChat', () => {
      chatChannel.leave(connection);
      updateVisitors(app);
    });

    socket.on('disconnect', () => {
      updateVisitors(app);
    });
  });
}
