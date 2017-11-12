import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import auth from './modules/auth';
import notifs from './modules/notifs';
import counter from './modules/counter';
import info from './modules/info';

export default function createReducers(asyncReducers) {
  return {
    router: routerReducer,
    online: (v = true) => v,
    form,
    notifs,
    auth,
    counter: multireducer({
      counter1: counter,
      counter2: counter,
      counter3: counter
    }),
    info,
    ...asyncReducers
  };
}
