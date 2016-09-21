const UPLOAD = 'redux-example/upload/UPLOAD';
const UPLOAD_SUCCESS = 'redux-example/upload/UPLOAD_SUCCESS';
const UPLOAD_FAIL = 'redux-example/upload/UPLOAD_FAIL';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case UPLOAD:
      return {
        ...state,
        uploading: true
      };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        uploading: false,
        uploadError: null
      };
    case UPLOAD_FAIL:
      console.log(action);
      return {
        ...state,
        uploading: false,
        uploadError: action.error.message || action.error
      };
    default:
      return state;
  }
}

export function sendFiles(data) {
  return {
    types: [UPLOAD, UPLOAD_SUCCESS, UPLOAD_FAIL],
    promise: client => client.post('/upload', { files: data.files })
  };
}
