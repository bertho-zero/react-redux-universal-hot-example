export default function socketAuth(app) {
  return async (socket, next) => {
    const { cookie } = socket.request.headers;
    const cookies =
      cookie &&
      cookie.split('; ').reduce((prev, nextCookie) => {
        const [name, value] = nextCookie.split('=');
        return {
          ...prev,
          [name]: value
        };
      }, {});

    const accessToken = cookies && cookies['feathers-jwt'];

    socket._feathers = {}; // TODO remove this when possible...

    if (!accessToken) return next();

    try {
      const payload = await app.passport.verifyJWT(accessToken, app.get('auth'));
      const user = await app.service('users').get(payload.userId);
      Object.assign(socket.feathers, {
        accessToken,
        user,
        authenticated: true
      });
      next();
    } catch (e) {
      next();
    }
  };
}
