const http = require('http');
const config = require('../config');
const app = require('../app');
const logger = require('../utils/logger');

const normalizePort = (value) => {
  const port = parseInt(value, 10);

  if (Number.isNaN(port)) {
    return value;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const server = http.createServer(app);

const { host } = config.server;
const port = normalizePort(config.server.port);

const onListening = () => {
  const addr = server.address();
  // const bind = typeof addr === 'string'
  //   ? 'pipe ' + addr
  //   : 'port ' + addr.port;

  const message = `> Server listening at http://${host}:${port}.\n`;

  logger.info(message);
};

const onError = (err) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (err.code) {
    case 'EACCES':
      process.stderr.write(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.stderr.write(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
};

server.on('listening', onListening);
server.on('error', onError);

server.listen(port, host);
