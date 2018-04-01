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
  env: String(process.env.NODE_ENV || 'development'),
  server: {
    host: String(process.env.HOST || '127.0.0.1'),
    port: Number(process.env.PORT || 3000)
  }
};

module.exports = config;