import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';<% if(offline) { %>
import { autoRehydrate, createPersistor } from 'redux-persist';<% } %>

export default function createStore(history, client, data<% if(offline) { %>, online = true, persistConfig = null<% } %>) {
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [createMiddleware(client), reduxRouterMiddleware];

  let finalCreateStore;
  if (__CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    const enhancers = <% if(offline) { %>(!online ? [autoRehydrate({ log: true })] : []).concat(<% } %>[
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]<% if(offline) { %>)<% } %>;
    finalCreateStore = compose(...enhancers)(_createStore);
  } else {
    const enhancers = <% if(offline) { %>(__CLIENT__ && !online ? [autoRehydrate()] : []).concat(<% } %>applyMiddleware(...middleware)<% if(offline) { %>)<% } %>;
    finalCreateStore = compose(<% if(offline) { %>...enhancers<% } else { %>enhancers<% } %>)(_createStore);
  }

  const reducer = require('./reducer');

  const store = finalCreateStore(reducer, data);<% if(offline) { %>
  if (persistConfig) createPersistor(store, persistConfig);
  store.dispatch({ type: 'PERSIST' });<% } %>

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
  }

  return store;
}
