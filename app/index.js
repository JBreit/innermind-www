const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const db = require('./config/db');
const logger = require('../utils/logger');

dotenv.config();

const normalizePort = (val) => {
  var port = parseInt( val, 10 );

  if ( isNaN( port ) ) {
    return val;
  }

  if ( port >= 0 ) {
    return port;
  }

  return false;
};

const host = process.env.HOST || 'http://127.0.0.1';
const port = normalizePort(process.env.PORT || 3000);

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

const server = http.createServer((request, response) => {
  response.write('Test');
  request.pipe(response);
});

server.on('listening', onListening);
server.on('error', onError);

server.listen(port, host);
