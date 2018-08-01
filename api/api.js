import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import PrettyError from 'pretty-error';
import config from './config';
import services from './services';
import channels from './channels';

const pretty = new PrettyError();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, pretty.render(reason));
});

const app = express(feathers());

app
  .set('config', config)
  .use(morgan('dev'))
  .use(cookieParser())
  .use(
    session({
      secret: 'react and redux rule!!!!',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    })
  )
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  // Core
  .configure(express.rest())
  .configure(socketio({ path: '/ws' }))
  .configure(services)
  .configure(channels)
  // Final handlers
  .use(express.notFound())
  .use(
    express.errorHandler({
      logger: {
        error: error => {
          if (error && error.code !== 404) {
            console.error('API ERROR:', pretty.render(error));
          }
        }
      }
    })
  );

if (process.env.APIPORT) {
  app.listen(process.env.APIPORT, err => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', process.env.APIPORT);
    console.info('==> 💻  Send requests to http://localhost:%s', process.env.APIPORT);
  });
} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}
