
## 1. Buffer的应用
### 1.1 进制转换
#### 1.1.1 任意进制转换成十进制
```js
parseInt('1111', 2); // 结果为number

// 1 * 2^3 + 1 * 2^2 + 1 * 2^1 + 1 * 2^0 = 15
```
#### 1.1.2 十进制进制转换为任意进制
```js
(0x16).toString(10); // 结果为字符串
// 1 * 16^1 + 6 * 16^0 = 22
(0x16).toString(2)
// 手算过程：先转成10进制（22）， 再转成2进制
(0x6BF0).toString(10);
// 6 * 16^3 + 11 * 16^2 + 15 * 16^1 = 27632
// 24576    + 2816      + 240       = 27632
```

> 数字上的0x(hexadecimal)前缀 代表是十六进制整数， 0(octal) 前缀 代表是八进制整数,  0b(binary) 前缀 代表是二进制整数
### 1.2 base64
base64的优点：1）减少请求 2） 小

#### 1.1.1 转码过程

> 8个位组成一个字节，一个位最大容纳量为 255，即 parseInt('11111111', 2) = 255

- ASCII码包含，英文字母，数组，特殊字符三类。每个英文字母，数组，特殊字符都只占一个字节。
> 英文字母 + 数组 + 特殊字符 总共有127个，小于255，所以最初外国人的编码都是ASCII码，但是后来，还有汉字以及其他国家的文字，255就不够用了，所以又有了中国的GBK。 unicode 想做到统一所有，但是可惜最后被utf-8取代，做到了 统一包含了所有的编码格式。

- GBK， 2个字节表示一个汉字，扩展了(255 -127) * 255 = 32640个字符
- utf8, utf8长度可变，3个字节表示一个汉字（node默认只支持utf8）

```js
Buffer.from('刘'); // <Buffer e5 88 98>
```
Buffer.from 可以将一个汉字转化成2进制的内存，但是Buffer是用16进制表示的。所以转化完是3个16进制。

如果想将 `<Buffer e5 88 98>` 转化为 `base64`, 那么实际上就是将 `3个字节` 转化为 `4个字节` 的过程。

第一步：

```
((0xe5).toString(2) = 11100101;
((0x88).toString(2) = 10001000;
((0x98).toString(2) = 10011000;

等到最终字符串： 11100101 10001000 10011000
```
  
第二步：

```
将 11100101 10001000 10011000 拆成 4份，得到

111001 011000 100010 011000
```

第三步：

```
将 111001 011000 100010 011000 每位不足8位的用0补足，得到最终字符串

00111001 00011000 00100010 00011000
```

第四步：[Base64索引表](https://en.wikipedia.org/wiki/Base64#Base64_table)

```js
// Base64索引表实现
let base64Encoding = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ';
base64Encoding += base64Encoding.toLocaleLowerCase();
base64Encoding += '0123456789+/';

parseInt('00111001', 2) = 57;
parseInt('00011000', 2) = 24;
parseInt('00100010', 2) = 34;
parseInt('00011000', 2) = 24;

base64Encoding[57] + base64Encoding[24] + base64Encoding[34] + base64Encoding[24] = 5YiY
```
> base64是有table可以对应查询的，所以不能用作加密算法。
### 1.3 Buffer
Buffer的特点： 
- 作用是把内容放入内存中， Buffer用来表示内存
- 16进制
- 声明内存，通过长度，把字符串放入内存中。
- 内存申请后不能随意更改长度

```js
// 声明长度为10 的一块内存，默认 00
let buffer = Buffer.alloc(10, 255);
// <Buffer ff ff ff ff ff ff ff ff ff ff>

let buffer = Buffer.alloc(10);
// <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js
// 声明一个字符串长度的内存
let buffer1 = Buffer.from('刘子然');
//<Buffer e5 88 98 e5 ad 90 e7 84 b6>

```

#### 1.3.1 Buffer中常见方法
1) 循环 

```js
buffer.map((item) => {
  console.log(item)
})
```

2） 截取、索引

```js
let r = buffer1.slice(0, 1); // <Buffer e5>

r[1] = 100;
console.log(buffer1[1]); // 136(十进制)
```

3）判断类型

```js
Buffer.isBuffer(buffer); // true

```

4）重写

```js
let buf = Buffer.from('我是前端');

buf.write('后端', 6, 6, 'utf8')
console.log(buf.toString())

```
5）拷贝

