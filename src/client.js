/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';
import { createBrowserHistory } from 'history';
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
import { RouterTrigger, Provider } from 'components';
import NProgress from 'nprogress';

const persistConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler(inboundState, originalState) {
    // Ignore state from cookies, only use preloadedState from window object
    return originalState;
  },
  whitelist: ['auth', 'info', 'chat']
};

const dest = document.getElementById('content');

const app = createApp();
const client = apiClient();
const providers = {
  app,
  client
};

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

initSocket();

(async () => {
  const preloadedState = await getStoredState(persistConfig);
  const online = window.__data ? true : await isOnline();

  if (online) {
    socket.open();
    await app.authenticate().catch(() => null);
  }

  const history = createBrowserHistory();
  const store = createStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  const triggerHooks = async (_routes, pathname) => {
    NProgress.start();

    const { components, match, params } = await asyncMatchRoutes(_routes, pathname);
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger('inject', components, triggerLocals);

    // Don't fetch data for initial route, server has already done the work:
    if (window.__PRELOADED__) {
      // Delete initial data so that subsequent data fetches can occur:
      delete window.__PRELOADED__;
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      await trigger('fetch', components, triggerLocals);
    }
    await trigger('defer', components, triggerLocals);

    NProgress.done();
  };

  const hydrate = _routes => {
    const element = (
      <HotEnabler>
        <Provider store={store} {...providers}>
          <Router history={history}>
            <RouterTrigger trigger={pathname => triggerHooks(_routes, pathname)}>{renderRoutes(_routes)}</RouterTrigger>
          </Router>
        </Provider>
      </HotEnabler>
    );

    if (dest.hasChildNodes()) {
      ReactDOM.hydrate(element, dest);
    } else {
      ReactDOM.render(element, dest);
    }
  };

  await Loadable.preloadReady();

  hydrate(routes);

  // Hot reload
  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes).catch(err => {
        console.error('Error on routes reload:', err);
      });
    });
  }

  // Server-side rendering check
  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
  }

  // Service worker
  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' });
      registration.onupdatefound = () => {
        // The updatefound event implies that reg.installing is set; see
        // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
        const installingWorker = registration.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // It's the perfect time to display a "New content is available; please refresh."
                // message in the page's interface.
                console.log('New or updated content is available.');
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
            default:
          }
        };
      };
    } catch (error) {
      console.log('Error registering service worker: ', error);
    }

    await navigator.serviceWorker.ready;
    console.log('Service Worker Ready');
  }
})();
