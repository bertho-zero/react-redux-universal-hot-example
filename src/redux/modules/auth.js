import { FORM_ERROR } from 'final-form';
import cookie from 'js-cookie';

const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const REGISTER = 'redux-example/auth/REGISTER';
const REGISTER_SUCCESS = 'redux-example/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'redux-example/auth/REGISTER_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false,
  user: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registeringIn: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registeringIn: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registeringIn: false,
        registerError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        accessToken: null,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data) {
      return Promise.reject(error.data);
    }
    const err = {
      [FORM_ERROR]: error.message
    };
    return Promise.reject(err);
  }
  return Promise.reject(error);
};

function setCookie({ app }) {
  return async response => {
    const payload = await app.passport.verifyJWT(response.accessToken);
    const options = payload.exp ? { expires: new Date(payload.exp * 1000) } : undefined;

    cookie.set('feathers-jwt', response.accessToken, options);
  };
}

function setToken({ client, app }) {
  return response => {
    const { accessToken } = response;

    app.set('accessToken', accessToken);
    client.setJwtToken(accessToken);
  };
}

function setUser({ app }) {
  return response => {
    app.set('user', response.user);
  };
}

/*
* Actions
* * * * */

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: async ({ app, client }) => {
      const response = await app.authenticate();
      await setCookie({ app })(response);
      setToken({
        client,
        app
      })(response);
      setUser({ app })(response);
      return response;
    }
  };
}

export function register(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: ({ app }) => app
      .service('users')
      .create(data)
      .catch(catchValidation)
  };
}

export function login(strategy, data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: async ({ client, app }) => {
      try {
        const response = await app.authenticate({
          ...data,
          strategy
        });
        await setCookie({ app })(response);
        setToken({
          client,
          app
        })(response);
        setUser({ app })(response);
        return response;
      } catch (error) {
        if (strategy === 'local') {
          return catchValidation(error);
        }
        throw error;
      }
    }
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: async ({ client, app }) => {
      await app.logout();
      setToken({
        client,
        app
      })({ accessToken: null });
      setUser({ app })({ user: null });
      cookie.set('feathers-jwt', '');
    }
  };
}
