import * as validation from '../../src/utils/validation';

function createAsyncValidator(rules, params) {
  return async (data = {}) => {
    const errors = validation.createValidator(rules, params)(data);

    const finalErrors = await Object.keys(errors).reduce(async (result, name) => {
      try {
        const error = await errors[name];
        return error ? Object.assign(result, { [name]: error }) : result;
      } catch (error) {
        return Object.assign(result, { [name]: error.message || error });
      }
    }, {});

    if (Object.keys(finalErrors).length) {
      throw finalErrors;
    }

    return data;
  };
}

function unique(field) {
  return async (value, data, { hook }) => {
    const result = await hook.service.find({ query: { [field]: value } });
    if (result.total !== 0) {
      throw new Error('Already exist');
    }
  };
}

module.exports = {
  ...validation,
  unique,
  createAsyncValidator
};
