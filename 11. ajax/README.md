## ajax 的使用和跨域

1. cors

```js
// 指定允许其他域名访问
res.setHeader('Access-Control-Allow-Origin', '*'); // * 无法设置cookie
// 响应类型
res.setHeader('Access-Control-Allow-Methods', 'POST');
// 响应头设置
res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type')
// 多久内可以不发options请请求
res.setHeader('Access-Control-Max-Age', '1800'); // 30分钟内不发

```

2.jsonp

动态的引入一个js脚本，此处不做详细讲述

## 防盗链

例如我们直接地址栏访问百度上的 `https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2261545518,314917585&fm=26&gp=0.jpg` 时，完全访问。但是，当我们在自己的网站加入上面的链接的时候，百度应不允许我们访问，会直接返回一个错误提示图片的，这是为什么呢？

原来每张图片请求头都会带一个 `Referer` 指向图片的服务器地址，只有当请求源，和我们的 `Referer` 是同一个时，才允许访问资源。

```js
// 11. ajax/2server.js
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
```

## 多语言
后端主要是根据 `Accept-Language: zh-CN,zh;q=0.9,en;q=0.8` 这个请求头来判断，返回不同的请求包。

## gizp压缩

实现压缩的npm包 -- zlib

```bash
npm install zlib
```

```js
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
```

当浏览器去请求html等静态界面时，会带上 `Accept-Encoding: gzip, deflate, br` 指明该浏览器支持什么格式的压缩。

服务端，可以根据浏览器支持的压缩格式去压缩。

```js
// 4.gzip-server.js
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
```

## 如何实现301/302

301，永久重定向定向，跳过一次必须清缓存后才可以再跳另一个地址, 302 临时重定向

```js
http.createServer((req, res) => {
  let absPath = path.join(__dirname, '/302.html' )
  let userAgent = req.headers['user-agent']

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
```

## 虚拟机、代理实现

实现代理的npm包 -- http-proxy

```bash
npm install http-proxy
```
原理和 nginx 类似：
```js
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
```

## 206
当我们想使用 `断点续传` 或者 `分段传输` 时，就会用到206.

如果浏览器需要分段上传，那么客户端的请求头会带上 `Range: bytes=0-3`, 当发现有 Range 值后，服务器就会添加 `Accept-Range: bytes` 和 ` Content-Range: bytes 0-3/778`