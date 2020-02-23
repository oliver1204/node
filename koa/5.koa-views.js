const Koa = require('koa')
const views = require('koa-views')

let app = new Koa()

app.use(views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
}));
 
app.use(async function (ctx) {
  return await ctx.render('index', {
    user: 'John'
  });
});

app.on('error', (e) => {
  console.log(e)
})

app.listen(3000)