
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


// 1) 读文件

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


// 2） 写文件

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

// 3） copy
let src = path.resolve(__dirname, './fs.text');// 要拷贝的源文件名。
let dest = path.resolve(__dirname, './aaa.text'); // 拷贝操作的目标文件名。

fs.copyFile(src, dest, (err) => {
  if (err) throw err;
  console.log('源文件已拷贝到目标文件');
});

