const errors = require('@feathersjs/errors');

export default function notFound() {
  return (req, res, next) => {
    next(new errors.NotFound('Page not found'));
  };
}
