const zlib = require('zlib')
const path = require('path')
const {
  createReadStream,
  createWriteStream,
  readFileSync,
  writeFileSync
} = require('fs')

let readAbsPath = path.resolve(__dirname, './text.txt');
let writeAbsPath = path.resolve(__dirname, './text.zip');

// readFile模式
let buffer = readFileSync(readAbsPath, 'utf-8')
zlib.gzip(buffer, (err, data) => {
  writeFileSync(writeAbsPath, data)
})

// 流模式 读一点（64kb） -> 压缩一点 -> 写入一点
createReadStream(readAbsPath)
.pipe(zlib.createGzip())
.pipe(createWriteStream(writeAbsPath))