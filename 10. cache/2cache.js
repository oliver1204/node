const path = require('path')
const fs = require('fs').promises
const http = require('http')
const url = require('url')
const {
  createReadStream
} = require('fs')

http.createServer(async (req ,res) => {
  let { pathname } = url.parse(req.url)
  let absPath = path.join(__dirname, pathname)
  let stats = await fs.stat(absPath)

  try {
    if(stats.isDirectory()) {
      absPath = path.join(absPath, 'index.html')
      fs.access(absPath) // absPath 是否存在
    }

    if(req.url.match(/css/)) {
      let ctime = stats.ctime.toGMTString() // 修改时间
      let ifModifiedSince = req.headers['If-Modified-Since']

      res.setHeader('Last-Modified', ctime)

      if(ifModifiedSince === ctime) {
        res.statusCode = 304
        return res.end()
      }
    }

    createReadStream(absPath).pipe(res)
  } catch {
    console.log(`not found`)
  }
}).listen(3000, () => {
  console.log(`listen 3000`)
})