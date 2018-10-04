const LOAD = 'redux-example/chat/LOAD';
const LOAD_SUCCESS = 'redux-example/chat/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/chat/LOAD_FAIL';
const LIST_VISITORS = 'redux-example/chat/LIST_VISITORS';
const LIST_VISITORS_SUCCESS = 'redux-example/chat/LIST_VISITORS_SUCCESS';
const LIST_VISITORS_FAIL = 'redux-example/chat/LIST_VISITORS_FAIL';
const UPDATE_VISITORS = 'redux-example/chat/UPDATE_VISITORS';
const ADD_MESSAGE = 'redux-example/chat/ADD_MESSAGE';
const PATCH_MESSAGE = 'redux-example/chat/PATCH_MESSAGE';
const PATCH_MESSAGE_SUCCESS = 'redux-example/chat/PATCH_MESSAGE_SUCCESS';
const PATCH_MESSAGE_FAIL = 'redux-example/chat/PATCH_MESSAGE_FAIL';

const initialState = {
  loaded: false,
  messages: []
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
        messages: action.result.data.reverse()
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LIST_VISITORS_SUCCESS:
      return {
        ...state,
        visitors: action.result
      };
    case UPDATE_VISITORS:
      return {
        ...state,
        visitors: action.visitors
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.message)
      };
    case PATCH_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map(message => (message._id === action.result._id ? action.result : message))
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.chat && globalState.chat.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) => app.service('messages').find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    })
  };
}

export function listVisitors() {
  return {
    types: [LIST_VISITORS, LIST_VISITORS_SUCCESS, LIST_VISITORS_FAIL],
    promise: async ({ client }) => client.get('/visitors')
  };
}

export function updateVisitors(visitors) {
  return {
    type: UPDATE_VISITORS,
    visitors
  };
}

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    message
  };
}

export function patchMessage(id, data) {
  return {
    types: [PATCH_MESSAGE, PATCH_MESSAGE_SUCCESS, PATCH_MESSAGE_FAIL],
    promise: ({ app }) => app.service('messages').patch(id, data)
  };
}
