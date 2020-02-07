const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const { createReadStream, createWriteStream, readFileSync } = require('fs');
const path = require('path');

const mime = require('mime');
const chalk = require('chalk'); // 改变打印出的文字颜色
const nunjucks = require('nunjucks');

let templateStr = readFileSync(path.resolve(__dirname, './template.html'));

class Server {
  constructor(config) {
    this.port = config.port;
    this.config = config;
    this.templateStr = templateStr;
  }
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    let absPath = path.join(__dirname, 'public', pathname);

    try {
      let statObj =  await fs.stat(absPath);

      if(statObj.isFile()) { // 是文件
        this.sendFile(absPath, req, res, statObj);
      } else if(statObj.isDirectory()) { // 是文件夹
        // 需要列出所有文件夹的内容
        let child = await fs.readdir(absPath);
        let templeteStr = nunjucks.render(
          path.resolve(__dirname, './template.html'), 
          { items: child }
        );
        
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        res.end(templeteStr);
      } 
    } catch(e) {
      this.sendError(e, res);
    }
  }
  sendFile(currentPath, req, res, stats) {
    res.setHeader('Content-Type', `${mime.getType(currentPath)};charset=UTF-8`);
    createReadStream(currentPath).pipe(res);
  }
  start() {
    let server =  http.createServer(this.handleRequest.bind(this));
    server.listen(this.config);
    console.log('server start in ' + chalk.green(this.port));
  }
  sendError(error, res) {
    res.statusCode = '404';
    res.end('Not Found');
  }
}

module.exports = Server




