
## 基本结构

先回看一下 `express` 使用的的过程， listen 监听端口。

```js
const express = require('express');
const app = express();

app.get('/', (res, req) => {
  req.end('/')
})

app.get('/hello', (res, req) => {
  req.end('/hello')
})

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```

根据上面的使用，我们开始构建一个最初的原理代码。创建一个`createApplication` 对象，返回 `get`，`listen` 方法。

```js
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
```
上面代码中的 `get` 方法的作用是把请求路径跟对应的处理函数存放在一个数组中，当请求到来的时候遍历数组，根据路径找到对应的方法执行。

但是为了实现功能独立清晰，且便于扩展，我们将上面的代码进行拆分。
值得一提的是，`express` 和 `koa` 其实是同一个作者开发的，其原理很多都是类似的，最大的区别就是， `express` 是es5 写的，`koa` 是基于promise 的es6写的，`koa` 很好的处理了 `express` 中的回调问题。

下面我们将上面的代码安装功能进行拆分：

首先是 `express.js` 文件

```js
const Application = require('./application')
function createApplication() {
  return new Application();
}
module.exports = createApplication;
```

 `express.js` 文件，的功能仅仅是注册了一个 `Application` 实例。

 `application.js` 是一个应用， 接下来我们看一下其内容

```js
const http = require('http');
const url = require('url');
const path = require('path');
const Router = require('./router');

// 应用 调用路由去处理
class Application {
  constructor() {
    this._router = new Router();
  }
  get(path, handler) {
    this._router.get(path, handler)
  }
  
  listen() {
    const server = http.createServer((req, res) => {

      function done(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }

      this._router.handler(req, res, done);
    })
    // server.listen.apply(server, arguments)
    server.listen(...arguments)
  }
}

module.exports = Application

```
每次监听到请求时， 我们都会调用 `router` 去做相应的处理。

接下来我们看一下 `router.js` 的内容

```js
const url = require('url');

// 路由匹配
class Router {
  constructor() {
    this.stack = [{
      path: '*',
      method: '*',
      handler(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }
    }];
  }
  get(path, handler) {
    this.stack.push({
      path,
      method: 'get',
      handler
    })
  }
  handler(req, res, done) {
    let { pathname } = url.parse(req.url);
    let reqMethod = req.method.toLowerCase();
    for(let i = 1; i < this.stack.length; i++) {
      let { path, method, handler } = this.stack[i];

      if(path === pathname && reqMethod === method) {
        return handler(req, res);
      }
    }
    return done();
  }
}

module.exports = Router;
```

`router` 中存储了一个 `stack` 数组，将每次的 `get`(或其他请求方法) 一次推入数组。等待请求到来的时候，再次遍历 `stack` 数组，寻找 路径和方法对应的一项进行处理。
```js
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```

优化点：`lazy_router` ，有的时候，我们监听，并没有注册路由，但是上面的代码中我其实也 `new router()`，因此这里我们优化一下 `application.js`

```js
class Application {
  constructor() {
    this._router = null;
  }

  lazy_router() {
    if(!this._router) {
      this._router = new Router();
    }
  }
  
  listen() {
    const server = http.createServer((req, res) => {

      function done(req, res) {
        res.end(`cannot ${req.method} ${req.url}`)
      }

      this.lazy_router();
      this._router.handler(req, res, done);
    })
    // server.listen.apply(server, arguments)
    server.listen(...arguments)
  }
}

methods.map((method) => {
  Application.prototype[method] = function(path, ...handlers) {
    this.lazy_router();
    this._router[method](path, handlers);
  }
})

```

