const http = require('http');
const url = require('url');
const path = require('path');
const Router = require('./router');

// 应用 调用路由去处理
class Application {
  constructor() {
    this._router = new Router();
  }
  get(path, handler) {
    this._router.get(path, handler)
  }
  
  listen() {
    const server = http.createServer((req, res) => {

      function done(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }

      this._router.handler(req, res, done);
    })
    // server.listen.apply(server, arguments)
    server.listen(...arguments)
  }
}

module.exports = Application
