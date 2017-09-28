import async from 'async';
import isPromise from 'is-promise';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';

export default function getRoutesUtils(store) {
  async function injectReducerAndRender(reducerPromises, containerPromise) {
    const reducerNames = Object.keys(reducerPromises);
    const reducers = await Promise.all(Object.values(reducerPromises));
    reducers.map((reducer, i) => store.inject(reducerNames[i], reducer.default || reducer));
    if (!isPromise(containerPromise) && typeof containerPromise === 'object') {
      const containerNames = Object.keys(containerPromise);
      const containers = await Promise.all(Object.values(containerPromise));
      return containers.reduce(
        (prev, next, i) => ({
          ...prev,
          [containerNames[i]]: next.default || next
        }),
        {}
      );
    }
    return containerPromise;
  }

  function onEnterChain(...listOfOnEnters) {
    return (nextState, replace, onEnterCb) => {
      let redirected = false;
      const wrappedReplace = (...args) => {
        replace(...args);
        redirected = true;
      };
      async.eachSeries(
        listOfOnEnters,
        async (onEnter, callback) => {
          try {
            if (!redirected) {
              await onEnter(store, nextState, wrappedReplace);
            }
            return callback();
          } catch (error) {
            return callback(error);
          }
        },
        err => {
          if (err) {
            return onEnterCb(err);
          }
          onEnterCb();
        }
      );
    };
  }

  function loadAuthIfNeeded() {
    if (!isAuthLoaded(store.getState())) {
      return store.dispatch(loadAuth()).catch(() => {});
    }
    return Promise.resolve();
  }

  async function checkPermissions(chainedPermissions) {
    await loadAuthIfNeeded();
    return chainedPermissions;
  }

  function enterPermissions(...listOfPermissions) {
    const permissions = [loadAuthIfNeeded].concat(listOfPermissions.map(perm => perm.onEnter || perm));
    return onEnterChain(...permissions);
  }

  function permissionsComponent(...listOfPermissions) {
    return (component = props => props.children) => ({
      onEnter: enterPermissions(...listOfPermissions),
      getComponent: () => checkPermissions(listOfPermissions.reduceRight((prev, next) => next(prev), component))
    });
  }

  return {
    injectReducerAndRender,
    permissionsComponent
  };
}
