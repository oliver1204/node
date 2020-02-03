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


