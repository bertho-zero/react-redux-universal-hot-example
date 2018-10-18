import auth from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
import { restrictToOwner } from 'feathers-authentication-hooks';
import {
  fastJoin, disallow, iff, isProvider, keep
} from 'feathers-hooks-common';
import { required } from 'utils/validation';
import { validateHook as validate } from 'hooks';

const schemaValidator = {
  text: required
};

function joinResolvers(context) {
  const { app } = context;
  const users = app.service('users');

  return {
    joins: {
      author: () => async message => {
        const author = message.sentBy ? await users.get(message.sentBy) : null;
        message.author = author;
        return message;
      }
    }
  };
}

const joinAuthor = [
  fastJoin(joinResolvers, {
    author: true
  }),
  local.hooks.protect('author.password')
];

const messagesHooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      validate(schemaValidator),
      context => {
        const { data, params } = context;

        context.data = {
          text: data.text,
          sentBy: params.user ? params.user._id : null, // Set the id of current user
          createdAt: new Date()
        };
      }
    ],
    update: disallow(),
    patch: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner({ ownerField: 'sentBy' }),
      iff(isProvider('external'), keep('text'))
    ],
    remove: disallow()
  },
  after: {
    all: [],
    find: joinAuthor,
    get: joinAuthor,
    create: joinAuthor,
    update: [],
    patch: joinAuthor,
    remove: []
  }
};

export default messagesHooks;
