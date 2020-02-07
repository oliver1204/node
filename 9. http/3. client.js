const http = require('http');
/** 
http.get({
  path: '/',
  host: 'localhost',
  port: 3000,
  method: 'get'
}, (res) => {
  console.log(res)
})
*/

let options = {
  path: '/',
  host: 'localhost',
  port: 3000,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  // headers: {
  //   'Content-Type': 'text/plain;charset=UTF-8'
  // }
  // headers: {
  //   'Content-Type': 'application/json'
  // }
};

let client = http.request(options, (res) => {
  res.on('data', (chunk) => {
    // console.log(chunk.toString());
  })
})
// client.end(JSON.stringify({name: 'olifer'}))
client.end('a=1&b=2&c=3')
