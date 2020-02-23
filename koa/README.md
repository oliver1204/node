## kao

koa 基于node封装了req, res的方法，主要为我们提供了 3个方法 use、 on('error')、listen

- application 入口文件
- context 上下文 是req, res 的集合（ request, response ）
- request 自己封装的请求方法
- response 自己封装的响应方法

下面是我们写的一个最基本的 Koa

```js

const Http = require('http')
const Emitter =  require('events');

class Koa extends Emitter {
  constructor(options) {
    super();
  }
  use(fn) {
    this.fn = fn;
    return this;
  }
  handleRequest(req, res) {
    this.fn(req, res)
  }
  listen(...args) {
    let server = Http.createServer(this.handleRequest.bind(this))
    return server.listen(...args)
  }
}

module.exports = Koa

```

### [javascript对象定义set和get的方式解读](https://segmentfault.com/a/1190000009029639)

```js
/**
 * 方式1：使用原始的set 和 get标记设置
 * @type {Object}
*/
var obj1 = {
  name: 'shaanxi',
  get nameGet() {

    return this.name;
  },
  set nameSet(name) {
    this.name = name;
  }
};

console.info(obj1.nameGet);
obj1.nameSet = 'set by set keywords';
console.info(obj1.nameGet);
console.info('------------------------');
/**
 * 方式2：使用原型方法进行设置
 * @type {Object}
 */
var obj2 = {
  name: 'shaanxi'
};

obj2.__defineGetter__('nameGet', function() {
  return this.name;
});
obj2.__defineSetter__('nameSet', function(name) {
  this.name = name;
});
var ref1 = obj2.__lookupGetter__('nameGet');
var ref2 = obj2.__lookupSetter__('nameSet');
console.info(obj2.nameGet);
obj2.nameSet = 'set by __defineSetter__';
console.info(obj2.nameGet);
console.info('-----------------------------');
/**
 * 使用Object.defineProperty()和Object.defineProperties()进行设置
 * @type {Object}
 */
var obj3 = {
  name: "shaanxi"
};

/*Object.defineProperty(obj3, 'nameGet', {
  value: function() {
    return this.name;
  }
});

Object.defineProperty(obj3, 'nameSet', {
  value: function(name) {
    this.name = name;
  }
});*/

Object.defineProperties(obj3, {
  nameGet: {
    value: function() {
      return this.name;
    }
  },
  nameSet: {
    value: function(name) {
      this.name = name;
    }
  }
});

console.info(obj3.nameGet());
obj3.nameSet('set by Object.defineProperty');
console.info(obj3.nameGet());

/**
 * end
 */

```

### `request.js` 的作用
封装了以属于koa 自己的request对象。

```js
const url = require('url')
module.exports = {
  get method() { // 在获取值的时候增加一些袭击的方法
    return this.req.method
  },
  get path() { 
    return url.parse(this.req.url)
  }
}  
```

### `response.js` 的作用
封装了以属于koa 自己的response对象。

```js
module.exports = {
  _body: '', // 只要有 set 和 get 必须又一个第三方的变量
  get body() {
    return this._body
  },
  set body(newValue) {
    /* 可能的类型
    1. string
    2. Buffer
    3. Stream
    4. Object
    */
   console.log(newValue)
    this._body = newValue
  },
  set(field, val) {
    this.res.setHeader(field, val);
  }
}
```

### `context.js` 的作用
`context.js` 实现 request和response的 属性和方法的代理。源码中用了delegate。

```js
const delegate = require('delegates');
```
delegates 原理就是__defineGetter__和__defineSetter__,method是委托方法，getter委托getter,access委托getter和setter。

```js
// proto.status => proto.response.status
 delegate(proto, 'response')
  .access('status')
  .access('body')
```

 context.js代理了request和response。ctx.body指向ctx.response.body。但是此时ctx.response ctx.request还没注入！

> 能会有疑问，为什么response.js和request.js使用get set代理，而context.js使用delegate代理? 原因主要是 set和get方法里面还可以加入一些自己的逻辑处理。而delegate就比较纯粹了，只代理属性。
> 因此context.js比较适合使用delegate，仅仅是代理request和response的属性和方法。

```js
let ctx = {} 

function defineGetter(property, key) {
  ctx.__defineGetter__(key, function() {
    return this[property][key]
  })
}

function defineSetter(property, key) {
  ctx.__defineSetter__(key, function(value) {
    console.log(value)
    this[property][key] = value
  })
}

defineGetter('request', 'method');
defineGetter('request', 'path');
defineGetter('response', 'body');

defineSetter('response', 'body');
defineSetter('response', 'set');


module.exports = ctx
```

### 核心代码 `application.js`

见koa/koa 文件夹

## 使用koa-generator生成koa2项目

```bash
npm install -g koa-generator 

koa2 my-koa
cd my-koa
npm install
npm start //项目跑起来 
```

## 常用的koa 第三方包
* koa-bodyparser 解析body返回值
* koa-router 路由
* koa-static 静态文件
* koa-views 模版
* koa2-multer 上传

* koa-session