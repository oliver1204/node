const express = require('express');
const app = express();

/**
 * express 内部会主动注册一个中间件
app.use(function(req, res, next){
  let url = require('url');
  let { path, query } = url.parse(req.url, true);
  req.path = path;
  req.query = query;
  res.send = function(value) {
    if(Buffer.isBuffer(value) || typeof value === 'string') {
      res.end(value);
    } else if(typeof value === 'object') {
      res.end(JSON.stringify(value));
    } else {
      // number..等类型
    }
  }

  next();
})
 */
// koa-static  express 内置了
app.use(express.static(__dirname)); // 默认用当前目录作为静态文件目录

// koa koa-router express 内置了

// koa-bodyparser  express: body-parser
/**
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true})); // 处理表单格式
app.use(bodyparser.json()); // 处理json

app.post('/', function(req, res) {
  res.send(req.body);
})
*/

// koa-multer express: multer
// koa-views express: 内置了
// koa-cookie express: express-cookie
// koa-session express: express-session
/** 
app.get('/', function(req, res, next) {
  console.log(req.path);
  console.log(req.query);
  // res.send({}); // res.end() 只能发送字符串或者buffer，不能是对象
  res.sendFile('./1.server.js', {root: __dirname}); // 或者用path.resolve
});
*/
app.get('/', function(req, res, next) {
  res.render('./1.server.js', {root: __dirname}); // 默认支持 ejs 和 jade
});

app.listen(3000, () => {
  console.log('server is listen 3000')
})