import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import RegisterForm from 'components/RegisterForm/RegisterForm';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';

@connect(
  () => ({}),
  { ...notifActions, ...authActions }
)
class Register extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    register: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  };

  getInitialValues = () => {
    const { location } = this.props;

    return location.state && location.state.oauth;
  };

  register = async data => {
    const { register } = this.props;

    const result = await register(data);
    this.successRegister();

    return result;
  };

  successRegister = () => {
    const { notifSend } = this.props;

    notifSend({
      message: "You're now registered !",
      kind: 'success',
      dismissAfter: 2000
    });
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Register" />
        <h1>Register</h1>
        <RegisterForm onSubmit={this.register} initialValues={this.getInitialValues()} />
      </div>
    );
  }
}

export default Register;
