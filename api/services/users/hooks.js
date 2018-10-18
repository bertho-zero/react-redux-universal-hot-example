import auth from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
import errors from '@feathersjs/errors';
import { restrictToOwner } from 'feathers-authentication-hooks';
import { discard } from 'feathers-hooks-common';
import { validateHook } from 'hooks';
import {
  required, email, match, unique
} from 'utils/validation';

const schemaValidator = {
  email: [required, email, unique('email')],
  password: required,
  password_confirmation: [required, match('password')]
};

function validate() {
  return context => {
    const { data } = context;

    if (data.facebook && !data.email) {
      throw new errors.BadRequest('Incomplete oauth registration', data);
    }

    return validateHook(schemaValidator)(context);
  };
}

const userHooks = {
  before: {
    find: auth.hooks.authenticate('jwt'),
    get: auth.hooks.authenticate('jwt'),
    create: [validate(), discard('password_confirmation'), local.hooks.hashPassword()],
    update: [auth.hooks.authenticate('jwt'), restrictToOwner({ ownerField: '_id' })],
    patch: [auth.hooks.authenticate('jwt'), restrictToOwner({ ownerField: '_id' })],
    remove: [auth.hooks.authenticate('jwt'), restrictToOwner({ ownerField: '_id' })]
  },
  after: {
    all: local.hooks.protect('password'),
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

export default userHooks;
