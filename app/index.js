const app = (request, response) => {
  const { headers, method, url } = request;
  let body = [];

  request
    .on('error', (error) => {
      process.stderr.write(error.stack);
    })
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      response
        .on('error', (error) => {
          process.stderr.write(error);
        });

      response.writeHead(200, {'Content-Type': 'application/json'});

      const responseBody = { headers, method, url, body };

      response.end(JSON.stringify(responseBody, null, 2));
    });
};

module.exports = app;
