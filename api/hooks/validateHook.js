import errors from 'feathers-errors';
import { createAsyncValidator as validator } from 'utils/validation';

export default function validateHook(schema) {
  return async hook => {
    try {
      await validator(schema, { hook })(hook.data);
      return hook;
    } catch (errorsValidation) {
      if (Object.keys(errorsValidation).length) {
        throw new errors.BadRequest('Validation failed', errorsValidation);
      }
    }
  };
}
