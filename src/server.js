import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import httpProxy from 'http-proxy';
import VError from 'verror';
import PrettyError from 'pretty-error';
import http from 'http';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
// import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createMemoryHistory from 'history/createMemoryHistory';
import Loadable from 'react-loadable';
// import { Provider } from 'components';
import config from 'config';
import createStore from 'redux/create';
import apiClient from 'helpers/apiClient';
import Html from 'helpers/Html';
import routes from 'routes';
import { createApp } from 'app';

process.on('unhandledRejection', error => console.error(error));

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

app
  .use(morgan('dev', { skip: req => req.originalUrl.indexOf('/ws') !== -1 }))
  .use(cookieParser())
  .use(compression());

app.use('/dist/service-worker.js', (req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  return next();
});

app.use('/dist/dlls/:dllName.js', (req, res, next) => {
  fs.access(
    path.join(__dirname, '..', 'static', 'dist', 'dlls', `${req.params.dllName}.js`),
    fs.constants.R_OK,
    err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : next())
  );
});

app
  .use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
  .get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json')))
  .use(express.static(path.join(__dirname, '..', 'static')));

app.use((req, res, next) => {
  res.setHeader('X-Forwarded-For', req.ip);
  return next();
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, { target: `${targetUrl}/ws` });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const providers = {
    client: apiClient(req),
    app: createApp(req),
    restApp: createApp(req)
  };
  const history = createMemoryHistory(req.originalUrl);
  const store = createStore(history, providers);

  // const history = syncHistoryWithStore(memoryHistory, store);

  function hydrate() {
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={webpackIsomorphicTools.assets()} store={store} />).pipe(res);
  }

  if (__DISABLE_SSR__) {
    return hydrate();
  }

  const context = {};

  try {
    // TODO load data on server
    const component = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StaticRouter location={req.originalUrl} context={context}>
            {routes}
          </StaticRouter>
        </ConnectedRouter>
      </Provider>
    );
    const html = <Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />;

    res.status(200);

    res.send(`<!doctype html>${ReactDOM.renderToString(html)}`);
  } catch (mountError) {
    if (mountError.name === 'RedirectError') {
      return res.redirect(VError.info(mountError).to);
    }
    console.error('MOUNT ERROR:', pretty.render(mountError));
    res.status(500);
    hydrate();
  }
});

if (config.port) {
  Loadable.preloadAll().then(() => {
    server.listen(config.port, err => {
      if (err) {
        console.error(err);
      }
      console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
