import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import axios from 'axios';
import config from './config';

const storage = __SERVER__ ? null : require('localforage');

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

const configureApp = transport =>
  feathers()
    .configure(transport)
    .configure(authentication({ storage }));

export const socket = io('', { path: host('/ws'), autoConnect: false });

export function createApp(req) {
  if (req === 'rest') {
    return configureApp(rest(host('/api')).axios(axios));
  }

  if (__SERVER__ && req) {
    const app = configureApp(rest(host('/api')).axios(axios.create({
      headers: {
        Cookie: req.get('cookie'),
        authorization: req.header('authorization') || ''
      }
    })));

    const accessToken = req.header('authorization') || (req.cookies && req.cookies['feathers-jwt']);
    app.set('accessToken', accessToken);

    return app;
  }

  return configureApp(socketio(socket));
}
