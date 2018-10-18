import _ from 'lodash';
import { SOCKET_KEY } from '@feathersjs/socketio';

export default function customService(app) {
  app.use('/load-info', (req, res) => {
    res.json({
      message: 'This came from the api server',
      time: Date.now()
    });
  });

  app.use('/visitors', (req, res) => {
    const { connections } = app.channel('chat');
    res.json({
      authenticated: _.uniqBy(connections.filter(v => v.user).map(con => con.user), '_id'),
      anonymous: connections.filter(v => !v.user).length
    });
  });

  app.on('connection', connection => {
    const socket = connection[SOCKET_KEY];
    socket.emit('news', { msg: "'Hello World!' from server" });
  });
}
