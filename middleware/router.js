const { parse } = require('url');

class Router {
  constructor() {
    this.routes = [];
  }

  register(method, url, handler) {
    this.routes.push({ method, url, handler });
  }

  resolve(context, request) {
    let path = parse(request.url).pathname;

    for (let { method, url, handler } of this.routes) {
      let match = url.exec(path);

      if (!match || request.method != method) continue;

      let parts = match.slice(1).map(decodeURIComponent);

      return handler(context, ...parts, request);
    }

    return null;
  }
}

module.exports = Router;