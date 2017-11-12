import { matchRoutes } from 'react-router-config';

const asyncMatchRoutes = (routes, pathname) =>
  matchRoutes(routes, pathname)
    .map(v => v.route.component)
    .reduce(async (result, component) => {
      if (component.preload) {
        const res = await component.preload();
        const ret = [...(await result), component, ...[].concat(res)];
        return ret;
      }
      return [...(await result), component];
    }, []);

export default asyncMatchRoutes;
