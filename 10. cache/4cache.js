const path = require('path')
const fs = require('fs').promises
const http = require('http')
const url = require('url')
const crypto = require('crypto');

const {
  createReadStream,
  readFileSync
} = require('fs')

http.createServer(async (req ,res) => {
  let { pathname } = url.parse(req.url)
  let absPath = path.join(__dirname, pathname)
  let stats = await fs.stat(absPath)

  try {
    if(stats.isDirectory()) {
      absPath = path.join(absPath, 'index.html')
      console.log(absPath)
      fs.access(absPath) // absPath 是否存在
    }
    let content = readFileSync(absPath, 'utf8');

    if(req.url.match(/css/)) {
      let etag = crypto.createHash('md5').update(content).digest('base64');
      let ifNoneMatch = req.headers['if-none-match'];
      
      res.setHeader('ETag', etag);

      if(ifNoneMatch === etag) {
        res.statusCode = 304;
        return res.end()
      }
    }

    createReadStream(absPath).pipe(res);
  } catch(err) {
    console.log(err)
  }
}).listen(3000, () => {
  console.log(`listen 3000`)
})