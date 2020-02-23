const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const bodyparser = require('./koa-bodyparser');
// const bodyparser = require('koa-bodyparser');
const static = require('./koa-static')
// const static = require('koa-static')
let app = new Koa();
// koaBodyparser 是一个中间件，1）可以扩展一些属性和方法， 2）还可以封装一些公共逻辑 3） 决定是否可以向下执行 
// 第三方 插件 koa-bodyparser 就是做这个的

// 中间件就是一个返回真正的async函数的函数
/** 
app.use(bodyparser());

app.use(static(path.resolve(__dirname, 'koa')))

app.use(async (ctx, next) => {
  if (ctx.url === '/form' && ctx.method.toLowerCase() === 'get') {
    let absPath = path.resolve(__dirname, "./index.html");
    ctx.set('Content-type', 'text/html;charset=utf-8');
    ctx.body = fs.createReadStream(absPath);
  } else {
    await next();
  }
});

app.use(async ctx => {
  if (ctx.url === '/form' && ctx.method.toLowerCase() === 'post') {
    ctx.body =  ctx.request.body;
  } else {
    ctx.body = 'not found'
  }
});
*/
app.listen(3000);
