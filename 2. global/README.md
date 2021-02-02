## node 全局对象
node 全局对象 `global` 默认是可以直接使用，不用声明, 主模块中，

```js
console.log(this); // 默认文件中的 this 是被修改过的
```
node为了实现模块化，在当前文件执行的时候，在外面包了一层函数，并将函数的this改变了。

通过 `console.log(arguments)` 可以得到包裹文件的函数 -- wrap函数的参数 。

```js
function wrap(exports, require, module, __filename, __dirname) {}
```

如果你需要要输出 `global`对象，可以用下面方式

```js
// 1
(function() {
  console.log(this);
})() // 是实际的 global 对象；
// 2
console.log(global);
```

### global 对象内容

```js
console.log(Object.keys(global))

[ 'DTRACE_NET_SERVER_CONNECTION',
  'DTRACE_NET_STREAM_END',
  'DTRACE_HTTP_SERVER_REQUEST',
  'DTRACE_HTTP_SERVER_RESPONSE',
  'DTRACE_HTTP_CLIENT_REQUEST',
  'DTRACE_HTTP_CLIENT_RESPONSE',
  'global',
  'process',
  'Buffer',
  'clearImmediate',
  'clearInterval',
  'clearTimeout',
  'setImmediate',
  'setInterval',
  'setTimeout' ]

```

### setTimeout 和 setImmediate 对比

```js
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})
```
主模块中， 下面两个函数不一定谁先输出，这取决于电脑性能。下面是node的循环机制， setTimeout属于 timers 阶段，而 setImmediate 属于 check 阶段，如果循环到timers时，时间刚好到了，则 `setTimeout` 先输出，然后到了check阶段，`setImmediate`再输出；否则`setImmediate`先输出。

```
   ┌───────────────────────┐
┌─>│         timers        │   // 执行setTimeout、setInterval的回调函数
│  └───────────┬───────────┘
│  ┌───────────┴───────────┐
│  │   pending callbacks   │  // 当前可能有一些上一阶段（poll）没有执行完的i/o操作
│  └───────────┬───────────┘
│  ┌───────────┴───────────┐
│  │     idle, prepare     │  // 队列的移动，仅内部使用
│  └───────────┬───────────┘      ┌─────────────┐
│  ┌───────────┴───────────┐      │ incoming:   │
│  │         poll          │<─────┤ connections,│ // 轮询，检索新的I/O事件轮，可能会阻塞
│  └───────────┬───────────┘      │ data, etc.  │
│  ┌───────────┴───────────┐      └─────────────┘
│  │         check         │  // 检查阶段，执行setImmediate回调
│  └───────────┬───────────┘
│  ┌───────────┴───────────┐
└──┤    close callbacks    │ // 执行close事件的cb，如socket.on("close",func)
   └───────────────────────┘
```

在非主模块中，比如：

```js

const fs = require('fs');

fs.readFile('./name.txt', 'utf8', function(err, callbacks) {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)
  
  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

无论你运行多少次，结果顺序不会发生改变，一定是setImmediate先输出。因为 `fs.readFile` i/o操作，属于 poll 阶段，poll下面就是 setImmediate 所属的 check 阶段。

上图中显示的每个阶段都对应一个事件队列，当event loop执行到某个阶段时会将当前阶段对应的队列依次执行。当队列执行完毕或者执行数量超过上限时，才会转入下一个阶段。node中的微任务在切换队列时执行

[由setTimeout和setImmediate执行顺序的随机性窥探Node的事件循环机制](https://segmentfault.com/a/1190000013102056?utm_source=tag-newest)

### poll 阶段阻塞

当 poll 阶段中无 check 会阻塞，等待着计时器的到来，继续循环事件流机制。

### process.nextTick

我们知道浏览器的事件任务分为，主任务、宏任务和微任务。

* 常见的宏任务macrotask有：setTimeout、setInterval、 setImmediate(ie浏览器才支持,node中自己也实现了)、MessageChannel

* 常见的微任务microtask有：promise.then()、process.nextTick(node的)

process.nextTick就是一个微任务， 是node用来取代 `Promise.resolve().then()` 的，node 中 process.nextTick 比 Promise快。

```js
Promise.resolve().then(() => {
  console.log('Promise')
})

process.nextTick(() => {
  console.log('process.nextTick')
})
```
结果一定是，先 process.nextTick 后 Promise。

## 进程 process
### 线程和进程

我们应该知道进程比线程要大。一个程序至少要有一个进程，一个进程至少要有一个线程。

浏览器就是多进程的，当一个网页崩溃时不会影响其他网页的正常运行。我们主要了解下一下几个方面：

* 渲染引擎：渲染引擎内部是多线程的,内部包含了两个最重要的线程ui线程和js线程。这里要特别注意ui线程和js线程是互斥的,因为JS运行结果会影响到ui线程的结果。ui更新会被保存在队列中等到js线程空闲时立即被执行。

* js单线程：JavaScript最大的特点就是单线程的，其实应该说其主线程是单线程的。为什么这么说呢？你想一下，如果js是多线程的，我们在页面中这个线程要删了那个元素（不顺眼），另一个线程呢我要保留那个元素（我罩着的），这样岂不是就乱套了。这也是为什么JavaScript执行同步代码，异步代码并不会阻塞代码的运行。

* 其他线程：
 - 浏览器事件触发线程(用来控制事件循环,存放setTimeout、浏览器事件、ajax的回调函数)
 - 定时触发器线程(setTimeout定时器所在线程)
 -异步HTTP请求线程(ajax请求线程)

### process内容

```js
console.log(Object.keys(process))

// 常用的内容有
[
  'platform',  // 区分系统类型 mac:darwin、window:win32
  'argv', // 参数列表
  'cwd',  // 当前目录
  'env'   // 当前环境变量
]

```

#### commander
我们知道在写node的时候，30%的情况下都可以使用 npm 包，commander就是一个可以解析命令行参数的一个插件。安装方法如下：

```bash
npm install commander
```

利用 commander 我们可以解析终端中命令，例如本项目中，

```js
const program = require('commander');

// 1. 追加参数信息
program.on('--help', function() {
  console.log('--help node program xxx');
})

// 2. 自动配置属性
program.option('-a,--action <action>')
program.option('-p,--port <action>', 'set port')

// 3. 自动配置对应的功能
/**
 * 比如在使用， create react app 时，
 * 我们输入命令， create react app，
 * 既可以自动创建一个初始化项目，
 * 用的就是此功能
 */
// node ./global/globalObject.js create
program
.command('create')
.action(function() {
  // 可以去git 仓库拉取代码
  console.log('program create')
})

// 4. 解析参数
// node ./global/globalObject.js --port 4000 --help 
let argv = program.parse(process.argv);
console.log(argv.args)
console.log(argv.port)

```

#### env 环境变量
mac: 终端下输入`export a=1`
Windows: 终端下输入`set a=1`

```js
console.log(process.env)
// 可以看到
{
  ...
  a: '1',
}
```

但是通常情况，我们不希望区分究竟是mac还是Windows， 这时我们可以使用一个npm包 -- `cross-env` 跨平台设置环境变量

安装
```bash
npm install --save-dev cross-env
```
```json
// package.json
"scripts": {
  "test": "cross-env NODE_ENV=production node global/env.js"
}
```

```js
// env.js
console.log(process.env) // NODE_ENV: 'production'
```

#### cwd 当前的工作目录

```js
console.log(process.cwd())
```






