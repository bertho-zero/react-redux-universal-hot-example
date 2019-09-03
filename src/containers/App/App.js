import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { provideHooks } from 'redial';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';

import Helmet from 'react-helmet';
import qs from 'qs';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout as logoutAction } from 'redux/modules/auth';
import { Notifs, InfoBar } from 'components';
import config from 'config';

@provideHooks({
  fetch: async ({ store: { dispatch, getState } }) => {
    if (!isAuthLoaded(getState())) {
      await dispatch(loadAuth()).catch(() => null);
    }
    if (!isInfoLoaded(getState())) {
      await dispatch(loadInfo()).catch(() => null);
    }
  }
})
@connect(
  state => ({
    notifs: state.notifs,
    user: state.auth.user
  }),
  { logout: logoutAction }
)
@withRouter
class App extends Component {
  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    notifs: PropTypes.shape({
      global: PropTypes.array
    }).isRequired,
    logout: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  state = {
    user: this.props.user, // eslint-disable-line react/destructuring-assignment
    prevProps: this.props // eslint-disable-line react/no-unused-state
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    // Compare the incoming prop to previous prop
    const user = !_.isEqual(prevProps.user, props.user) ? props.user : state.user;

    if (!prevProps.user && props.user) {
      const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
      props.history.push(query.redirect || '/login-success');
    } else if (prevProps.user && !props.user) {
      // logout
      props.history.push('/');
    }

    return {
      user,
      // Store the previous props in state
      prevProps: props
    };
  }

  handleLogout = event => {
    const { logout } = this.props;

    event.preventDefault();
    logout();
  };

  render() {
    const { notifs, route } = this.props;
    const { user } = this.state;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar bg="light">
          <Navbar.Brand>
            <IndexLinkContainer to="/" activeStyle={{ color: '#33e0ff' }} className={styles.title}>
              <div className={styles.brand}>
                <span>{config.app.title}</span>
              </div>
            </IndexLinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/chat">
                <Nav.Link>Chat</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>

              {!user && (
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
              {!user && (
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              )}
              {user && (
                <LinkContainer to="/logout">
                  <Nav.Link className="logout-link" onClick={this.handleLogout}>
                    Logout
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            {user && (
              <p className="navbar-text">
                <strong>{user.email}</strong>
              </p>
            )}
            <Nav>
              <Nav.Link
                target="_blank"
                title="View on Github"
                href="https://github.com/bertho-zero/react-redux-universal-hot-example"
              >
                <i className="fa fa-github" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={styles.appContent}>
          {notifs.global && (
            <div className="container">
              <Notifs
                className={styles.notifs}
                namespace="global"
                NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
              />
            </div>
          )}

          {renderRoutes(route.routes)}
        </div>
        <InfoBar />

        <div className="well text-center">
          Have questions? Ask for help{' '}
          <a
            href="https://github.com/bertho-zero/react-redux-universal-hot-example/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            on Github
          </a>
          .
        </div>
      </div>
    );
  }
}

export default App;
