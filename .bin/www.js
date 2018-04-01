const http = require('http');
const path = require('path');
const config = require('../config');
const db = require('../config/db');
const app = require('../app');
const logger = require('../utils/logger');

const normalizePort = (value) => {
  let port = parseInt(value, 10);

  if (isNaN(port)) {
    return value;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const host = config.server.host;
const port = normalizePort(config.server.port);

const onListening = () => {
  let addr = server.address();
  let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

  logger.info(`> Server listening at http://${host}:${port}.\n`)
};

const onError = (err) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (err.code) {
    case 'EACCES':
      process.stderr.write(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.stderr.write(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw err;
  }
};

const server = http.createServer(app);

server.on('listening', onListening);
server.on('error', onError);

server.listen(port, host);