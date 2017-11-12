import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import reducer, * as chatActions from 'redux/modules/chat';
import { withApp } from 'hoc';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ chat: reducer });

    const state = getState();

    if (state.online) {
      return dispatch(chatActions.load()).catch(() => null);
    }
  }
})
@connect(
  state => ({
    user: state.auth.user,
    messages: state.chat.messages
  }),
  { ...chatActions }
)
@withApp
export default class ChatFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }).isRequired,
    addMessage: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  state = {
    message: '',
    error: null
  };

  componentDidMount() {
    this.props.app.service('messages').on('created', this.props.addMessage);
  }

  componentWillUnmount() {
    this.props.app.service('messages').removeListener('created', this.props.addMessage);
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await this.props.app.service('messages').create({ text: this.state.message });
      this.setState({ message: '', error: false });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  render() {
    const { user, messages } = this.props;
    const { error } = this.state;

    return (
      <div className="container">
        <h1>Chat</h1>

        {user && (
          <div>
            <ul>
              {messages.map(msg => (
                <li key={`chat.msg.${msg._id}`}>
                  {msg.sentBy.email}: {msg.text}
                </li>
              ))}
            </ul>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                ref={c => {
                  this.message = c;
                }}
                placeholder="Enter your message"
                value={this.state.message}
                onChange={event => this.setState({ message: event.target.value })}
              />
              <button className="btn" onClick={this.handleSubmit}>
                Send
              </button>
              {error && <div className="text-danger">{error}</div>}
            </form>
          </div>
        )}
      </div>
    );
  }
}
