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
  env: process.env.NODE_ENV || 'development',
  server: {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000
  }
};

module.exports = config;