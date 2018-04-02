const express = require('express');
const { json, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const { handlebars } = require('./helpers');
const { join } = require('path');
const logger = require('../utils/logger');
const methodOverride = require('method-override');
const morgan = require('morgan');
const _session = require('express-session');
const { db, server, session } = require('../config');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(_session);
const bluebird = require('bluebird');
const index = require('./routes/index');
const users = require('./routes/users');

const __public = join(__dirname, 'public');
const app = express();

handlebars(app);

const connection = mongoose.createConnection(db.url, db.options);

connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.Promise = global.Promise;
mongoose.Promise = bluebird;

app.enable('verbose errors');
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));
app.set('json spaces', 2);

app.use(morgan('combined', { steam: logger.stream }));
app.use(favicon(join(__public, 'assets', 'img', 'favicon.ico')));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Override'));
app.use(express.static(__public));
app.use(_session({
  secret: session.secret,
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

app.use((req, res, next) => {
  const err = new Error('Not Found');

  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error.hbs', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

if (!module.parent) {
  const { host, port } = server;
  const message = `> Server listening at http://${host}:${port}.\n`;

  app.listen(port, host, () => logger.info(message));
}

module.exports = app;
