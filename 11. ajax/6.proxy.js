const http = require('http')
const chalk = require('chalk')
const httpProxy = require('http-proxy') 
const proxy = httpProxy.createProxyServer()
const map = {
  'olifer1:8080': 'http://localhost:3000',
  'olifer2:8080': 'http://localhost:4000'
}
http.createServer((req, res) => {
  let host = req.headers['host'];
  console.log(host)
  proxy.web(req, res, {
    target: map[host]
  })
}).listen(8080, () => {
  console.log(`serverl is listen: ${chalk.blue('http://olifer1:8080/')}`)
})