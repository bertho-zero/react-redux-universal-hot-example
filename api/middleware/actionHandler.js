import PrettyError from 'pretty-error';
import * as actions from 'actions';
import mapUrl from 'utils/url';

const pretty = new PrettyError();

export default function actionHandler(app) {
  return async (req, res, next) => {
    const splittedUrlPath = req.url
      .split('?')[0]
      .split('/')
      .slice(1);
    const { action, params } = mapUrl(actions, splittedUrlPath);

    req.app = app;

    // TODO use next(error) instead of catchError ?
    const catchError = async error => {
      console.error('API ERROR:', pretty.render(error));
      res.status(error.status || 500).json(error);
    };

    if (action) {
      try {
        try {
          const result = await action(req, params);
          if (result instanceof Function) {
            result(res);
          } else {
            res.json(result);
          }
        } catch (reason) {
          if (reason && reason.redirect) {
            return res.redirect(reason.redirect);
          }
          return catchError(reason);
        }
      } catch (error) {
        return catchError(error);
      }
    } else {
      next();
    }
  };
}
