import { getContext } from 'recompose';
import PropTypes from 'prop-types';

const withApp = getContext({
  app: PropTypes.any
});

export default withApp;
