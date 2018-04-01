const { createReadStream } = require('fs');
const Router = require('./router');
const router = new Router();

const respond = (response, status, data, type) => {
  response.writeHead(status, { "Content-Type": type || "text/plain" });

  if (data && data.pipe) {
    data.pipe(response);
  }

  response.end(data);
};

const respondAsJSON = (response, status, data) => {
  respond(response, status, JSON.stringify(data), "application/json");
};

router.register('GET', /^\/$/, async (server, response) => {
  if (title in server.data) {
    console.log(server);
    return { body: JSON.stringify(server.data[title]), headers: { 'Content-Type': 'application/json' } };
  }

  return { status: 404, body: `No data '${title}' found`};
});

module.exports = router;