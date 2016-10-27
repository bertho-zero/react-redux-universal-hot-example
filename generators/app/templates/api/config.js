<% if(auth && oauth.indexOf('Facebook') !== -1) { %>import { Strategy as FacebookStrategy } from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
<% } %><% if(auth) { %>const ONE_DAY = 60 * 60 * 24 * 1000;

<% } %>module.exports = {<% if(auth) { %>
  auth: {
    user: {
      idField: '_id'
    },
    local: {
      successHandler: () => (req, res) => res.json(res.data)
    },
    token: {
      secret: 'super secret'
    },
    cookie: {
      enabled: true,
      name: 'feathers-session',
      httpOnly: false,
      maxAge: ONE_DAY,
      secure: process.env.NODE_ENV === 'production'
    }<% if(auth && oauth.indexOf('Facebook') !== -1) { %>,
    facebook: {
      user: {
        idField: '_id',
      },
      provider: 'facebook',
      service: '/auth/facebook',
      strategy: FacebookStrategy,
      tokenStrategy: FacebookTokenStrategy,
      successHandler: () => (req, res) => res.json(res.data),
      clientID: '635147529978862',
      clientSecret: '28c16a4effa4a5f1371924e4dd12c8cd',
      permissions: {
        authType: 'rerequest',
        scope: ['public_profile', 'email']
      },
      profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name', 'age_range'],
      accessTokenField: 'accessToken'
    }<% } %>
  }
<% } %>};
