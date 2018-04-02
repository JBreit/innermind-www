const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  host: String(process.env.HOST),
  port: Number(process.env.PORT)
};
