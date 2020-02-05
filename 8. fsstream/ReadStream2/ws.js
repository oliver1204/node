// 可写流， 异步的 fs.read 异步的 fs.wirte
// 存在异步并发问题
const fs = require('fs');
const path = require('path');

const wsPath = path.resolve(__dirname, './ws.txt')

let ws = fs.createWriteStream(wsPath, {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true,
  emitClose: false,
  start: 0,
  highWaterMark: 3 // 每次写入的最大字节
});
// 只能写入字符串或者buffer
let flag = ws.write('我', (err) => {
  console.log('写入成功！')
})
console.log(flag)
flag = ws.write('2', (err) => {
  console.log('写入成功！')
})
console.log(flag)
flag = ws.write('3', (err) => {
  console.log('写入成功！')
})
console.log(flag)

// 当 写入的字节长度 >= highWaterMark时， flag为false