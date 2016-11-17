import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
<% if(!auth && examples.indexOf('chatFeathers') === -1 && examples.indexOf('chat') === -1 && examples.indexOf('forms') === -1 && examples.indexOf('about') === -1) { %>/* <% } %>import { LinkContainer } from 'react-router-bootstrap';<% if(!auth && examples.indexOf('chatFeathers') === -1 && examples.indexOf('chat') === -1 && examples.indexOf('forms') === -1 && examples.indexOf('about') === -1) { %> */<% } %>
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';<% if(auth) { %>
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';<% } %>
import { Notifs, InfoBar } from 'components';<% if(auth) { %>
import { push } from 'react-router-redux';<% } %>
import config from 'config';
import { asyncConnect } from 'redux-connect';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    <% if(auth) { %>if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    <% } %>if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    notifs: state.notifs<% if(auth) { %>,
    user: state.auth.user<% } %>
  })<% if(auth) { %>,
  { logout, pushState: push }<% } %>)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,<% if(auth) { %>
    user: PropTypes.object,<% } %>
    notifs: PropTypes.object<% if(auth) { %>,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired<% } %>
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };<% if(auth) { %>

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };<% } %>

  render() {
    const { <% if(auth) { %>user, <% } %>notifs, children } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{ color: '#33e0ff' }}>
                <div className={styles.brand} />
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              <% if(examples.indexOf('chatFeathers') !== -1) { %>{user && <LinkContainer to="/chatFeathers">
                <NavItem>Chat with Feathers</NavItem>
              </LinkContainer>}<% if(examples.indexOf('chat') !== -1 || examples.indexOf('forms') !== -1 || examples.indexOf('about') !== -1) { %>
<% } %><% } %>
              <% if(examples.indexOf('chat') !== -1) { %><LinkContainer to="/chat">
                <NavItem eventKey={1}>Chat</NavItem>
              </LinkContainer>
              <% } %><% if(examples.indexOf('forms') !== -1) { %><LinkContainer to="/widgets">
                <NavItem eventKey={2}>Widgets</NavItem>
              </LinkContainer>
              <LinkContainer to="/survey">
                <NavItem eventKey={3}>Survey</NavItem>
              </LinkContainer>
              <% } %><% if(examples.indexOf('about') !== -1) { %><LinkContainer to="/about">
                <NavItem eventKey={4}>About Us</NavItem>
              </LinkContainer><% } %><% if(auth && examples.indexOf('chatFeathers') !== -1 && (examples.indexOf('chat') !== -1 || examples.indexOf('forms') !== -1 || examples.indexOf('about') !== -1)) { %>
<% } %>
              <% if(auth) { %>
              {!user && <LinkContainer to="/login">
                <NavItem eventKey={5}>Login</NavItem>
              </LinkContainer>}
              {!user && <LinkContainer to="/register">
                <NavItem eventKey={6}>Register</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/logout">
                <NavItem eventKey={7} className="logout-link" onClick={this.handleLogout}>
                  Logout
                </NavItem>
              </LinkContainer>}<% } %><% if(!auth && examples.indexOf('chatFeathers') === -1 && examples.indexOf('chat') === -1 && examples.indexOf('forms') === -1 && examples.indexOf('about') === -1) { %>{/* <LinkContainer to="/example">
                <NavItem eventKey={1}>Example</NavItem>
              </LinkContainer> */}<% } %>
            </Nav>
            <% if(auth) { %>{user && <p className="navbar-text">
              Logged in as <strong>{user.email}</strong>.
            </p>}
            <% } %><Nav navbar pullRight>
              <NavItem
                eventKey={1} target="_blank" title="View on Github"
                href="https://github.com/bertho-zero/react-redux-universal-hot-example">
                <i className="fa fa-github" />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {notifs.global && <div className="container">
            <Notifs
              className={styles.notifs}
              namespace="global"
              NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
            />
          </div>}

          {children}
        </div>
        <InfoBar />

        <div className="well text-center">
          Have questions? Ask for help{' '}
          <a href="https://github.com/bertho-zero/react-redux-universal-hot-example/issues" target="_blank">
            on Github
          </a>
          {' '}or in the{' '}
          <a href="https://discord.gg/0ZcbPKXt5bZZb1Ko" target="_blank">#react-redux-universal</a>
          {' '}Discord channel.
        </div>
      </div>
    );
  }
}
