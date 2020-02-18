const http = require('http')
const queryString = require('querystring')
const crypto = require('crypto')
const chalk = require('chalk')

http.createServer((req, res) => {
  req.getCookie = (key) => { //name='123'; age='10'
    let cookies = req.headers['cookie'];
    cookies= queryString.parse(cookies, ';')
    console.log(cookies)
    return cookies[key] || ''
  }

  let cookieArray = []
  res.setCookie = (key, value, options = {}) => {
    // res.setHeader('Set-Cookie', 'name=123;domain=.olifer1')
    let arr = []
    if(options.domain) {
      arr.push('domain', options.domain)
    }
    if(options.maxAge) {
      arr.push('Max-Age', options.maxAge)
    }
    if(options.httpOnly) {
      arr.push('HttpOnly', options.httpOnly)
    }
    if(options.signed) { //  签名

    }
    // .....
    cookieArray.push(`${key}=${value};${arr.join('=')}`)
    return res.setHeader('Set-Cookie', cookieArray)
  }

  if(req.url === '/read') {
    let name = req.getCookie('name')
    console.log(name)
    res.end(name)

  } else if(req.url === '/write') {
    // 过期时间
    res.setCookie('name', '123', { 
      // maxAge: 10 * 1000,
      httpOnly: true,
      signed: true // 要不要加签名
    })
    // 只有在路径🎧域名为.olifer1 才会加的cookie
    // res.setCookie('name', '123', { domain: '.olifer1' })
    // res.setCookie('name', '123', { expires: '-1' })
    // 只有在路径为/a 才会加的cookie
    // res.setCookie('name', '123', { path: '/a' }) 
    res.end('write')
  }
}).listen(3000, () => {
  console.log(`serverl is listen: ${chalk.blue('http://localhost:3000/read')}`)
})