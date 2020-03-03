const url = require('url');

// 路由匹配
class Router {
  constructor() {
    this.routers = [{
      path: '*',
      method: '*',
      handler(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }
    }];
  }
  get(path, handler) {
    this.routers.push({
      path,
      method: 'get',
      handler
    })
  }
  handler(req, res, done) {
    let { pathname } = url.parse(req.url);
    let reqMethod = req.method.toLowerCase();
    for(let i = 1; i < this.routers.length; i++) {
      let { path, method, handler } = this.routers[i];

      if(path === pathname && reqMethod === method) {
        return handler(req, res);
      }
    }
    return done();
  }
}

module.exports = Router;