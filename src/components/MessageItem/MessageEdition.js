import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';

const MessageEdition = ({
  message, patchMessage, styles, stopEdit
}) => (
  <Form
    initialValues={{
      text: message.text
    }}
    onSubmit={async values => {
      await patchMessage(message._id, values);
      stopEdit(message);
    }}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <h4 className="media-heading">
          {message.author ? message.author.email : 'Anonymous'}{' '}
          <small>{new Date(message.createdAt).toLocaleString()}</small>{' '}
          <button type="submit" className={cn('btn btn-sm btn-link', styles.controlBtn)} tabIndex={0} title="Validate">
            <span className="fa fa-check text-success" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn('btn btn-sm btn-link', styles.controlBtn)}
            tabIndex={0}
            title="Cancel"
            onClick={() => stopEdit(message)}
            onKeyPress={() => stopEdit(message)}
          >
            <span className="fa fa-close text-danger" aria-hidden="true" />
          </button>
        </h4>
        <Field name="text" validate={value => (value ? undefined : 'Required')}>
          {({ input, meta }) => (
            <div className={cn({ 'has-error': meta.error })}>
              <input {...input} type="text" className="form-control input-sm" placeholder="Message" />
            </div>
          )}
        </Field>
      </form>
    )}
  />
);

MessageEdition.propTypes = {
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  patchMessage: PropTypes.func.isRequired,
  message: PropTypes.objectOf(PropTypes.any).isRequired,
  stopEdit: PropTypes.func.isRequired
};

export default MessageEdition;
