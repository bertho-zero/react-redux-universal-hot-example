const IS_VALID = '<%- slug %>/survey/IS_VALID';
const IS_VALID_SUCCESS = '<%- slug %>/survey/IS_VALID_SUCCESS';
const IS_VALID_FAIL = '<%- slug %>/survey/IS_VALID_FAIL';

const initialState = {};

export default function reducer(state = initialState/* , action = {} */) {
  return state;
}

export function isValidEmail(data) {
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: client => client.post('/survey/isValid', {
      data
    })
  };
}
