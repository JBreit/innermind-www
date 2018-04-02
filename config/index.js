const dotenv = require('dotenv');

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
  db: require('./db'),
  env: String(process.env.NODE_ENV),
  server: require('./server'),
  session: require('./session')
};

module.exports = config;