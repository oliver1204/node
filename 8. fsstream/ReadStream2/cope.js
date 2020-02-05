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

rs.pipe(ws)