```js
let buf1 = Buffer.from('我是');
let buf2 = Buffer.from('前端');

let buf3 = Buffer.alloc(12);
buf1.copy(buf3, 0, 0, 6);
buf1.copy(buf3, 6, 0, 6);
console.log(buf3.toString())

```
6）** 拼接

```js
let buf1 = Buffer.from('我是');
let buf2 = Buffer.from('前端');
let res = Buffer.concat([buf1, buf2]);

console.log(res.toString())
console.log(res.toString('utf8'))
console.log(res.toString('base64'))

```

## 1.4 前端buffer
在后端中，Buffer通常是用来下载html，操作Excel等
前端最常用的是Blob对象和Buffer连用, File 基于 Blob

```js
let str = `<h1>hello buffer</h1>`;
const blob = new Blob([str], {
   type: 'text/html',
});
let a = document.createElement('a');
a.innerHTML = 'download';
a.setAttribute('download', 'a.html');
a.href = URL.createObjectURL(blob);
document.body.appendChild(a);
```

## 3. fs的应用流

## 3. fs的应用流
### 3.1 文件的操作

```js
const fs = require('fs');
const path = require('path');
const util = require('util');

let read = util.promisify(fs.readFile);
let write = util.promisify(fs.writeFile);

read(path.resolve(__dirname, './buffer.js'), 'utf8')
.then(data => {
  write(path.resolve(__dirname, 'write.js'), data)
})
.then(() => {
  console.log('write done');
})

```
fs 模块提供了 fs.readFile, fs.writeFile 等读写方法，但是这两个方法会占用大量内存，例如我们需要读取一个5G的文件，但是一般电脑内存只有8G，这就很尴尬了，但是这样的需求却真实存在着。于是，我们期待着能边读边写边释放内存的方法。node为了解决这个问题开发了一系列流API，可以自己控制读取和写入的个数。

### 3.1.1 读文件

```js
let open = util.promisify(fs.open);
let read = util.promisify(fs.read);
let close = util.promisify(fs.close);
let buffer = Buffer.alloc(3);
let _fd = 0;

open(path.resolve(__dirname, './fs.text'), 'r')
.then((fd) => {
  // fd: 参数中的fd，读取文件的指定符，可以理解为该任务的ID
  //buffer：写入的目标对象， 
  // offset： 目标对象开始位置，
  //length： 预计写入的长度(字节)，
  //position: 从文件的什么位置开始读（索引）
  _fd = fd;
  return read(fd, buffer, 0, 3, 2) 
})
.then((data) => {
  console.log(data.bytesRead); // 读取到的的真实长度
  console.log(data.buffer.toString()); //写入到buffer的内容
  return close(_fd); // 如果不关闭会一直占用
})
.then(() => {
  console.log(`${_fd}关闭成功`);
})
.catch(err => {
  console.log(err);
})

```
### 3.1.2  写文件
 
```js
let buffer = Buffer.from('olifer');
let open = util.promisify(fs.open);
let write = util.promisify(fs.write);
let close = util.promisify(fs.close);
let _fd = 0;

open(path.resolve(__dirname, './fs.text'), 'w')
.then((fd) => {
  _fd = fd;
  return write(fd, buffer, 0, 6, 1)
})
.then((data) => {
  console.log(data.buffer.toString())
  console.log(data.bytesWritten)
  return close(_fd)
})
.then(() => {
  console.log(`${_fd}关闭成功`);
})
.catch(err => {
  console.log(err);
})

```
### 3.1.3  copy

```js
let src = path.resolve(__dirname, './fs.text');// 要拷贝的源文件名。
let dest = path.resolve(__dirname, './aaa.text'); // 拷贝操作的目标文件名。

fs.copyFile(src, dest, (err) => {
  if (err) throw err;
  console.log('源文件已拷贝到目标文件');
});
```
node 为我们封装了	`copyFile` API，其原理就是利用了上面两个函数，先读再写的过程。

### 3.2 文件夹的操作
#### 3.1.1 创建文件夹

```js
fs.mkdirSync(path.resolve(__dirname, './a')); // 同步
fs.mkdir(path.resolve(__dirname, './a'), () => {}); // 异步
```

#### 3.1.1 检测文件夹是否存在

```js
fs.statSync(path.resolve(__dirname, './a')); // 同步
fs.stat(path.resolve(__dirname, './a'), (err, stats) => {
  console.log(err, stats)
}); // 异步
```
#### 3.1.3 删除文件夹

```js
fs.rmdir(path[, options], callback)
fs.rmdirSync(path[, options])

```

