const express = require('./express.alpha_1.0.4/express');
// const express = require('express');
const app = express();

// 抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止。
app.get('/', function(req, res, next) {
  next('出错了')
})

app.get('/a', function(req, res, next) {
  res.end('a')
})

app.use('/', function( err, req, res, next) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(err)
 })

app.listen(3000, () => {
  console.log('server is listen 3000')
})