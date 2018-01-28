import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import services from './services';
import channels from './channels';
import { actionHandler, logger, notFound, errorHandler } from './middleware';
import auth from './services/authentication';

process.on('unhandledRejection', error => console.error(error));

const app = express(feathers());

app
  .set('config', config)
  .use(morgan('dev'))
  .use(cookieParser())
  .use(session({
    secret: 'react and redux rule!!!!',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  // Core
  .configure(express.rest())
  .configure(socketio({ path: '/ws' }))
  .configure(auth)
  .use(actionHandler(app))
  .configure(services)
  .configure(channels)
  // Final handlers
  .use(notFound())
  .use(logger(app))
  .use(errorHandler());

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

const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

app.io.on('connection', socket => {
  socket.emit('news', { msg: "'Hello World!' from server" });

  socket.on('history', () => {
    for (let index = 0; index < bufferSize; index += 1) {
      const msgNo = (messageIndex + index) % bufferSize;
      const msg = messageBuffer[msgNo];
      if (msg) {
        socket.emit('msg', msg);
      }
    }
  });

  socket.on('msg', data => {
    const message = { ...data, id: messageIndex };
    messageBuffer[messageIndex % bufferSize] = message;
    messageIndex += 1;
    app.io.emit('msg', message);
  });
});
