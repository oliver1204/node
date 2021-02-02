const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const url = require('url');
const chalk = require('chalk');

const { createReadStream } = require('fs');

http
  .createServer(async (req, res) => {
    if (req.url.match(/favicon\.ico/)) return res.end();
    let { pathname } = url.parse(req.url);
    let absPath = path.join(__dirname, pathname);

    try {
      let stats = await fs.stat(absPath);
      if (stats.isFile()) {
        createReadStream(absPath).pipe(res);
      } else {
      }
    } catch (err) {
      let arr = [];
      req.on('data', (chunk) => {
        arr.push(chunk);
      });
      req.on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // * 无法设置cookie
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'token, content-type');
        res.setHeader('Access-Control-Max-Age', '1800'); // 30分钟内不发
        if (pathname === '/user') {
          switch (req.method) {
            case 'GET':
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              return res.end(
                JSON.stringify({
                  name: 'olifer',
                  age: 18,
                })
              );
            case 'POST':
              let content = Buffer.concat(arr).toString();
              let data = require('querystring').parse(content);
              res.end(JSON.stringify(data));

            default:
              break;
          }
        } else {
          console.log(err);
        }
      });
    }
  })
  .listen(3000, () => {
    console.log(
      `serverl is listen: ${chalk.blue('http://localhost:3000/index.html')}`
    );
  });
