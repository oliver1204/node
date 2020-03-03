const http = require('http');
const url = require('url');
const path = require('path');

function createApplication() {
  const routers = [
    {
      path: '*',
      method: '*',
      handler(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }
    }
  ]
  return {
    get(path, handler) {
      routers.push({
        path,
        method: 'get',
        handler
      })
    },
    listen() {
      const server = http.createServer((req, res) => {
        let { pathname } = url.parse(req.url);
        let reqMethod = req.method.toLowerCase();

        for(let i = 1; i < routers.length; i++) {
          let { path, method, handler } = routers[i];
 
          if(path === pathname && reqMethod === method) {
            return handler(req, res);
          }
        }
        return routers[0].handler(req, res);
      })
      // server.listen.apply(server, arguments)
      server.listen(...arguments)
    }
  }
}
module.exports = createApplication;