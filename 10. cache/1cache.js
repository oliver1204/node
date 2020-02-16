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
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())
    res.setHeader('Cache-Control', 'max-age=10')

    createReadStream(absPath).pipe(res)
  } catch {
    console.log(`not found`)
  }
}).listen(3000, () => {
  console.log(`listen 3000`)
})