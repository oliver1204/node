const Koa = require('koa')
const views = require('koa-views')
const Router = require('koa-router')
let router = new Router();
let app = new Koa()

router.get('/a', async function (ctx, next) {
  return await ctx.render('index', {
    user: 'John'
  });
});

app.use(views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
}));
 

// 路由的装载 allowedMethods 当前服务其允许的方法
app.use(router.routes())
  .use(router.allowedMethods());

app.on('error', (e) => {
  console.log(e)
})

app.listen(3000)