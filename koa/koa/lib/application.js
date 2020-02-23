const Http = require('http')
const Emitter =  require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream');

class Koa extends Emitter {
  constructor(options) {
    super()
    options = options || {};
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  use(fn) { // compose [fn, fn, fn ] 执行一个删除一个
    this.middleware.push(fn);
    // this.fn = fn
    return this;
  }

  // 返回上下文
  createContext(req, res) {
    let ctx = this.context; // 默认引入的 context 就是 上下文
    ctx.request = this.request;
    ctx.response = this.response;
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;

    return ctx
  }
  compose(middleware, ctx) {
    let i = -1;
    // next 函数
    function dispath(index) {
      if(index < i) return Promise.reject('next() call multiple times');
      if(index === middleware.length) return Promise.resolve();
      i = index;

      return Promise.resolve(middleware[index](ctx, () => dispath(index + 1)));
    }
    dispath(0);
  }
  handleRequest(req, res) {
    let ctx = this.createContext(req, res);
    
    this.compose(this.middleware, ctx);

    let body = ctx.body;

    //  根据不同的body类型返回不同的格式
    if (Buffer.isBuffer(body)) return res.end(body);
    if ('string' == typeof body) return res.end(body);
    if (body instanceof Stream) return body.pipe(res);
    if ('object' === typeof body) {
      ctx.set('Content-Type', 'application/json')
      body = JSON.stringify(body);
      return res.end(body);
    }

    res.end('not found')
  }
  listen(...args) {
    let server = Http.createServer(this.handleRequest.bind(this))
    return server.listen(...args)
  }
}

module.exports = Koa