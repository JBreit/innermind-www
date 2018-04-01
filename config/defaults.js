const dotenv = require('dotenv');

dotenv.config();

const defaults = [
  'HOST',
  'NODE_ENV',
  'PORT'
];

defaults.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is missing.`);
  }
});