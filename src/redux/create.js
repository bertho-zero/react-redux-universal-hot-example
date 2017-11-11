import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createPersistor } from 'redux-persist';
import clientMiddleware from './middleware/clientMiddleware';
import createReducers from './reducer';

export function inject(store, reducers) {
  Object.entries(reducers).forEach(([name, reducer]) => {
    if (store.asyncReducers[name]) return;
    store.asyncReducers[name] = reducer;
  });

  store.replaceReducer(combineReducers(createReducers(store.asyncReducers)));
}

function getNoopReducers(reducers, data) {
  if (!data) return {};
  return Object.keys(data).reduce(
    (prev, next) => (reducers[next] ? prev : { ...prev, [next]: (state = {}) => state }),
    {}
  );
}

export default function createStore({
  history, data, helpers, persistConfig
}) {
  const middleware = [clientMiddleware(helpers), routerMiddleware(history)];

  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({
      collapsed: true
    });
    middleware.push(logger.__esModule ? logger.default : logger);
  }

  const enhancers = [applyMiddleware(...middleware)];

  if (__CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');

    Array.prototype.push.apply(enhancers, [
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  const finalCreateStore = compose(...enhancers)(_createStore);
  const reducers = createReducers();
  const noopReducers = getNoopReducers(reducers, data);
  const store = finalCreateStore(combineReducers({ ...noopReducers, ...reducers }), data);

  store.asyncReducers = {};
  store.inject = inject.bind(null, store);

  if (persistConfig) {
    createPersistor(store, persistConfig);
    store.dispatch({ type: 'PERSIST' });
  }

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      const reducer = require('./reducer');
      store.replaceReducer(combineReducers((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers)));
    });
  }

  return store;
}
