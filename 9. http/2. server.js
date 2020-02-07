const http = require('http');
const qurystring = require('querystring');
const port = 3000;

http.createServer((req, res) => { 
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  let arr = [];
  let contentType = req.headers['content-type'];
  req.on('data', (chunck) => {
    arr.push(chunck);
  })
  req.on('end', () => {
    let str = Buffer.concat(arr).toString();
    if(contentType === 'application/json') {
      let obj = JSON.parse(str);
      res.end(obj.name);
      console.log(obj);
    } else if(contentType === 'application/x-www-form-urlencoded') {
      // a=1&b=2&c=3
      // let obj = {};
      // str.replace(/([^&]+)=([^&]+)/g, () => {
      //   obj[arguments[1]] = arguments[2];
      // })
      let obj = qurystring.parse(str, '&', '=');
      console.log(obj);
    } else {
      res.end(str)
    }
  })
}).listen(port, () => {
  console.log('server start' + port)
})