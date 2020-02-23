const Koa = require('./koa');

let app = new Koa();

app.use((ctx) => {
  // 原生的
  console.log(ctx.req.method)
  console.log(ctx.request.req.method)
  // 封装的
  console.log(ctx.request.method)
  // request 上的取值是通过 ctx来获取的。ctx 上有req，所以可以获取到
  // 代理模式 proxy
  console.log(ctx.method)
  ctx.body = 'hello world';
  ctx.body = 'hello ...';
  ctx.response.body = 'hello';
}) 

app.listen(3000)