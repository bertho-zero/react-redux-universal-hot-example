import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { withContext } from 'recompose';

const Provider = withContext(
  {
    app: PropTypes.objectOf(PropTypes.any).isRequired
  },
  ({ app }) => ({ app })
)(ReduxProvider);

export default Provider;
