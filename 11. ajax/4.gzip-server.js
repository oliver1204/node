const zlib = require('zlib')
const path = require('path')
const http = require('http')
const chalk = require('chalk') 
const url = require('url')
const {
  createReadStream,
  createWriteStream,

} = require('fs')

http.createServer((req, res) => {
  let {
    pathname
  } = url.parse(req.url)


  if( pathname === '/gzip.html') {
    let absPath = path.join(__dirname, pathname )
    let reqAcceptEncoding = req.headers['accept-encoding'];

    // node 支持 gzip, deflate 压缩，但是不支持 br 压缩
    if(reqAcceptEncoding.match(/\bgzip\b/)) {
      res.setHeader('Content-Encoding', 'gzip')
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      createReadStream(absPath).pipe(zlib.createGzip()).pipe(res)
    } else if(reqAcceptEncoding.match(/\bdeflate\b/)) {
      res.setHeader('Content-Encoding', 'deflate')
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      createReadStream(absPath).pipe(zlib.createDeflate()).pipe(res)
    } else {
      createReadStream(absPath).pipe(res)
    }
  }
}).listen(3000, () => {
  console.log(`serverl is listen: ${chalk.blue('http://localhost:3000/gzip.html')}`)
})

