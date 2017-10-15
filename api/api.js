import feathers from 'feathers';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest';
import socketio from 'feathers-socketio';
import config from './config';
import services from './services';
import { actionHandler, logger, notFound, errorHandler } from './middleware';
import auth from './services/authentication';

process.on('unhandledRejection', error => console.error(error));

const app = feathers();

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
  .configure(hooks())
  .configure(rest())
  .configure(socketio({ path: '/ws' }))
  .configure(auth)
  .use(actionHandler(app))
  .configure(services)
  .use(notFound())
  .use(logger(app))
  .use(errorHandler({
    json: (error, req, res) => {
      res.json(error);
    },
    html: (error, req, res) => {
      res.json(error);
      // render your error view with the error object
      // res.render('error', error); // set view engine of express if you want to use res.render
    }
  }));

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
  const user = socket.feathers.user ? { ...socket.feathers.user, password: undefined } : undefined;
  socket.emit('news', { msg: "'Hello World!' from server", user });

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
