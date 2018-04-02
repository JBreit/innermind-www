const dotenv = require('dotenv');
const db = require('./db');
const server = require('./server');
const session = require('./session');

dotenv.config();

[
  'HOST',
  'NODE_ENV',
  'PORT'
].forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is missing.`);
  }
});

const config = {
  db,
  env: String(process.env.NODE_ENV),
  server,
  session
};

module.exports = config;
