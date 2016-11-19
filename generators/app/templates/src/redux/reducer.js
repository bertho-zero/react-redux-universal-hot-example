import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';<% if(auth || examples.indexOf('forms') !== -1) { %>
import { reducer as form } from 'redux-form';<% } %><% if(auth) { %>
import auth from './modules/auth';<% } %>
import notifs from './modules/notifs';
import counter from './modules/counter';
import info from './modules/info';<% if(examples.indexOf('forms') !== -1) { %>
import widgets from './modules/widgets';
import survey from './modules/survey';<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %>
import chat from './modules/chat';<% } %>

export default function createReducer(asyncReducers) {
  return combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,<% if(offline) { %>
    online: (v = true) => v,<% } %><% if(auth || examples.indexOf('forms') !== -1) { %>
    form,<% } %>
    notifs,<% if(auth) { %>
    auth,<% } %>
    counter: multireducer({
      counter1: counter,
      counter2: counter,
      counter3: counter
    }),
    info<% if(examples.indexOf('forms') !== -1) { %>,
    widgets,
    survey<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %>,
    chat<% } %>,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
