import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import registerValidation from './registerValidation';

const Input = ({
  input, label, type, meta: { touched, error, submitError }, ...rest
}) => (
  <div className={`form-group ${(error || submitError) && touched ? 'has-error' : ''}`}>
    <label htmlFor={input.name} className="col-sm-2">
      {label}
    </label>
    <div className="col-sm-10">
      <input {...input} {...rest} type={type} className="form-control" />
      {(error || submitError) && touched && <span className="glyphicon glyphicon-remove form-control-feedback" />}
      {(error || submitError)
        && touched && (
        <div className="text-danger">
          <strong>{error || submitError}</strong>
        </div>
      )}
    </div>
  </div>
);

Input.propTypes = {
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired
};

const RegisterForm = ({ onSubmit, initialValues }) => (
  <Form
    initialValues={initialValues}
    onSubmit={values => onSubmit(values).then(() => {}, err => err)}
    validate={registerValidation}
    render={({ handleSubmit, submitError }) => (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Field name="email" type="text" component={Input} label="Email" />
        <Field name="password" type="password" component={Input} label="Password" />
        <Field name="password_confirmation" type="password" component={Input} label="Password confirmation" />
        {submitError && (
          <p className="text-danger">
            <strong>{submitError}</strong>
          </p>
        )}
        <button className="btn btn-success" type="submit">
          <i className="fa fa-sign-in" /> Register
        </button>
      </form>
    )}
  />
);

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any)
};

RegisterForm.defaultProps = {
  initialValues: {}
};

export default RegisterForm;
