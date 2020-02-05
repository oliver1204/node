## stream（流）
流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。

流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。

### 1. 流的类型
Node.js 中有四种基本的流类型：
- Writable - 可写入数据的流（例如 fs.createWriteStream()）。
- Readable - 可读取数据的流（例如 fs.createReadStream()）。
- Duplex - 可读又可写的流（例如 net.Socket）。
- Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。
此外，该模块还包括实用函数 stream.pipeline()、stream.finished() 和 stream.Readable.from()。

####  1.1 createReadStream
原理 `./ReadStream1/myRS.js`

node 内部基于发布订阅模式，实现回调解偶，封装了fs.open, fs.read, fs.write, fs.close等方法

> 这里需要学习和记住的是，解偶两个及以上的异步回调可以使用发布订阅模式

```js
// createRS.js
// 读
fileStream.on('data', (data) => { // buffer
  arr.push(data);
})

// 读完
fileStream.on('end', () => { // buffer
  Buffer.concat(arr).toString();
  console.log( Buffer.concat(arr).toString())
})
```

一般利用 Stream 来读取的文件都是大文件(如果小文件一般都直接用fs.readFile)。但是，仔细观察`createRS.js`文件中读取事件， 我可以发现，其实他也是全部读取成功后再进入end事件的。和fs.readFile没有本质区别。

node 为我们提供了，暂停读方法和继续读的方法。

```js
// 读
fileStream.on('data', (data) => { // buffer
  arr.push(data);
  console.log(data.toString());
  fileStream.pause(); // 暂停读取
})

setTimeout(() => {
  fileStream.resume(); // 恢复读
}, 1000) 

```


####  1.2 createWriteStream
原理 `./ReadStream2/myWS.js`

再写入的时候，第一次写入，无论多长，都是直接写入文件中，第二次开始把内容放在内存中缓存，第一次写入成功后，清空缓存中的第一项， 缓存中的第一项被清空后，再清空第二个直到清空缓存，都清空后，看是否需要触发drain事件，是的话，重新执行write方法

#### 1.3 可读又可写的流

```js
const {
  Duplex
} = require('stream');

class myDuplex extends Duplex {
  constructor() {
    super();
  }
  _write(chunk, encoding, cb) {
    console.log(chunk)
    cb();
  }
  _read() {
    this.push('aa'); 
    this.push(null);
  }
}
```

#### 1.4 转化流 - 在读写过程中可以修改或转换数据

在压缩时常用这个方法, 及 读 => 转化 => 写

```js
const {
  Transform
} = require('stream');

class myTransform extends Transform {
  constructor() {
    super();
  }
  // 可以由写流变为读流或者由读流变为写流
  _transform(chunk, encoding, cb) { 
    console.log(chunk);
    cb();
  }
}

// 读流
process.stdin.on('data', (chunk) => {
  // 写流
  process.stdout.wirte(chunk)
})

// 上面的代码可以简化为： => 

process.stdin.pipe(process.stdout)

// 如果需要转化
let t = new myTransform
process.stdin.pipe(t).pipe(process.stdout);


```

## 2. *管道流 -- pipe，及cope

```js
const fs = require('fs');
const path = require('path');

let rsPath =  path.resolve(__dirname, 'fs.txt');
let wsPath =  path.resolve(__dirname, 'ws.txt');
let rs = fs.createReadStream(rsPath, {
  highWaterMark: 4
});
let ws = fs.createWriteStream(wsPath, {
  highWaterMark: 2
});
let flag = true
rs.on('data', (chunk) => {
  flag = ws.write(chunk);
  if(!flag) rs.pause();
})
ws.on('drain', () => {
  rs.resume();
})

```

node为了方便，为我们提供了pipe API，所以上面的代码可以简化为

```js
// 管道
fs.createReadStrea(rsPath).pipe(fs.createWriteStream(wsPath))

```

## 3. node 的 stream 

```js
const {
  Readable,
  Writable
} = require('stream');

class myWriteStream extends Writable {
  constructor() {
    super();
  }
  _write(chunk, encoding, cb) {
    console.log(chunk)
    cb();
  }
}

let ws = new myWriteStream;

ws.write('123')
ws.write('123')
ws.write('123')
```
`./ReadStream2/myWS.js` 中我们写的write方法，实际上就是 stream - Writable 的 _write， 当我们想写一个自己的流的时候，实际就可以复写 _write方法即可。

> 换句话说，`fs.createReadStream`和`fs.createWriteStream`就是基于stream，封装流自己_write和_read方法。

类似的读流

```js
const {
  Readable
} = require('stream');
class myReadStream extends Readable {
  constructor() {
    super();
    this.index = 0;
  }
  _read() {//变为流的形式
    // push的必须是 string or buffer
    this.push(this.index++ + ''); //触发on('data')
    if(this.index > 9) {
      this.push(null); // 触发on('end')
    }
  }
}

let rs = new myReadStream;
let arr = []

rs.on('data', (chunk) => {
  arr.push(chunk);
})

rs.on('end', () => {
  console.log(Buffer.concat(arr).toString())
})


```

## 3. 总结
- 一般我们看 on('data') on('end) 就是可读流；看到write, on('drain')就是可写流


