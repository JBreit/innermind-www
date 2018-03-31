const dotenv = require('dotenv');
const config = require('./config');

dotenv.config();

console.log(`HOST: ${process.env.HOST}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(config.db);