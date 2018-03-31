const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

console.log(`HOST: ${process.env.HOST}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(db);