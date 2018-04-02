const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  secret: String(process.env.SECRET)
};