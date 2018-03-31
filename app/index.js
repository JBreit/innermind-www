const app = (request, response) => {
  console.log(request.method, request.url);

  response.write('Test');
  request.pipe(response);
};

module.exports = app;
