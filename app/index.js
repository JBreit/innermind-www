const express = require('express');
const { json, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('../utils/logger');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const db = require('../config').db;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bluebird = require('bluebird');
const index = require('./routes/index');
const users = require('./routes/users');
const __public = path.join(__dirname, 'public');
const app = express();

const connection = mongoose.createConnection(db.url, {
  keepAlive: true,
  reconnectTries: 30,
  socketTimeoutMS: 0
});

connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.Promise = global.Promise;
mongoose.Promise = bluebird;

app.enable('verbose errors');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);

app.use(morgan('combined', { steam: logger.stream }));
app.use(favicon(path.join(__public, 'assets', 'img', 'favicon.ico')));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Override'));
app.use(express.static(__public));
app.use(session({
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  store: new MongoStore({
    url: db.url,
    mongooseConnection: connection,
    ttl: 14 * 24 * 60 * 60
  })
}));

app.use('/', index);
app.use('/users', users);

app.use(function (req, res, next) {
  'use strict';

  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  'use strict';

  /*res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
      ? err
      : {};*/

  res.status(err.status || 500).render('error.hbs', {
    message: err.message,
    url: req.originalUrl,
    error: err
  });
});

module.exports = app;