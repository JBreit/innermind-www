const app = (request, response) => {
  console.log(request.method, request.url);

  response.write(`${request.method} `);
  response.write(request.url);
  request.pipe(response);
};

module.exports = app;
