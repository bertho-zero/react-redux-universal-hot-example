import React from 'react';
import { IndexRoute, Route } from 'react-router';<% if(auth) { %>
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';<% } %>
import {
  App,<% if(examples.indexOf('chat') !== -1) { %> Chat,<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %> ChatFeathers,<% } %> Home,<% if(examples.indexOf('forms') !== -1) { %> Widgets,<% } %><% if(examples.indexOf('about') !== -1) { %> About,<% } %>
  <% if(auth) { %>Register, Login, LoginSuccess, <% } %><% if(examples.indexOf('forms') !== -1) { %>Survey, <% } %>NotFound
} from 'containers';

export default store => {
  <% if(auth) { %>const loadAuthIfNeeded = cb => {
    if (!isAuthLoaded(store.getState())) {
      return store.dispatch(loadAuth()).then(() => cb());
    }
    return cb();
  };
  const checkUser = (cond, replace, cb) => {
    const { auth: { user } } = store.getState();
    if (!cond(user)) replace('/');
    cb();
  };

  const requireNotLogged = (nextState, replace, cb) => {
    const cond = user => !user;
    loadAuthIfNeeded(() => checkUser(cond, replace, cb));
  };
  const requireLogin = (nextState, replace, cb) => {
    const cond = user => !!user;
    loadAuthIfNeeded(() => checkUser(cond, replace, cb));
  };

  <% } %>/**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      {/* Home (main) route */}
      <IndexRoute component={Home} /><% if(auth) { %>

      {/* Routes requiring login */}
      <Route onEnter={requireLogin}>
        <Route path="loginSuccess" component={LoginSuccess} /><% if(examples.indexOf('chatFeathers') !== -1) { %>
        <Route path="chatFeathers" component={ChatFeathers} /><% } %>
      </Route>

      {/* Routes disallow login */}
      <Route onEnter={requireNotLogged}>
        <Route path="register" component={Register} />
      </Route><% } %>

      {/* Routes */}<% if(auth) { %>
      <Route path="login" component={Login} /><% } %><% if(examples.indexOf('about') !== -1) { %>
      <Route path="about" component={About} /><% } %><% if(examples.indexOf('forms') !== -1) { %>
      <Route path="survey" component={Survey} />
      <Route path="widgets" component={Widgets} /><% } %><% if(examples.indexOf('chat') !== -1) { %>
      <Route path="chat" component={Chat} /><% } %><% if(!auth && examples.indexOf('about') === -1 && examples.indexOf('forms') === -1 && examples.indexOf('chat') === -1) { %>
      // <Route path="example" component={Example} />
      <% } %>

      {/* Catch all route */}
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
