const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const db = require('./config/db');
const logger = require('../utils/logger');

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

const server = http.createServer((request, response) => {
  response.write('Test');
  request.pipe(response);
});

server.listen(port, host, () => { logger.info(`Server listening at http://${host}:${port}.\n`); });
