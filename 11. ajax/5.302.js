const path = require('path')
const http = require('http')
const chalk = require('chalk') 
const {
  createReadStream,
} = require('fs')

http.createServer((req, res) => {
  let absPath = path.join(__dirname, '/302.html' )
  let userAgent = req.headers['user-agent']

  // 如果是301，永久重定向定向，
  // 跳过一次必须清缓存后才可以再跳另一个地址
  // 302 临时重定向
  res.statusCode = 302 

  if(userAgent.match(/iPhone|Android/)) {
    res.setHeader('Location', 'https://www.baidu.com')
  } else {
    res.setHeader('Location', 'https://www.google.com')
  }
  createReadStream(absPath).pipe(res)
  
}).listen(3000, () => {
  console.log(`serverl is listen: ${chalk.blue('http://localhost:3000/302.html')}`)
})

