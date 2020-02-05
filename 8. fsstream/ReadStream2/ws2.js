// 可写流， 异步的 fs.read 异步的 fs.wirte
// 存在异步并发问题
const fs = require('fs');
const path = require('path');
const MyWs = require('./myWS');

const wsPath = path.resolve(__dirname, './ws.txt')

let ws = fs.createWriteStream(wsPath, {
// let ws = new MyWs(wsPath, {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true,
  emitClose: false,
  start: 0,
  highWaterMark: 1 // 每次写入的最大字节
});

// 用一个字节写入10个数字
let i = 0;
function write() {
  let flag = true;
  while ( i < 9 && flag) {
    i ++;
    flag = ws.write(i.toString(), 'utf8', (err) => {
      console.log('写入成功！')
    })
  }
  
  if(i === 9) ws.end('done'); // ws.write + ws.close()
}

write();

// 当写入的内容达到highWaterMark或超过了highWaterMark 触发 on(‘drain’)
ws.on('drain', () => {
  console.log('drain')
  write();
})

// write end on('drain')


