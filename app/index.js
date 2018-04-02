const express = require('express');
const { json, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const { readFileSync } = require('fs');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const { join } = require('path');
const logger = require('../utils/logger');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const config = require('../config');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bluebird = require('bluebird');
const index = require('./routes/index');
const users = require('./routes/users');
const __public = join(__dirname, 'public');
const app = express();

const connection = mongoose.createConnection(config.db.url, config.db.options);

connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.Promise = global.Promise;
mongoose.Promise = bluebird;

let blocks = {};

hbs.registerHelper('extend', (name, context) => {
    let block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', (name) => {
    let val = (blocks[name] || []).join('\n');

    blocks[name] = [];

    return val;
});

hbs.localsAsTemplateData(app);
hbs.registerPartials(__dirname + '/views/partials');

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
app.use(session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  store: new MongoStore({
    url: config.db.url,
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