import * as validation from '../../src/utils/validation';

function createAsyncValidator(rules, params) {
  return async (data = {}) => {
    const errors = validation.createValidator(rules, params)(data);

    const finalErrors = await Object.keys(errors).reduce(async (result, name) => {
      try {
        const error = await errors[name];
        return error ? Object.assign(result, { [name]: error }) : result;
      } catch (error) {
        return Object.assign(result, { [name]: error });
      }
    }, {});

    return (await Object.keys(finalErrors).length) ? Promise.reject(finalErrors) : data;
  };
}

function unique(field) {
  return (value, data, { hook }) =>
    hook.service.find({ query: { [field]: value } }).then(result => {
      if (result.total !== 0) {
        return Promise.reject('Already exist');
      }
    });
}

module.exports = {
  ...validation,
  unique,
  createAsyncValidator
};
