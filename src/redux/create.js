import {
  createStore as _createStore, applyMiddleware, compose, combineReducers
} from 'redux';
import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './middleware/clientMiddleware';
import createReducers from './reducer';

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

export function inject(store, reducers, persistConfig) {
  Object.keys(reducers).forEach(name => {
    const reducer = reducers[name];

    if (!store.asyncReducers[name]) {
      store.asyncReducers[name] = reducer.__esModule ? reducer.default : reducer;
    }
  });

  store.replaceReducer(combine(createReducers(store.asyncReducers), persistConfig));
}

function getNoopReducers(reducers, data) {
  if (!data) {
    return {};
  }

  return Object.keys(data).reduce((accu, key) => {
    if (reducers[key]) {
      return accu;
    }

    return {
      ...accu,
      [key]: (state = data[key]) => state
    };
  }, {});
}

export default function createStore({ data, helpers, persistConfig }) {
  const middleware = [clientMiddleware(helpers)];

  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({
      collapsed: true
    });
    middleware.push(logger.__esModule ? logger.default : logger);
  }

  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    __CLIENT__ && __DEVTOOLS__ && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : v => v
  )(_createStore);
  const reducers = createReducers();
  const noopReducers = getNoopReducers(reducers, data);
  const store = finalCreateStore(combine({ ...noopReducers, ...reducers }, persistConfig), data);

  store.asyncReducers = {};
  store.inject = _reducers => inject(store, _reducers, persistConfig);

  if (persistConfig) {
    const persistoid = createPersistoid(persistConfig);
    store.subscribe(() => {
      persistoid.update(store.getState());
    });
    store.dispatch({ type: REGISTER });
  }

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      let reducer = require('./reducer');
      reducer = combine((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers), persistConfig);
      store.replaceReducer(reducer);
    });
  }

  return store;
}
