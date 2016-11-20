import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest/client';<% if(realtime) { %>
import socketio from 'feathers-socketio/client';<% } %>
import authentication from 'feathers-authentication/client';<% if(realtime) { %>
import io from 'socket.io-client';<% } %>
import superagent from 'superagent';
import config from './config';

const storage = __SERVER__ ? require('localstorage-memory') : window.localStorage;

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

const configureApp = transport => feathers()
  .configure(transport)
  .configure(hooks())
  .configure(authentication({ storage }));<% if(realtime) { %>

export const socket = io('', { path: host('/ws'), autoConnect: false });<% } %>

const app = configureApp(<% if(realtime) { %>socketio(socket)<% } else { %>rest(host('/api')).superagent(superagent)<% } %>);

export default app;<% if(realtime) { %>

export const restApp = configureApp(rest(host('/api')).superagent(superagent));<% } %>
