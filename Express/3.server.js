/**
 * 中间件 作用：
 * 1. 控制是否向下执行 （权限管理）
 * 2. 扩展 req, res 中的方法
 * 3. 一般放在路由前面， 可以提前处理一些逻辑
 * */ 


const express = require('./express.alpha_1.0.3/express');

const app = express();
let a = 1;
app.use('/', (req, res, next) => {
  a++;
  next()
})

app.use('/', (req, res, next) => {
  res.end(a + '')
})

app.use('/a', (req, res, next) => {
  a++;
  next()
})

app.use('/a', (req, res, next) => {
  res.end(a + '')
})

app.listen(3000, () => {
  console.log('server is listen 3000')
})