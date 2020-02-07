const Http = require('http');
const Url  = require('url');

const server = Http.createServer((req, res) => { 
  // 请求行 ----
  let {
    method, 
    url
  } = req;
  let {
    query,
    pathname
  } = Url.parse(url, true);
  console.log(method, url, pathname, query);
  // 请求头 ----
  console.log(req.headers);
  // 请求体 ----
  let arr = [];
  req.on('data', (err, data) => {
    arr.push(data)
  })
  req.on('end', (err, data) => {
    console.log(Buffer.concat(arr).toString());

    //  要让服务器和客户端说，发送完毕
    res.setHeader('Content-Type', 'application/json; charset=UTF-8')
    res.end('结束了')
    
  })
})

let port = 3000;
server.listen(port, (err, params) => {
  console.log('server start' + port)
})