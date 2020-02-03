const fs = require('fs');
const path = require('path');
const myRS = require('./myRS');

// const fileStream = new myRS (path.resolve(__dirname, 'fs.txt'), {
const fileStream = fs.createReadStream(path.resolve(__dirname, 'fs.txt'), {
  flags:'r',
  encoding: null, // 二进制
  fd: null,
  mode: 0o666,
  autoClose: true,
  emitClose: false,
  start: 0,
  end: 15, // 文件读取到第几位结束
  highWaterMark: 2 // 每次读的最大个数
});
let arr = [];

fileStream.on('open', (fd) => {
  console.log('open' + fd)
})
// 读
fileStream.on('data', (data) => { // buffer
  arr.push(data);
})

// 读完
fileStream.on('end', () => { // buffer
  Buffer.concat(arr).toString();
  console.log( Buffer.concat(arr).toString())
})

fileStream.on('close', () => {
  console.log('close')
})

