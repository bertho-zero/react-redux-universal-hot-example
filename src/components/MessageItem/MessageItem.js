import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';

export default class MessageItem extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    styles: PropTypes.shape({
      controlBtn: PropTypes.string
    }).isRequired,
    patchMessage: PropTypes.func.isRequired,
    message: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    user: null
  };

  state = {
    editing: {}
  };

  startEdit(msg) {
    this.setState({
      editing: {
        ...this.state.editing,
        [msg._id]: msg.text
      }
    });
    console.log(this.state.editing);
  }

  stopEdit(msg) {
    this.setState({
      editing: {
        ...this.state.editing,
        [msg._id]: null
      }
    });
  }

  render() {
    const {
      message, user, patchMessage, styles
    } = this.props;
    const { editing } = this.state;

    const inEdition = editing[message._id];

    return (
      <div className="media" key={`chat.msg.${message._id}`}>
        <div className="media-body">
          {inEdition ? (
            <Form
              initialValues={{
                text: message.text
              }}
              onSubmit={values => {
                patchMessage(message._id, values);
                this.stopEdit(message);
              }}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <h4 className="media-heading">
                    {message.author ? message.author.email : 'Anonymous'}
                    <small>08 Apr 2018</small>{' '}
                    <button
                      type="submit"
                      className={cn('btn btn-sm btn-link', styles.controlBtn)}
                      tabIndex={0}
                      title="Validate"
                    >
                      <span className="fa fa-check text-success" aria-hidden="true" />
                    </button>
                    <button
                      className={cn('btn btn-sm btn-link', styles.controlBtn)}
                      tabIndex={0}
                      title="Cancel"
                      onClick={() => this.stopEdit(message)}
                      onKeyPress={() => this.stopEdit(message)}
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
          ) : (
            <Fragment>
              <h4 className="media-heading">
                {message.author ? message.author.email : 'Anonymous'}
                <small>08 Apr 2018</small>
                {user && message.author && user._id === message.author._id ? (
                  <Fragment>
                    {' '}
                    <button
                      className={cn('btn btn-sm btn-link', styles.controlBtn)}
                      tabIndex={0}
                      title="Edit"
                      onClick={() => this.startEdit(message)}
                      onKeyPress={() => this.startEdit(message)}
                    >
                      <span className="fa fa-pencil" aria-hidden="true" />
                    </button>
                  </Fragment>
                ) : null}
              </h4>
              {message.text}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
