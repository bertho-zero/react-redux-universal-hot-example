import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import MessageEdition from './MessageEdition';

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

  startEdit = msg => {
    const { editing } = this.state;

    this.setState({
      editing: {
        ...editing,
        [msg._id]: true
      }
    });
  };

  stopEdit = msg => {
    const { editing } = this.state;

    this.setState({
      editing: {
        ...editing,
        [msg._id]: null
      }
    });
  };

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
            <MessageEdition message={message} patchMessage={patchMessage} styles={styles} stopEdit={this.stopEdit} />
          ) : (
            <Message message={message} user={user} styles={styles} startEdit={this.startEdit} />
          )}
        </div>
      </div>
    );
  }
}
