const http = require('http');
const Router = require('./router');
const methods = require('methods');

// 应用 调用路由去处理
class Application {
  constructor() {
    this._router = null;
  }

  lazy_router() {
    if(!this._router) {
      this._router = new Router();
    }
  }
  use(path, handler) {
    this.lazy_router();
    this._router.use(path, handler);
  }
  
  listen() {
    const server = http.createServer((req, res) => {

      function done(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }

      this.lazy_router();
      this._router.handler(req, res, done);
    })
    // server.listen.apply(server, arguments)
    server.listen(...arguments)
  }
}

methods.map((method) => {
  Application.prototype[method] = function(path, ...handlers) {
    this.lazy_router();
    this._router[method](path, handlers);
  }
})


module.exports = Application
