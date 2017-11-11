import React from 'react';
import Loadable from 'react-loadable';
import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { App, Home, NotFound } from 'containers';

/* eslint-disable react/prop-types */

const About = Loadable({
  loader: () => import('./containers/About/About'),
  loading: () => <div>Loading</div>
});

const Chat = Loadable({
  loader: () => import('./containers/Chat/Chat'),
  loading: () => <div>Loading</div>
});

const ChatFeathers = Loadable({
  loader: () => import('./containers/ChatFeathers/ChatFeathers'),
  loading: () => <div>Loading</div>
});

const Login = Loadable({
  loader: () => import('./containers/Login/Login'),
  loading: () => <div>Loading</div>
});

const LoginSuccess = Loadable({
  loader: () => import('./containers/LoginSuccess/LoginSuccess'),
  loading: () => <div>Loading</div>
});

const Register = Loadable({
  loader: () => import('./containers/Register/Register'),
  loading: () => <div>Loading</div>
});

const Survey = Loadable({
  loader: () => import('./containers/Survey/Survey'),
  loading: () => <div>Loading</div>
});

const Widgets = Loadable({
  loader: () => import('./containers/Widgets/Widgets'),
  loading: () => <div>Loading</div>
});

/* eslint-enable react/prop-types */

const isAuthenticated = connectedReduxRedirect({
  redirectPath: '/login',
  authenticatedSelector: state => state.auth.user !== null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedReduxRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.user === null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated',
  allowRedirectBack: false
});

const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/about', component: About },
      { path: '/chat', component: Chat },
      { path: '/chat-feathers', component: isAuthenticated(ChatFeathers) },
      { path: '/login', component: Login },
      { path: '/login-success', component: isAuthenticated(LoginSuccess) },
      { path: '/register', component: isNotAuthenticated(Register) },
      { path: '/survey', component: Survey },
      { path: '/widgets', component: Widgets },
      { component: NotFound }
    ]
  }
];

export default routes;
