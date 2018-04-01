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
  db: {
    url: String('mongodb://127.0.0.1:27017/innermind')
  },
  env: String(process.env.NODE_ENV),
  server: {
    host: String(process.env.HOST),
    port: Number(process.env.PORT)
  }
};

module.exports = config;