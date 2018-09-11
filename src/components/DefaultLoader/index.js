import Loadable from 'react-loadable';
import DefaultLoader from './DefaultLoader';

export default opts => {
  const optionsObj = {
    loading: DefaultLoader,
    delay: 200,
    timeout: 10,
    ...opts
  };
  return Loadable(optionsObj);
};
