import auth from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';
import local from '@feathersjs/authentication-local';
// import oauth1 from '@feathersjs/authentication-oauth1';
import oauth2 from '@feathersjs/authentication-oauth2';
import FacebookTokenStrategy from 'passport-facebook-token';

function populateUser() {
  return context => {
    const { result, params } = context;

    result.user = params.user;
  };
}

export default function authenticationService(app) {
  const config = app.get('config').auth;

  app
    .configure(auth(config))
    .configure(jwt())
    .configure(local()) // .configure(oauth1()) // TODO twitter example
    .configure(
      oauth2({
        name: 'facebook', // if the name differs from your config key you need to pass your config options explicitly
        Strategy: FacebookTokenStrategy
      })
    );

  app.service('authentication').hooks({
    before: {
      // You can chain multiple strategies on create method
      create: auth.hooks.authenticate(['jwt', 'local', 'facebook']),
      remove: auth.hooks.authenticate('jwt')
    },
    after: {
      create: [populateUser(), local.hooks.protect('user.password')]
    }
  });
}
