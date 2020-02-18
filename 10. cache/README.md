## 强制缓存、对比缓存、协商缓存
### 强制缓存头 --- Expires和 Cache-Control 
`Expires`和 `Cache-Control` 都表示过期时间，缓存返回的状态码依然是200。 `Expires` 是老版本浏览器的标识，`Cache-Control` 是新版的，为了兼容性，一般`Expires`和 `Cache-Control` 我们都会设置。

`Expires` 时间是相对时间，`Cache-Control` 是用秒来表示.

> 强制缓存的问题： 当文件变化的时候，不会及时更新新的文件，在未过期的时间段内依然会取缓存中的文件

```js
http.createServer(async (req ,res) => {
  let { pathname } = url.parse(req.url)
  let absPath = path.join(__dirname, pathname)
  let stats = await fs.stat(absPath)

  try {
    if(stats.isDirectory()) {
      absPath = path.join(absPath, 'index.html')
      fs.access(absPath) // absPath 是否存在
    }
    // 强制缓存头
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())
    res.setHeader('Cache-Control', 'max-age=10')

    createReadStream(absPath).pipe(res)
  } catch {
    console.log(`not found`)
  }
}).listen(3000, () => {
  console.log(`listen 3000`)
})
```

### 对比缓存 -- Last-Modified

在发送请求后，服务端会带回一个`Last-Modified`请求头，如果客户端发送请求时的所带的`If-Modified-Since`请求和`Last-Modified`时间一致，就从缓存中取，并返回304.

> 1）`If-Modified-Since: Tue, 21 Jan 2020 09:28:01 GMT` 由此可以看到时间时秒的，如果以内改了多次，时无法检测到的。2）很多时候我们会用到cdn，


### 对比缓存-- Etag

```js
// 4cache
...
if(req.url.match(/css/)) {
  let etag = crypto.createHash('md5').update(content).digest('base64');
  let ifNoneMatch = req.headers['if-none-match'];
  
  res.setHeader('ETag', etag);

  if(ifNoneMatch === etag) {
    res.statusCode = 304;
    return res.end()
  }
}
...
```
当 `ETag` 和 `If-None-Match` 的值相等时，返回304， 从缓存中取所需内容。

>总结： 一般 `Expires 和 Cache-Control`、`If-Modified-Since 和 Last-Modified` and ` Etag 和  If-None-Match` 三者会一起使用，存在差异的时候以后者为准（` Etag 和  If-None-Match`最准）。

```js 
// 9. http/4.state-server.js
hasCache() {
  // 加一次缓存
  res.setHeader('Cache-Control', 'max-age=10');
  res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())

  // 对比缓存
  let ctime = stats.ctime.toGMTString() // 修改时间
  let ifModifiedSince = req.headers['If-Modified-Since']
  res.setHeader('Last-Modified', ctime)

  let etag = crypto.createHash('md5').update(content).digest('base64');
  let ifNoneMatch = req.headers['if-none-match'];
  
  res.setHeader('ETag', etag);

  // 先走Last-Modified
  if(ifModifiedSince !== ctime) {
    return false
  }
  // 再走 etag
  if(ifNoneMatch !== etag) {
    return false
  }
  return true
}
```


##  crypto 应用

crypto 是专门用来提供node中一些摘要算法和加密算法的

#### 摘要算法

摘要的特点：
1. 相同的内容摘要出的内容一样
2. 摘要的长度一样
3. 内容不同摘要出的内容也不同 —— 雪崩现象
4. 不可逆，不能由摘要内容反推原内容

常见的例子有md5，所以md5不是加密算法，因为他无法解码。

> MD5 用的是 哈希函数，它的典型应用是对一段信息产生 信息摘要，以 防止被篡改。严格来说，MD5 不是一种 加密算法 而是 摘要算法。无论是多长的输入，MD5 都会输出长度为 128bits 的一个串 (通常用 16 进制 表示为 32 个字符)。

##### md5

```js
const crypto = require('crypto');

let r = crypto.createHash('md5').update('1').digest('base64');
r = crypto.createHash('md5').update('12').digest('base64');
console.log(r)

```

由于 md5 内容一样，算出的结果始终一样，所以md5 可以通过hash表推测出来,不安全

```js
{
  '1': xMpCOKC5I4INzFCab3WEmw==,
  '2': wgrU12/pd1mqJ6DJm/9nEA==
  ....
}

```
##### 加盐算法
相对于 `md5`, 加盐算法更可靠一些，在加密的时候也可以加入一些自己的想法。在反推时，必须知道加密的密钥和盐值。

> SHA1 是和 MD5 一样流行的 消息摘要算法，然而 SHA1 比 MD5 的 安全性更强。对于长度小于 2 ^ 64 位的消息，SHA1 会产生一个 160 位的 消息摘要。基于 MD5、SHA1 的信息摘要特性以及 不可逆 (一般而言)，可以被应用在检查 文件完整性 以及 数字签名 等场景。

```js
let s = crypto.createHmac('sha1', 'olifer').update('olifer').digest('base64'); 
console.log(s)
```
> 常见的应用场所： token。
我们在首次登录时，客户端会向服务器发送登录信息（用户名，密码等），服务器接收到登录信息后，用自己的密钥，生成token，并向客户端返回 `登录信息+token`。完成第一次连接。

当以后登录时，客户端会同时发送 `登录信息+token`，服务器拿到登录信息后和自己的密钥生成一次token1， 如果 token1 === token，则正面已经登录过了。或者根据 `token + 密钥`能找到对应的用户信息，也证明登录过了。
