/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';
import createBrowserHistory from 'history/createBrowserHistory';
import Loadable from 'react-loadable';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import { getStoredState } from 'redux-persist';
import localForage from 'localforage';
import { socket, createApp } from 'app';
import createStore from 'redux/create';
import apiClient from 'helpers/apiClient';
import routes from 'routes';
import isOnline from 'utils/isOnline';
import asyncMatchRoutes from 'utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from 'components';

const persistConfig = {
  key: 'primary',
  storage: localForage,
  whitelist: ['auth', 'info', 'chat']
};

const dest = document.getElementById('content');

const app = createApp();
const restApp = createApp('rest');
const client = apiClient();
const providers = { app, restApp, client };

function initSocket() {
  socket.on('news', data => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', data => {
    console.log(data);
  });

  return socket;
}

global.socket = initSocket();

(async () => {
  const storedData = await getStoredState(persistConfig);
  const online = await (window.__data ? true : isOnline());

  if (online) {
    socket.open();
    await app.authenticate().catch(() => null);
  }

  const history = createBrowserHistory();
  const data = !online ? { ...storedData, ...window.__data, online } : { ...window.__data, online };
  const store = createStore({
    history,
    data,
    helpers: providers,
    persistConfig
  });

  const hydrate = async _routes => {
    const { components, match, params } = await asyncMatchRoutes(_routes, history.location.pathname);
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger('fetch', components, triggerLocals);
    await trigger('defer', components, triggerLocals);

    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store} {...providers}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes} store={store} helpers={providers}>
              {renderRoutes(_routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    );
  };

  await Loadable.preloadReady();

  await hydrate(routes);

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes).catch(err => {
        console.error('Error on routes reload:', err);
      });
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-reactroot']) {
      console.error('Server-side React render was discarded.\n' +
          'Make sure that your initial render does not contain any client-side code.');
    }
  }

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const devToolsDest = document.createElement('div');
    window.document.body.insertBefore(devToolsDest, null);
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDOM.hydrate(
      <Provider store={store}>
        <DevTools />
      </Provider>,
      devToolsDest
    );
  }

  if (online && !__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' });
        console.log('Service worker registered!');
      } catch (error) {
        console.log('Error registering service worker: ', error);
      }

      await navigator.serviceWorker.ready;
      console.log('Service Worker Ready');
    });
  }
})();
