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

    if (action) {
      try {
        const result = await action(req, params);
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      } catch (error) {
        if (error && error.redirect) {
          return res.redirect(error.redirect);
        }
        console.error('API ERROR:', pretty.render(error));
        res.status(error.code || 500).json(error);
      }
    } else {
      next();
    }
  };
}