![流程图](http://chuantu.xyz/t6/721/1583204637x2890186046.png)

上图是 `express` 内部运行顺序的原理图。每次 调用 `let app = express()` 时，应用层  `Application`会 `new Router()`产生一个 ` Router `，每个 ` Router ` 中有一个 `stack` 栈，每次有路由或者中间件到来的时候，就存 `stack` 中，我们将每一项称之为一个 `layer`。每个 `layer`中主要包含两个方法：`path`和 `route.dispath`。而 `Route` 就是 `layer.route` 。`Route` 内部也有一个`stack` 存储 对应的 路由下的 `handles` 。每一次请求到来时，先遍历第一层 `layer`，再遍历 `layer` 中的 `Route`， 结束后再遍历下一层 `layer`。

```js
class Layer {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
  }
  match(pathname) {
    return pathname === this.path
  }
  handle_request(req, res, next) {
    this.handler(req, res, next);
  }
};

module.exports = Layer;

```

```js
const Layer = require('./layer');
const methods = require('methods');

class Route {
  constructor() {
    this.stack = [];
    this.methods = {};
  }
  dispatch(req, res, out) {
    let idx = 0;
    console.log('initer')
    let dispatch = () => { 
      if(idx === this.stack.length) return  out(req, res);

      let layer = this.stack[idx++];
      let method = req.method.toLowerCase();
    
      if(layer.method === method) {
        layer.handle_request(req, res, dispatch);
      } else {
        dispatch();
      }
    }
    dispatch();
  }
}

methods.map((method) => {
  Route.prototype[method] = function(handlers) {
    handlers.forEach(handler => {
      let layer = new Layer('/', handler);
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer)
    });
  }
})

module.exports = Route;
```



## express使用中间件
简单说，中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。App实例在运行过程中，会调用一系列的中间件。每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件）。

`use` 是`express`注册中间件的方法 ：
```js
const express = require('express');

const app = express();
let a = 1;
app.use('/', (req, res, next) => {
  a++;
  next()
})

app.use('/', (req, res, next) => {
  res.end(a + '')
})

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```
上面我们讲道了，一个中间件也是一个`layer`层

```js
// application.js
use(path, handler) {
  this.lazy_router();
  this._router.use(path, handler);
}
```

```js
// router/index.js

use(path, handler) {
  let layer = new Layer(path, handler);
  this.stack.push(layer);
}
...

handler(req, res, done) { // 请求到来是，来时匹配路由请求
    let { pathname } = url.parse(req.url);
    let idx = 0;

    let dispatch = () => { //express 和 koa 一样要通过 next迭代
      if(idx === this.stack.length) return  done(req, res);

      let layer = this.stack[idx++];

      if(layer.match(pathname)) {
        if(!layer.route) { // 是中间件 use
          layer.handle_request(req, res, dispatch)
        } else {
          if(layer.route.methods[req.method.toLowerCase()]) {
            layer.handle_request(req, res, dispatch)
          } else {
            dispatch()
          }
        }
      } else {
        dispatch()
      }
    };
    dispatch()
  }

```

```js
// layer

match(pathname) {
  if(pathname === this.path) return true;

  if(!this.route) { // 是中间件 use
    if(pathname === '/') {
      return true;
    } else if(pathname.startsWith(this.path + '/')) {
      return true;
    }
  } 
  return false;
}
```



## express错误处理
下面代码中`next` 就是下一个中间件。如果它带有参数，则代表抛出一个错误，参数为错误文本。

```js
const express = require('./express.alpha_1.0.4/express');
const app = express();

app.get('/', function(req, res, next) {
  next('出错了')
})

app.use(function(err, req, res, next) {
  res.contentType = 'text/html'
  res.end(err)
 })

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```
抛出错误以后，后面的 中间件 和 handler 将不再执行，直到发现一个错误处理函数为止。

后面的 `handler` 不再执行，意味只要跳出 `route` 的 `stack` 数组，直接进入下一层寻找错误处理。

```js
// router/route.js
dispatch(req, res, out) {
    let idx = 0;
    // error 有值，证明有错误抛出，直接out，到router 的 dispatch
    let dispatch = (error) => { 
      if(error) return out(error);
      if(idx === this.stack.length) return  out(req, res);

      let layer = this.stack[idx++];
      let method = req.method.toLowerCase();

      if(layer.method === method) {
        layer.handle_request(req, res, dispatch);
      } else {
        dispatch(error);
      }
    }
    dispatch();
  }
```
```js
// router/index.js
let dispatch = (error) => { 
  if(idx === this.stack.length) return  done(req, res);

  let layer = this.stack[idx++];
  if(error) { // 用户传入错误
    if(!layer.route) { //且是中间件
      layer.error_handler(error, req, res, dispatch);
    } else {
      dispatch(error); // 不是中间件直接忽略
    }
  } else {
    if(layer.match(pathname)) {
      if(!layer.route) { // 是中间件 use
        layerS.handle_request(req, res, dispatch);
      } else {
        if(layer.route.methods[req.method.toLowerCase()]) {
          layer.handle_request(req, res, dispatch)
        } else {
          dispatch()
        }
      }
    } else {
      dispatch()
    }
  }
};
```
```js
// layer.js

error_handler(error, req, res, next) {
    if(this.handler.length === 4)  {
      return this.handler(error, req, res, next);
    } else {
      next(error)
    }
  }
```


## express动态路由参数配置

动态路由是根据参数可以动态匹配路径。

```js
const express = require('express')
const app = express()

// /home/1
// /home/2
app.get('/home/:id', (req, res) => {
  console.log(req.params)
  res.end(Json.stringify(req.params))
})

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```
根据路由里面的参数要匹配符合规则的路由我们需要使用正则来处理，下面代码是根据路径来生成正则的一个方法。根据路径生成正则用的是第三方模块 path-to-regexp 模块，包括 Vue 和 React 的路由都使用到了这个模块。

```js
// layer.js
  const { pathToRegexp }  = require('path-to-regexp');
  ...

  constructor(path, handler) {
    ...
    this.regx = pathToRegexp(path, this.keys = []);
    // regx 路径匹配出来的正则
    // keys 动态路由参数
  }

  match(pathname) {
    ...
    let match = pathname.match(this.regx)
  
    if(match) {
      // [1, olifer]  [{name: 'id'}, {name: 'name'}] => {id: 1, name: olifer}
      let [, ...value] = match;

      this.params = this.keys.reduce((memo, current, index) => (
        memo[current.name] = value[index], memo
        ), {});

      return true;
    }
  }

```
如果正则匹配成功的话，在layer 上再封装一个params属性，方便在应用层赋值给req。

>  两个数组 收敛成一个数组的最佳方式用 reduce。

```js
this.params = this.keys.reduce((memo, current, index) => (
  memo[current.name] = value[index], memo
), {});
```
这段代码实际上是运用了，强制运算符，逗号：取最后一个值 的原理，是下面的代码的简化

```js
this.params = this.keys.reduce((memo, current, index) => {
  memo[current.name] = value[index];
  return memo;
}, {});
```

```js
var a = (1,2,3,4); // a = 4
var a = (1, "aaaaa", 3, "bbbbbbbb"); // a = "bbbbbbbb"
var b = 1;
a = (b = b + 4, 3); // b = 5, a = 3
```

## express处理二级路由
二级(多级)路由配置可以采用以下方式：

```js
// ./router/user
const express = require('./express.alpha_1.0.6/express');
const user = express.Router();

user.get('/add', function(req, res, next) {
  res.end('user add')
})
user.get('/remove', function(req, res, next) {
  res.end('user remove')
})

module.exports  = user;
```
```js
// ./router/article
const express = require('express');
const article = express.Router();

article.get('/add', function(req, res, next) {
  res.end('article add')
})
article.get('/remove', function(req, res, next) {
  res.end('article remove')
})

module.exports  = article;

```
```js
const express = require('express');

const app = express();
const user = require('./router/user');
const article = require('./router/article');

app.use('/user', user);
app.use('/article', article);

app.listen(3000, () => {
  console.log('server is listen 3000')
})
```

`express.Router()` 因为express 是 `es5` 写的。`es5` 的类即可以通过new 来是实例，也可以直接（）调用。但是es6 的类只能通过new 来实现。

```js
createApplication.Router = new Router();
```

```js
// router/index.js
...
let removed = '';
...
if(removed) { //  把刚刚清空的中间路径加回来
  req.url = removed +  req.url;
  removed = '';
}
...
// 这里把中间路径删掉 /user/add => /add
if(layer.path !== '/') {
  removed = layer.path;
  req.url = req.url.slice(removed.length)
}
```
在进入路由的时候删除，中间路径，出来后加上。

## express静态文件服务器
koa有中间件：koa-static   express 内置了
```js
app.use(express.static(__dirname));
```
## express请求体处理
koa有中间件：koa-bodyparser  express有中间件: body-parser

```js
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true})); // 处理表单格式
app.use(bodyparser.json()); // 处理json

app.post('/', function(req, res) {
  res.send(req.body);
})
```

