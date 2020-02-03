## 1. node 中的核心模块 (util/events)
### 1. 1 基于事件的 发布订阅模块
events 常用API有： on，once， off， emit， on('newListener', () => {})

`EventEmitter.js ` 是这个几个API的原理实现。

### 1. 2 util
- inherits 原型继承， 建议用 class extends 替代
- 判断类型的
  - isArray, isBoolean, isFunction, isBuffer, isObject, isString....
- promisify, 将回调函数转成 promise 的形式
- isDeepStrictEqual, 是否严格相等

```js
// promisify
const util = require('util');
const fs = require('fs');
const path = require('path');

let read = util.promisify(fs.readFile)
read(path.resolve(__dirname, './README.md'), 'utf8')
.then((data) => {
  console.log(data)
})

```
