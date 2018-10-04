import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Message = ({
  message, user, styles, startEdit
}) => (
  <Fragment>
    <h4 className="media-heading">
      {message.author ? message.author.email : 'Anonymous'}{' '}
      <small>{new Date(message.createdAt).toLocaleString()}</small>
      {user && message.author && user._id === message.author._id ? (
        <Fragment>
          {' '}
          <button
            type="button"
            className={cn('btn btn-sm btn-link', styles.controlBtn)}
            tabIndex={0}
            title="Edit"
            onClick={() => startEdit(message)}
            onKeyPress={() => startEdit(message)}
          >
            <span className="fa fa-pencil" aria-hidden="true" />
          </button>
        </Fragment>
      ) : null}
    </h4>
    {message.text}
  </Fragment>
);

Message.propTypes = {
  message: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string
  }),
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  startEdit: PropTypes.func.isRequired
};

Message.defaultProps = {
  user: null
};

export default Message;
