import { getContext } from 'recompose';
import PropTypes from 'prop-types';

const withStore = getContext({
  store: PropTypes.any
});

export default withStore;
