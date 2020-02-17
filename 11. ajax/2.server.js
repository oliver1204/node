const path = require('path')
const fs = require('fs').promises
const http = require('http')
const url = require('url')
const chalk = require('chalk');

const {
  createReadStream,
} = require('fs')

http.createServer(async (req ,res) => {
  if(req.url.match(/favicon\.ico/)) return res.end();
  let { pathname } = url.parse(req.url)
  let absPath = path.join(__dirname, pathname)

  try {
    let stats = await fs.stat(absPath)
    if(stats.isFile()) {
      // 防盗链
      let referrer = req.headers['referer'] || req.headers['referrer']

      if(referrer) {
        let origin = req.headers.host.split(':')[0];
        referrer = url.parse(referrer).hostname

        let whiteList = ['olifer2'] // 白名单
        if(origin !== referrer && !whiteList.includes(referrer)) {
          let errImg = path.resolve(__dirname, './2.jpg');
          return createReadStream(errImg).pipe(res);
        }
      }

      createReadStream(absPath).pipe(res);
    } else {
      res.statusCode = 400
      res.end('not found')
    }
    
  } catch(err) {
    console.log(err)
    res.statusCode = 400
    res.end('not found')
  }
}).listen(3000, () => {
  console.log(`serverl is listen: ${chalk.blue('http://localhost:3000/index.html')}`)
})